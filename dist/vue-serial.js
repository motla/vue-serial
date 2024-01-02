var z = Object.defineProperty;
var q = (s, r, a) => r in s ? z(s, r, { enumerable: !0, configurable: !0, writable: !0, value: a }) : s[r] = a;
var T = (s, r, a) => (q(s, typeof r != "symbol" ? r + "" : r, a), a), R = (s, r, a) => {
  if (!r.has(s))
    throw TypeError("Cannot " + a);
};
var t = (s, r, a) => (R(s, r, "read from private field"), a ? a.call(s) : r.get(s)), h = (s, r, a) => {
  if (r.has(s))
    throw TypeError("Cannot add the same private member more than once");
  r instanceof WeakSet ? r.add(s) : r.set(s, a);
};
var l = (s, r, a) => (R(s, r, "access private method"), a);
import { ref as o } from "vue";
const I = 115200, _ = 8, m = 1, B = "none", V = 255, E = "none", n = window.localStorage ?? {};
var e, g, P, c, b, d, f, p, y, S, k, v, w;
class x extends EventTarget {
  /**
   * VueSerial instance constructor
   */
  constructor() {
    var a, i, u;
    super();
    // Private asynchronous receiving function
    h(this, g);
    // Private port open function
    h(this, c);
    // Private reset connection function
    h(this, d);
    // Private function for updating signals values
    h(this, p);
    // Private function for polling incoming signals periodically
    h(this, S);
    // Private function to reinitialize variables after closing the port
    h(this, v);
    // Initialize private variables with their default values
    h(this, e, {
      port: null,
      reader: null,
      itv: null,
      isPolling: !1,
      isOpen: o(!1),
      isConnected: o(!1),
      isClosing: o(!1),
      usbVendorId: o(void 0),
      usbProductId: o(void 0),
      baudRate: o(n.VueSerial_baudRate ?? I),
      dataBits: o(n.VueSerial_dataBits ?? _),
      stopBits: o(n.VueSerial_stopBits ?? m),
      parity: o(n.VueSerial_parity ?? B),
      bufferSize: o(n.VueSerial_bufferSize ?? V),
      flowControl: o(n.VueSerial_flowControl ?? E),
      dataCarrierDetect: o(!1),
      clearToSend: o(!1),
      ringIndicator: o(!1),
      dataSetReady: o(!1),
      dataTerminalReady: o(!1),
      requestToSend: o(!1),
      break: o(!1)
    });
    this.isAvailable && ((i = (a = import.meta) == null ? void 0 : a.hot) == null || i.on("vite:beforeUpdate", () => this.close()), (u = navigator.serial) == null || u.addEventListener("disconnect", (C) => {
      C.target == t(this, e).port && (t(this, e).isConnected.value = !1);
    }));
  }
  /**
   * Constant property indicating if the serial feature is available on the client navigator (Web Serial API is implemented and page is served using HTTPS)
   * @readonly
   */
  get isAvailable() {
    return navigator.serial && location.protocol == "https:";
  }
  set isAvailable(a) {
    throw new Error("isAvailable is readonly");
  }
  /**
   * Restore defaults settings
   */
  restoreDefaults() {
    this.baudRate = I, this.dataBits = _, this.stopBits = m, this.parity = B, this.bufferSize = V, this.flowControl = E;
  }
  /**
   * Ask the user to select the serial port and open it
   * @param filters - A list of objects containing vendor and product IDs used to search for attached devices.
   */
  async connect(a) {
    let i = null;
    try {
      i = await navigator.serial.requestPort({ filters: a });
    } catch {
    }
    i && (t(this, e).port && await this.close(), t(this, e).port = i, await l(this, c, b).call(this));
  }
  /**
   * Close the current port if open
   */
  async close() {
    if (!t(this, e).isClosing.value) {
      t(this, e).isClosing.value = !0;
      try {
        t(this, e).reader && await t(this, e).reader.cancel(), t(this, e).port && (await t(this, e).port.close(), await t(this, e).port.forget());
      } catch (a) {
        throw a;
      } finally {
        l(this, v, w).call(this), this.stopSignalsPolling();
      }
    }
  }
  /**
   * Send data to the open serial port
   * @param value - The content to send
   */
  async write(a) {
    if (t(this, e).port && t(this, e).port.writable) {
      typeof a == "string" && (a = new TextEncoder().encode(a));
      const i = Uint8Array.from(a), u = t(this, e).port.writable.getWriter();
      await u.write(i), u.releaseLock();
    }
  }
  /**
   * Get the DCD, CTS, RI and DSR signals (alternative to use built-in polling)
   * @returns Object containing "dataCarrierDetect", "clearToSend", "ringIndicator" and "dataSetReady" booleans
   * @note You can also get the same values in serial.dataCarrierDetect, serial.clearToSend, serial.ringIndicator and serial.dataSetReady
   */
  async getSignals() {
    return await l(this, p, y).call(this);
  }
  /**
   * Set the DTR, RTS and break signals
   * @param signals - object containing either "dataTerminalReady", "requestToSend" and/or "break" booleans
   * @note You can also set the serial.dataTerminalReady, serial.requestToSend, and serial.break variables if you don't need asynchronous control
   */
  async setSignals(a) {
    t(this, e).port && await t(this, e).port.setSignals(a), "dataTerminalReady" in a && !!a.dataTerminalReady != t(this, e).dataTerminalReady.value && (t(this, e).dataTerminalReady.value = !!a.dataTerminalReady), "requestToSend" in a && !!a.requestToSend != t(this, e).requestToSend.value && (t(this, e).requestToSend.value = !!a.requestToSend), "break" in a && !!a.break != t(this, e).break.value && (t(this, e).break.value = !!a.break);
  }
  /**
   * Start listening for signals changes and update the corresponding variables
   * @param interval_ms - Polling interval in ms (100ms if not specified)
   */
  startSignalsPolling(a) {
    t(this, e).itv && clearInterval(t(this, e).itv), t(this, e).itv = setInterval(() => l(this, S, k).call(this), a ?? 100);
  }
  /**
   * Stop listening for signal changes
   */
  stopSignalsPolling() {
    t(this, e).itv && clearInterval(t(this, e).itv), t(this, e).itv = null;
  }
  /**
   * Tracks the active state of the serial port
   * @readonly
   */
  get isOpen() {
    return t(this, e).isOpen.value;
  }
  set isOpen(a) {
    throw new Error("isOpen value is readonly");
  }
  /**
   * Becomes false if the open device has been disconnected
   * @readonly
   */
  get isConnected() {
    return t(this, e).isConnected.value;
  }
  set isConnected(a) {
    throw new Error("isConnected value is readonly");
  }
  /**
   * Becomes true when the device is currently closing (after the close() function has been called)
   * @readonly
   */
  get isClosing() {
    return t(this, e).isClosing.value;
  }
  set isClosing(a) {
    throw new Error("isClosing value is readonly");
  }
  /**
   * Current port USB vendor ID
   * @readonly
   */
  get usbVendorId() {
    return t(this, e).usbVendorId.value;
  }
  set usbVendorId(a) {
    throw new Error("usbVendorId value is readonly");
  }
  /**
   * Current port USB product ID
   * @readonly
   */
  get usbProductId() {
    return t(this, e).usbProductId.value;
  }
  set usbProductId(a) {
    throw new Error("usbProductId value is readonly");
  }
  /**
   * A positive, non-zero value indicating the baud rate at which serial communication should be established
   */
  get baudRate() {
    return t(this, e).baudRate.value;
  }
  set baudRate(a) {
    const i = Math.floor(Number(a));
    if (isNaN(i) || i <= 0)
      throw new Error("baudRate value must be a positive, non-zero value");
    i != t(this, e).baudRate.value && (t(this, e).baudRate.value = i, n.VueSerial_baudRate = i, t(this, e).port && l(this, d, f).call(this));
  }
  /**
   * The number of data bits per frame (either 7 or 8)
   */
  get dataBits() {
    return t(this, e).dataBits.value;
  }
  set dataBits(a) {
    const i = Math.floor(Number(a)) == 7 ? 7 : 8;
    i != t(this, e).dataBits.value && (t(this, e).dataBits.value = i, n.VueSerial_dataBits = i, t(this, e).port && l(this, d, f).call(this));
  }
  /**
   * The number of stop bits per frame (either 1 or 2)
   */
  get stopBits() {
    return t(this, e).stopBits.value;
  }
  set stopBits(a) {
    const i = Math.floor(Number(a)) == 2 ? 2 : 1;
    i != t(this, e).stopBits.value && (t(this, e).stopBits.value = i, n.VueSerial_stopBits = i, t(this, e).port && l(this, d, f).call(this));
  }
  /**
   * The parity mode (either "none", "even" or "odd")
   */
  get parity() {
    return t(this, e).parity.value;
  }
  set parity(a) {
    const i = a == "even" ? "even" : a == "odd" ? "odd" : "none";
    i != t(this, e).parity.value && (t(this, e).parity.value = i, n.VueSerial_parity = i, t(this, e).port && l(this, d, f).call(this));
  }
  /**
   * A positive, non-zero value indicating the size of the read and write buffers that should be created.
   */
  get bufferSize() {
    return t(this, e).bufferSize.value;
  }
  set bufferSize(a) {
    const i = Math.floor(Number(a));
    if (isNaN(i) || i <= 0)
      throw new Error("bufferSize value must be a positive, non-zero value");
    i != t(this, e).bufferSize.value && (t(this, e).bufferSize.value = i, n.VueSerial_bufferSize = i, t(this, e).port && l(this, d, f).call(this));
  }
  /**
   * The flow control mode (either "hardware" or "none")
   */
  get flowControl() {
    return t(this, e).flowControl.value;
  }
  set flowControl(a) {
    const i = a == "hardware" ? "hardware" : "none";
    i != t(this, e).flowControl.value && (t(this, e).flowControl.value = i, n.VueSerial_flowControl = i, t(this, e).port && l(this, d, f).call(this));
  }
  /**
   * Data Carrier Detect (DCD) input signal value
   * @remarks This value must be refreshed manually by calling serial.getSignals() or automatically with serial.startSignalsPolling(...)
   * @readonly
   */
  get dataCarrierDetect() {
    return t(this, e).dataCarrierDetect.value;
  }
  set dataCarrierDetect(a) {
    throw new Error("dataCarrierDetect value is readonly");
  }
  /**
   * Clear To Send (CTS) input signal value
   * @remarks This value must be refreshed manually by calling serial.getSignals() or automatically with serial.startSignalsPolling(...)
   * @readonly
   */
  get clearToSend() {
    return t(this, e).clearToSend.value;
  }
  set clearToSend(a) {
    throw new Error("clearToSend value is readonly");
  }
  /**
   * Ring Indicator (RI) input signal value
   * @remarks This value must be refreshed manually by calling serial.getSignals() or automatically with serial.startSignalsPolling(...)
   * @readonly
   */
  get ringIndicator() {
    return t(this, e).ringIndicator.value;
  }
  set ringIndicator(a) {
    throw new Error("ringIndicator value is readonly");
  }
  /**
   * Data Set Ready (DSR) input signal value
   * @remarks This value must be refreshed manually by calling `serial.getSignals()` or automatically with serial.startSignalsPolling(...)
   * @readonly
   */
  get dataSetReady() {
    return t(this, e).dataSetReady.value;
  }
  set dataSetReady(a) {
    throw new Error("dataSetReady value is readonly");
  }
  /**
   * Data Terminal Ready (DTR) output signal value
   */
  get dataTerminalReady() {
    return t(this, e).dataTerminalReady.value;
  }
  /**
   * @remarks This will be set asynchronously. Prefer `await serial.setSignals({ dataTerminalReady: ... })` for precise asynchronous control
   */
  set dataTerminalReady(a) {
    t(this, e).dataTerminalReady.value = !!a, t(this, e).port && t(this, e).port.setSignals({ dataTerminalReady: t(this, e).dataTerminalReady.value });
  }
  /**
   * Request To Send (RTS) output signal value
   */
  get requestToSend() {
    return t(this, e).requestToSend.value;
  }
  /**
   * @remarks This will be set asynchronously. Prefer `await serial.setSignals({ requestToSend: ... })` for precise asynchronous control
   */
  set requestToSend(a) {
    t(this, e).requestToSend.value = !!a, t(this, e).port && t(this, e).port.setSignals({ requestToSend: t(this, e).requestToSend.value });
  }
  /**
   * Break output signal value
   */
  get break() {
    return t(this, e).break.value;
  }
  /**
   * @remarks This will be set asynchronously. Prefer `await serial.setSignals({ break: ... })` for precise asynchronous control
   */
  set break(a) {
    t(this, e).break.value = !!a, t(this, e).port && t(this, e).port.setSignals({ break: t(this, e).break.value });
  }
}
e = new WeakMap(), g = new WeakSet(), P = async function() {
  if (t(this, e).port)
    for (; t(this, e).port.readable && t(this, e).isClosing.value != !0; ) {
      t(this, e).reader = t(this, e).port.readable.getReader();
      try {
        for (; ; ) {
          const { value: a, done: i } = await t(this, e).reader.read();
          if (i) {
            t(this, e).reader.releaseLock();
            break;
          }
          if (a) {
            const u = new Event("read");
            u.value = a, this.dispatchEvent(u);
          }
        }
      } catch (a) {
        console.log(a);
      }
    }
}, c = new WeakSet(), b = async function() {
  if (t(this, e).port) {
    const a = t(this, e).port.getInfo();
    t(this, e).usbVendorId.value = a.usbVendorId, t(this, e).usbProductId.value = a.usbProductId;
    try {
      await t(this, e).port.open({
        baudRate: t(this, e).baudRate.value,
        dataBits: t(this, e).dataBits.value,
        stopBits: t(this, e).stopBits.value,
        parity: t(this, e).parity.value,
        bufferSize: t(this, e).bufferSize.value,
        flowControl: t(this, e).flowControl.value
      }), t(this, e).isOpen.value = !0, t(this, e).isConnected.value = !0, l(this, g, P).call(this);
    } catch (i) {
      throw l(this, v, w).call(this), i;
    }
  }
}, d = new WeakSet(), f = async function() {
  if (!(!t(this, e).port || t(this, e).isClosing.value)) {
    t(this, e).isClosing.value = !0;
    try {
      t(this, e).reader && await t(this, e).reader.cancel(), t(this, e).port && await t(this, e).port.close(), t(this, e).isClosing.value = !1, await l(this, c, b).call(this);
    } catch (a) {
      l(this, v, w).call(this), this.stopSignalsPolling(), console.error(a);
    }
  }
}, p = new WeakSet(), y = async function() {
  if (!t(this, e).port)
    throw new Error("Signals can't be retrieved as the port is closed");
  const a = await t(this, e).port.getSignals();
  return a.clearToSend != t(this, e).clearToSend.value && (t(this, e).clearToSend.value = a.clearToSend), a.dataCarrierDetect != t(this, e).dataCarrierDetect.value && (t(this, e).dataCarrierDetect.value = a.dataCarrierDetect), a.dataSetReady != t(this, e).dataSetReady.value && (t(this, e).dataSetReady.value = a.dataSetReady), a.ringIndicator != t(this, e).ringIndicator.value && (t(this, e).ringIndicator.value = a.ringIndicator), a;
}, S = new WeakSet(), k = async function() {
  if (t(this, e).port) {
    if (!t(this, e).isPolling) {
      t(this, e).isPolling = !0;
      try {
        await l(this, p, y).call(this);
      } catch {
      }
      t(this, e).isPolling = !1;
    }
  } else
    this.stopSignalsPolling();
}, v = new WeakSet(), w = function() {
  t(this, e).isOpen.value = !1, t(this, e).isConnected.value = !1, t(this, e).isClosing.value = !1, t(this, e).reader = null, t(this, e).port = null, t(this, e).dataCarrierDetect.value = !1, t(this, e).clearToSend.value = !1, t(this, e).ringIndicator.value = !1, t(this, e).dataSetReady.value = !1, t(this, e).dataTerminalReady.value = !1, t(this, e).requestToSend.value = !1, t(this, e).break.value = !1;
}, /**
 * Event which is triggered when data is received from the open device port.
 * Call `serial.addEventListener("read", ({ value }) => { ... })` to read incoming data.
 * @event
 */
T(x, "read");
export {
  x as default
};
