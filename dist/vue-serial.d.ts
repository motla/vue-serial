export default class VueSerial extends EventTarget {
    #private;
    /**
     * Event which is triggered when data is received from the open device port.
     * Call `serial.addEventListener("read", ({ value }) => { ... })` to read incoming data.
     * @event
     */
    static read: string;
    /**
     * VueSerial instance constructor
     */
    constructor();
    /**
     * Constant property indicating if the serial feature is available on the client navigator (Web Serial API is implemented and page is served using HTTPS)
     * @readonly
     */
    get isAvailable(): boolean;
    set isAvailable(x: boolean);
    /**
     * Restore defaults settings
     */
    restoreDefaults(): void;
    /**
     * Ask the user to select the serial port and open it
     * @param filters - A list of objects containing vendor and product IDs used to search for attached devices.
     */
    connect(filters: SerialPortFilter[] | undefined): Promise<void>;
    /**
     * Close the current port if open
     */
    close(): Promise<void>;
    /**
     * Send data to the open serial port
     * @param value - The content to send
     */
    write(value: Iterable<number>): Promise<void>;
    /**
     * Get the DCD, CTS, RI and DSR signals (alternative to use built-in polling)
     * @returns Object containing "dataCarrierDetect", "clearToSend", "ringIndicator" and "dataSetReady" booleans
     * @note You can also get the same values in serial.dataCarrierDetect, serial.clearToSend, serial.ringIndicator and serial.dataSetReady
     */
    getSignals(): Promise<SerialInputSignals>;
    /**
     * Set the DTR, RTS and break signals
     * @param signals - object containing either "dataTerminalReady", "requestToSend" and/or "break" booleans
     * @note You can also set the serial.dataTerminalReady, serial.requestToSend, and serial.break variables if you don't need asynchronous control
     */
    setSignals(signals: SerialOutputSignals): Promise<void>;
    /**
     * Start listening for signals changes and update the corresponding variables
     * @param interval_ms - Polling interval in ms (100ms if not specified)
     */
    startSignalsPolling(interval_ms: number | null): void;
    /**
     * Stop listening for signal changes
     */
    stopSignalsPolling(): void;
    /**
     * Tracks the active state of the serial port
     * @readonly
     */
    get isOpen(): boolean;
    set isOpen(x: boolean);
    /**
     * Becomes false if the open device has been disconnected
     * @readonly
     */
    get isConnected(): boolean;
    set isConnected(x: boolean);
    /**
     * Becomes true when the device is currently closing (after the close() function has been called)
     * @readonly
     */
    get isClosing(): boolean;
    set isClosing(x: boolean);
    /**
     * Current port USB vendor ID
     * @readonly
     */
    get usbVendorId(): number | undefined;
    set usbVendorId(x: number | undefined);
    /**
     * Current port USB product ID
     * @readonly
     */
    get usbProductId(): number | undefined;
    set usbProductId(x: number | undefined);
    /**
     * A positive, non-zero value indicating the baud rate at which serial communication should be established
     */
    get baudRate(): number;
    set baudRate(value: number);
    /**
     * The number of data bits per frame (either 7 or 8)
     */
    get dataBits(): number;
    set dataBits(value: number);
    /**
     * The number of stop bits per frame (either 1 or 2)
     */
    get stopBits(): number;
    set stopBits(value: number);
    /**
     * The parity mode (either "none", "even" or "odd")
     */
    get parity(): ParityType;
    set parity(value: ParityType);
    /**
     * A positive, non-zero value indicating the size of the read and write buffers that should be created.
     */
    get bufferSize(): number;
    set bufferSize(value: number);
    /**
     * The flow control mode (either "hardware" or "none")
     */
    get flowControl(): FlowControlType;
    set flowControl(value: FlowControlType);
    /**
     * Data Carrier Detect (DCD) input signal value
     * @remarks This value must be refreshed manually by calling serial.getSignals() or automatically with serial.startSignalsPolling(...)
     * @readonly
     */
    get dataCarrierDetect(): boolean;
    set dataCarrierDetect(x: boolean);
    /**
     * Clear To Send (CTS) input signal value
     * @remarks This value must be refreshed manually by calling serial.getSignals() or automatically with serial.startSignalsPolling(...)
     * @readonly
     */
    get clearToSend(): boolean;
    set clearToSend(x: boolean);
    /**
     * Ring Indicator (RI) input signal value
     * @remarks This value must be refreshed manually by calling serial.getSignals() or automatically with serial.startSignalsPolling(...)
     * @readonly
     */
    get ringIndicator(): boolean;
    set ringIndicator(x: boolean);
    /**
     * Data Set Ready (DSR) input signal value
     * @remarks This value must be refreshed manually by calling `serial.getSignals()` or automatically with serial.startSignalsPolling(...)
     * @readonly
     */
    get dataSetReady(): boolean;
    set dataSetReady(x: boolean);
    /**
     * Data Terminal Ready (DTR) output signal value
     */
    get dataTerminalReady(): boolean;
    /**
     * @remarks This will be set asynchronously. Prefer `await serial.setSignals({ dataTerminalReady: ... })` for precise asynchronous control
     */
    set dataTerminalReady(value: boolean);
    /**
     * Request To Send (RTS) output signal value
     */
    get requestToSend(): boolean;
    /**
     * @remarks This will be set asynchronously. Prefer `await serial.setSignals({ requestToSend: ... })` for precise asynchronous control
     */
    set requestToSend(value: boolean);
    /**
     * Break output signal value
     */
    get break(): boolean;
    /**
     * @remarks This will be set asynchronously. Prefer `await serial.setSignals({ break: ... })` for precise asynchronous control
     */
    set break(value: boolean);
}
