# Class: default

## Hierarchy

- `EventTarget`

  ↳ **`default`**

## Table of contents

### Constructors

- [constructor](./default.md#constructor)

### Accessors

- [baudRate](./default.md#baudrate)
- [break](./default.md#break)
- [bufferSize](./default.md#buffersize)
- [clearToSend](./default.md#cleartosend)
- [dataBits](./default.md#databits)
- [dataCarrierDetect](./default.md#datacarrierdetect)
- [dataSetReady](./default.md#datasetready)
- [dataTerminalReady](./default.md#dataterminalready)
- [flowControl](./default.md#flowcontrol)
- [isAvailable](./default.md#isavailable)
- [isClosing](./default.md#isclosing)
- [isConnected](./default.md#isconnected)
- [isOpen](./default.md#isopen)
- [parity](./default.md#parity)
- [requestToSend](./default.md#requesttosend)
- [ringIndicator](./default.md#ringindicator)
- [stopBits](./default.md#stopbits)
- [usbProductId](./default.md#usbproductid)
- [usbVendorId](./default.md#usbvendorid)

### Methods

- [close](./default.md#close)
- [connect](./default.md#connect)
- [getSignals](./default.md#getsignals)
- [restoreDefaults](./default.md#restoredefaults)
- [setSignals](./default.md#setsignals)
- [startSignalsPolling](./default.md#startsignalspolling)
- [stopSignalsPolling](./default.md#stopsignalspolling)
- [write](./default.md#write)

### Events

- [read](./default.md#read)

## Constructors

### constructor

• **new default**(): [`default`](./default.md)

VueSerial instance constructor

#### Returns

[`default`](./default.md)

#### Overrides

EventTarget.constructor

## Accessors

### baudRate

• `get` **baudRate**(): `number`

A positive, non-zero value indicating the baud rate at which serial communication should be established

#### Returns

`number`

• `set` **baudRate**(`value`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `number` |

#### Returns

`void`

___

### break

• `get` **break**(): `boolean`

Break output signal value

#### Returns

`boolean`

• `set` **break**(`value`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `boolean` |

#### Returns

`void`

**`Remarks`**

This will be set asynchronously. Prefer `await serial.setSignals({ break: ... })` for precise asynchronous control

___

### bufferSize

• `get` **bufferSize**(): `number`

A positive, non-zero value indicating the size of the read and write buffers that should be created.

#### Returns

`number`

• `set` **bufferSize**(`value`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `number` |

#### Returns

`void`

___

### clearToSend

• `get` **clearToSend**(): `boolean`

Clear To Send (CTS) input signal value

#### Returns

`boolean`

**`Remarks`**

This value must be refreshed manually by calling serial.getSignals() or automatically with serial.startSignalsPolling(...)

___

### dataBits

• `get` **dataBits**(): `number`

The number of data bits per frame (either 7 or 8)

#### Returns

`number`

• `set` **dataBits**(`value`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `number` |

#### Returns

`void`

___

### dataCarrierDetect

• `get` **dataCarrierDetect**(): `boolean`

Data Carrier Detect (DCD) input signal value

#### Returns

`boolean`

**`Remarks`**

This value must be refreshed manually by calling serial.getSignals() or automatically with serial.startSignalsPolling(...)

___

### dataSetReady

• `get` **dataSetReady**(): `boolean`

Data Set Ready (DSR) input signal value

#### Returns

`boolean`

**`Remarks`**

This value must be refreshed manually by calling `serial.getSignals()` or automatically with serial.startSignalsPolling(...)

___

### dataTerminalReady

• `get` **dataTerminalReady**(): `boolean`

Data Terminal Ready (DTR) output signal value

#### Returns

`boolean`

• `set` **dataTerminalReady**(`value`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `boolean` |

#### Returns

`void`

**`Remarks`**

This will be set asynchronously. Prefer `await serial.setSignals({ dataTerminalReady: ... })` for precise asynchronous control

___

### flowControl

• `get` **flowControl**(): `FlowControlType`

The flow control mode (either "hardware" or "none")

#### Returns

`FlowControlType`

• `set` **flowControl**(`value`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `FlowControlType` |

#### Returns

`void`

___

### isAvailable

• `get` **isAvailable**(): `boolean`

Constant property indicating if the serial feature is available on the client navigator (Web Serial API is implemented and page is served using HTTPS)

#### Returns

`boolean`

___

### isClosing

• `get` **isClosing**(): `boolean`

Becomes true when the device is currently closing (after the close() function has been called)

#### Returns

`boolean`

___

### isConnected

• `get` **isConnected**(): `boolean`

Becomes false if the open device has been disconnected

#### Returns

`boolean`

___

### isOpen

• `get` **isOpen**(): `boolean`

Tracks the active state of the serial port

#### Returns

`boolean`

___

### parity

• `get` **parity**(): `ParityType`

The parity mode (either "none", "even" or "odd")

#### Returns

`ParityType`

• `set` **parity**(`value`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `ParityType` |

#### Returns

`void`

___

### requestToSend

• `get` **requestToSend**(): `boolean`

Request To Send (RTS) output signal value

#### Returns

`boolean`

• `set` **requestToSend**(`value`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `boolean` |

#### Returns

`void`

**`Remarks`**

This will be set asynchronously. Prefer `await serial.setSignals({ requestToSend: ... })` for precise asynchronous control

___

### ringIndicator

• `get` **ringIndicator**(): `boolean`

Ring Indicator (RI) input signal value

#### Returns

`boolean`

**`Remarks`**

This value must be refreshed manually by calling serial.getSignals() or automatically with serial.startSignalsPolling(...)

___

### stopBits

• `get` **stopBits**(): `number`

The number of stop bits per frame (either 1 or 2)

#### Returns

`number`

• `set` **stopBits**(`value`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `number` |

#### Returns

`void`

___

### usbProductId

• `get` **usbProductId**(): `undefined` \| `number`

Current port USB product ID

#### Returns

`undefined` \| `number`

___

### usbVendorId

• `get` **usbVendorId**(): `undefined` \| `number`

Current port USB vendor ID

#### Returns

`undefined` \| `number`

## Methods

### close

▸ **close**(): `Promise`\<`void`\>

Close the current port if open

#### Returns

`Promise`\<`void`\>

___

### connect

▸ **connect**(`filters`): `Promise`\<`void`\>

Ask the user to select the serial port and open it

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `filters` | `undefined` \| `SerialPortFilter`[] | A list of objects containing vendor and product IDs used to search for attached devices. |

#### Returns

`Promise`\<`void`\>

___

### getSignals

▸ **getSignals**(): `Promise`\<`SerialInputSignals`\>

Get the DCD, CTS, RI and DSR signals (alternative to use built-in polling)

#### Returns

`Promise`\<`SerialInputSignals`\>

Object containing "dataCarrierDetect", "clearToSend", "ringIndicator" and "dataSetReady" booleans

**`Note`**

You can also get the same values in serial.dataCarrierDetect, serial.clearToSend, serial.ringIndicator and serial.dataSetReady

___

### restoreDefaults

▸ **restoreDefaults**(): `void`

Restore defaults settings

#### Returns

`void`

___

### setSignals

▸ **setSignals**(`signals`): `Promise`\<`void`\>

Set the DTR, RTS and break signals

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `signals` | `SerialOutputSignals` | object containing either "dataTerminalReady", "requestToSend" and/or "break" booleans |

#### Returns

`Promise`\<`void`\>

**`Note`**

You can also set the serial.dataTerminalReady, serial.requestToSend, and serial.break variables if you don't need asynchronous control

___

### startSignalsPolling

▸ **startSignalsPolling**(`interval_ms`): `void`

Start listening for signals changes and update the corresponding variables

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `interval_ms` | ``null`` \| `number` | Polling interval in ms (100ms if not specified) |

#### Returns

`void`

___

### stopSignalsPolling

▸ **stopSignalsPolling**(): `void`

Stop listening for signal changes

#### Returns

`void`

___

### write

▸ **write**(`value`): `Promise`\<`void`\>

Send data to the open serial port

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `value` | `Iterable`\<`number`\> | The content to send |

#### Returns

`Promise`\<`void`\>

## Events

### read

▪ `Static` **read**: `string`

Event which is triggered when data is received from the open device port.
Call `serial.addEventListener("read", ({ value }) => { ... })` to read incoming data.
