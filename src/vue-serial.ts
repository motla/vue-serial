/// <reference types="vite/client" />
import { ref } from 'vue';
import type { Ref } from 'vue';

// Default values
const default_baudRate = 115200;
const default_dataBits = 8;
const default_stopBits = 1;
const default_parity = "none";
const default_bufferSize = 255;
const default_flowControl = "none";

// Ignore localStorage if not available
const localStorage = window.localStorage ?? {};

// Declare VueSerial class
export default class VueSerial extends EventTarget {

  /**
   * Event which is triggered when data is received from the open device port.
   * Call `serial.addEventListener("read", ({ value }) => { ... })` to read incoming data.
   * @event
   */
  static read: string;
  
  // Initialize private variables with their default values
  #private = {
    port: null as SerialPort|null,
    reader: null as ReadableStreamDefaultReader<any>|null,
    itv: null as ReturnType<typeof setTimeout> | null,
    isPolling: false,
    isOpen: ref(false),
    isConnected: ref(false),
    isClosing: ref(false),
    usbVendorId: ref(undefined) as Ref<number | undefined>,
    usbProductId: ref(undefined) as Ref<number | undefined>,
    baudRate: ref(localStorage.VueSerial_baudRate ?? default_baudRate) as Ref<number>,
    dataBits: ref(localStorage.VueSerial_dataBits ?? default_dataBits) as Ref<number>,
    stopBits: ref(localStorage.VueSerial_stopBits ?? default_stopBits) as Ref<number>,
    parity: ref(localStorage.VueSerial_parity ?? default_parity) as Ref<ParityType>,
    bufferSize: ref(localStorage.VueSerial_bufferSize ?? default_bufferSize) as Ref<number>,
    flowControl: ref(localStorage.VueSerial_flowControl ?? default_flowControl) as Ref<FlowControlType>,
    dataCarrierDetect: ref(false),
    clearToSend: ref(false),
    ringIndicator: ref(false),
    dataSetReady: ref(false),
    dataTerminalReady: ref(false),
    requestToSend: ref(false),
    break: ref(false)
  }

  // Private asynchronous receiving function
  async #start_receive () {
    if(!this.#private.port) return;
    while (this.#private.port.readable && this.#private.isClosing.value != true) {
      this.#private.reader = this.#private.port.readable.getReader();
      try {
        while (true) {
          const { value, done } = await this.#private.reader.read();
          if (done) {
            this.#private.reader.releaseLock(); // allow the serial port to be closed
            break;
          }
          if(value) {
            const event: any = new Event("read");
            event.value = value;
            this.dispatchEvent(event);
          }
        }
      } catch (error) { console.log(error); } // read error (parity error, device lost, etc.)
    }
  }

  // Private port open function
  async #open () {
    if(this.#private.port) {
      const info = this.#private.port.getInfo();
      this.#private.usbVendorId.value = info.usbVendorId;
      this.#private.usbProductId.value = info.usbProductId;
      try {
        await this.#private.port.open({
          baudRate: this.#private.baudRate.value,
          dataBits: this.#private.dataBits.value,
          stopBits: this.#private.stopBits.value,
          parity: this.#private.parity.value,
          bufferSize: this.#private.bufferSize.value,
          flowControl: this.#private.flowControl.value
        });
        // throws here if the serial port is already open in another window
        this.#private.isOpen.value = true;
        this.#private.isConnected.value = true;
        this.#start_receive();
      } catch (e) {
        this.#private_reinitialize();
        throw e;
      }
    }
  }

  // Private reset connection function
  async #reconnect () {
    if(!this.#private.port || this.#private.isClosing.value) return; // prevent concurrent close actions
    this.#private.isClosing.value = true;
    try {
      if(this.#private.reader) await this.#private.reader.cancel();
      if(this.#private.port) await this.#private.port.close();
      this.#private.isClosing.value = false;
      await this.#open();
    } catch (e) {
      this.#private_reinitialize();
      this.stopSignalsPolling();
      console.error(e);
    }
  }

  // Private function for updating signals values
  async #update_signals () {
    if(!this.#private.port) throw new Error("Signals can't be retrieved as the port is closed");
    const signals = await this.#private.port.getSignals();
    if(signals.clearToSend != this.#private.clearToSend.value) this.#private.clearToSend.value = signals.clearToSend;
    if(signals.dataCarrierDetect != this.#private.dataCarrierDetect.value) this.#private.dataCarrierDetect.value = signals.dataCarrierDetect;
    if(signals.dataSetReady != this.#private.dataSetReady.value) this.#private.dataSetReady.value = signals.dataSetReady;
    if(signals.ringIndicator != this.#private.ringIndicator.value) this.#private.ringIndicator.value = signals.ringIndicator;
    return signals;
  }

  // Private function for polling incoming signals periodically
  async #signals_polling () {
    if(this.#private.port) {
      if(!this.#private.isPolling) { // cancel if the previous polling has not finished (if polling interval is too low)
        this.#private.isPolling = true;
        try {
          await this.#update_signals();
        } catch (e) { }
        this.#private.isPolling = false;
      }
    }
    else this.stopSignalsPolling();
  }

  // Private function to reinitialize variables after closing the port
  #private_reinitialize () {
    this.#private.isOpen.value = false;
    this.#private.isConnected.value = false;
    this.#private.isClosing.value = false;
    this.#private.reader = null;
    this.#private.port = null;
    this.#private.dataCarrierDetect.value = false;
    this.#private.clearToSend.value = false;
    this.#private.ringIndicator.value = false;
    this.#private.dataSetReady.value = false;
    this.#private.dataTerminalReady.value = false;
    this.#private.requestToSend.value = false;
    this.#private.break.value = false;
  }
  
  /**
   * VueSerial instance constructor
   */
  constructor () {
    super(); // initialize EventTarget functionality
    if(!this.isAvailable) return; // return here if not available

    // close connection on hot-reloading (during development), as the status variables are reset to their default values
    import.meta?.hot?.on("vite:beforeUpdate", () => this.close());

    // bind event listener for device disconnection
    navigator.serial?.addEventListener("disconnect", (event) => {
      if(event.target == this.#private.port) this.#private.isConnected.value = false;
    });
  }

  /**
   * Constant property indicating if the serial feature is available on the client navigator (Web Serial API is implemented and page is served using HTTPS)
   * @readonly
   */
  get isAvailable () { return (navigator.serial && location.protocol == "https:"); }
  set isAvailable (x) { throw new Error("isAvailable is readonly"); }

  /**
   * Restore defaults settings
   */
  restoreDefaults () {
    // these will also set localStorage values
    this.baudRate = default_baudRate;
    this.dataBits = default_dataBits;
    this.stopBits = default_stopBits;
    this.parity = default_parity;
    this.bufferSize = default_bufferSize;
    this.flowControl = default_flowControl;
  }

  /**
   * Ask the user to select the serial port and open it
   * @param filters - A list of objects containing vendor and product IDs used to search for attached devices.
   */
  async connect (filters: SerialPortFilter[] | undefined) {
    let port = null;
    // ask the user to select a port
    try {
      port = await navigator.serial.requestPort({ filters });
      // throws here if no serial port was selected by the user
    } catch (e) { }
    // open the port with the current defined settings
    if(port) {
      if(this.#private.port) await this.close();
      this.#private.port = port;
      await this.#open();
    }
  }

  /**
   * Close the current port if open
   */
  async close () {
    if(this.#private.isClosing.value) return; // prevent concurrent close actions
    this.#private.isClosing.value = true;
    try {
      if(this.#private.reader) await this.#private.reader.cancel();
      if(this.#private.port) {
        await this.#private.port.close();
        await this.#private.port.forget();
      }
    } catch (e) {
      throw e;
    } finally {
      this.#private_reinitialize();
      this.stopSignalsPolling();
    }
  }

  /**
   * Send data to the open serial port
   * @param value - The content to send
   */
  async write (value: Iterable<number>) {
    if(this.#private.port && this.#private.port.writable) {
      if(typeof value == "string") {
        const encoder = new TextEncoder();
        value = encoder.encode(value);
      }
      const data = Uint8Array.from(value);
      const writer = this.#private.port.writable.getWriter();
      await writer.write(data);
      writer.releaseLock();
    }
  }

  /**
   * Get the DCD, CTS, RI and DSR signals (alternative to use built-in polling)
   * @returns Object containing "dataCarrierDetect", "clearToSend", "ringIndicator" and "dataSetReady" booleans
   * @note You can also get the same values in serial.dataCarrierDetect, serial.clearToSend, serial.ringIndicator and serial.dataSetReady
   */
  async getSignals (): Promise<SerialInputSignals> {
    return await this.#update_signals();
  }

  /**
   * Set the DTR, RTS and break signals
   * @param signals - object containing either "dataTerminalReady", "requestToSend" and/or "break" booleans
   * @note You can also set the serial.dataTerminalReady, serial.requestToSend, and serial.break variables if you don't need asynchronous control
   */
  async setSignals (signals: SerialOutputSignals) {
    if(this.#private.port) await this.#private.port.setSignals(signals);
    if("dataTerminalReady" in signals && !!signals.dataTerminalReady != this.#private.dataTerminalReady.value) this.#private.dataTerminalReady.value = !!signals.dataTerminalReady;
    if("requestToSend" in signals && !!signals.requestToSend != this.#private.requestToSend.value) this.#private.requestToSend.value = !!signals.requestToSend;
    if("break" in signals && !!signals.break != this.#private.break.value) this.#private.break.value = !!signals.break;
  }

  /**
   * Start listening for signals changes and update the corresponding variables
   * @param interval_ms - Polling interval in ms (100ms if not specified)
   */
  startSignalsPolling (interval_ms: number | null) {
    if(this.#private.itv) clearInterval(this.#private.itv);
    this.#private.itv = setInterval(() => this.#signals_polling(), interval_ms ?? 100);
  }

  /**
   * Stop listening for signal changes
   */
  stopSignalsPolling () {
    if(this.#private.itv) clearInterval(this.#private.itv);
    this.#private.itv = null;
  }

  /**
   * Tracks the active state of the serial port
   * @readonly
   */
  get isOpen () { return this.#private.isOpen.value; }
  set isOpen (x) { throw new Error("isOpen value is readonly"); }

  /**
   * Becomes false if the open device has been disconnected
   * @readonly
   */
  get isConnected () { return this.#private.isConnected.value; }
  set isConnected (x) { throw new Error("isConnected value is readonly"); }

  /**
   * Becomes true when the device is currently closing (after the close() function has been called)
   * @readonly
   */
  get isClosing () { return this.#private.isClosing.value; }
  set isClosing (x) { throw new Error("isClosing value is readonly"); }

  /**
   * Current port USB vendor ID
   * @readonly
   */
  get usbVendorId () { return this.#private.usbVendorId.value; }
  set usbVendorId (x) { throw new Error("usbVendorId value is readonly"); }

  /**
   * Current port USB product ID
   * @readonly
   */
  get usbProductId () { return this.#private.usbProductId.value; }
  set usbProductId (x) { throw new Error("usbProductId value is readonly"); }

  /**
   * A positive, non-zero value indicating the baud rate at which serial communication should be established
   */
  get baudRate () { return this.#private.baudRate.value; }
  set baudRate(value: number) {
    const new_value = Math.floor(Number(value));
    if(isNaN(new_value) || new_value <= 0) throw new Error("baudRate value must be a positive, non-zero value");
    if(new_value != this.#private.baudRate.value) {
      this.#private.baudRate.value = new_value;
      localStorage.VueSerial_baudRate = new_value;
      if(this.#private.port) this.#reconnect();
    }
  }

  /**
   * The number of data bits per frame (either 7 or 8)
   */
  get dataBits () { return this.#private.dataBits.value; }
  set dataBits(value) {
    const new_value = (Math.floor(Number(value)) == 7) ? 7 : 8;
    if(new_value != this.#private.dataBits.value) {
      this.#private.dataBits.value = new_value;
      localStorage.VueSerial_dataBits = new_value;
      if(this.#private.port) this.#reconnect();
    }
  }

  /**
   * The number of stop bits per frame (either 1 or 2)
   */
  get stopBits () { return this.#private.stopBits.value; }
  set stopBits (value) {
    const new_value = (Math.floor(Number(value)) == 2) ? 2 : 1;
    if(new_value != this.#private.stopBits.value) {
      this.#private.stopBits.value = new_value;
      localStorage.VueSerial_stopBits = new_value;
      if(this.#private.port) this.#reconnect();
    }
  }

  /**
   * The parity mode (either "none", "even" or "odd")
   */
  get parity () { return this.#private.parity.value; }
  set parity (value) {
    const new_value = (value == "even") ? "even" : ((value == "odd") ? "odd" : "none");
    if(new_value != this.#private.parity.value) {
      this.#private.parity.value = new_value;
      localStorage.VueSerial_parity = new_value;
      if(this.#private.port) this.#reconnect();
    }
  }

  /**
   * A positive, non-zero value indicating the size of the read and write buffers that should be created.
   */
  get bufferSize () { return this.#private.bufferSize.value; }
  set bufferSize (value) {
    const new_value = Math.floor(Number(value));
    if(isNaN(new_value) || new_value <= 0) throw new Error("bufferSize value must be a positive, non-zero value");
    if(new_value != this.#private.bufferSize.value) {
      this.#private.bufferSize.value = new_value;
      localStorage.VueSerial_bufferSize = new_value;
      if(this.#private.port) this.#reconnect();
    }
  }

  /**
   * The flow control mode (either "hardware" or "none")
   */
  get flowControl () { return this.#private.flowControl.value; }
  set flowControl (value) {
    const new_value = (value == "hardware" ? "hardware" : "none");
    if(new_value != this.#private.flowControl.value) {
      this.#private.flowControl.value = new_value;
      localStorage.VueSerial_flowControl = new_value;
      if(this.#private.port) this.#reconnect();
    }
  }

  /**
   * Data Carrier Detect (DCD) input signal value
   * @remarks This value must be refreshed manually by calling serial.getSignals() or automatically with serial.startSignalsPolling(...)
   * @readonly
   */
  get dataCarrierDetect () { return this.#private.dataCarrierDetect.value; }
  set dataCarrierDetect (x) { throw new Error("dataCarrierDetect value is readonly"); }

  /**
   * Clear To Send (CTS) input signal value
   * @remarks This value must be refreshed manually by calling serial.getSignals() or automatically with serial.startSignalsPolling(...)
   * @readonly
   */
  get clearToSend () { return this.#private.clearToSend.value; }
  set clearToSend (x) { throw new Error("clearToSend value is readonly"); }

  /**
   * Ring Indicator (RI) input signal value
   * @remarks This value must be refreshed manually by calling serial.getSignals() or automatically with serial.startSignalsPolling(...)
   * @readonly
   */
  get ringIndicator () { return this.#private.ringIndicator.value; }
  set ringIndicator (x) { throw new Error("ringIndicator value is readonly"); }

  /**
   * Data Set Ready (DSR) input signal value
   * @remarks This value must be refreshed manually by calling `serial.getSignals()` or automatically with serial.startSignalsPolling(...)
   * @readonly
   */
  get dataSetReady () { return this.#private.dataSetReady.value; }
  set dataSetReady (x) { throw new Error("dataSetReady value is readonly"); }

  /**
   * Data Terminal Ready (DTR) output signal value
   */
  get dataTerminalReady () { return this.#private.dataTerminalReady.value; }
  /**
   * @remarks This will be set asynchronously. Prefer `await serial.setSignals({ dataTerminalReady: ... })` for precise asynchronous control
   */
  set dataTerminalReady (value) {
    this.#private.dataTerminalReady.value = !!value;
    if(this.#private.port) this.#private.port.setSignals({ dataTerminalReady: this.#private.dataTerminalReady.value });
  }

  /**
   * Request To Send (RTS) output signal value
   */
  get requestToSend () { return this.#private.requestToSend.value; }
  /**
   * @remarks This will be set asynchronously. Prefer `await serial.setSignals({ requestToSend: ... })` for precise asynchronous control
   */
  set requestToSend (value) {
    this.#private.requestToSend.value = !!value;
    if(this.#private.port) this.#private.port.setSignals({ requestToSend: this.#private.requestToSend.value });
  }

  /**
   * Break output signal value
   */
  get break () { return this.#private.break.value; }
  /**
   * @remarks This will be set asynchronously. Prefer `await serial.setSignals({ break: ... })` for precise asynchronous control
   */
  set break (value) {
    this.#private.break.value = !!value;
    if(this.#private.port) this.#private.port.setSignals({ break: this.#private.break.value });
  }

}