# 📟 Web Serial for Vue.js

## Features
### :rocket: [See live demo](https://motla.github.io/vue-serial/)
- Easy-to-use event-based API
- States, signals and configuration variables are Vue.js reactive
- Can poll CTS, DCD, DSR, and RI signals
- Serial configuration is stored in the browser localStorage

## Requirements
- Your website must be served with HTTPS
- [The client browser must support Web Serial API](https://caniuse.com/web-serial)
- The `connect()` function must be called from a DOM event

###### :speech_balloon: To setup HTTPS quickly for development with Vite.js, you can use [@vitejs/plugin-basic-ssl](https://github.com/vitejs/vite-plugin-basic-ssl)

## Installation
##### In your Vue.js project:

```
npm install vue-serial
```

###### :speech_balloon: If you prefer static files, import assets from the `dist` folder.

## Examples
###### MyComponent.vue (using Composition API)
```Vue
<template>
  <div style="font-family: sans-serif">
    <div v-if="!serial.isAvailable">Web Serial is not available. Check that this browser supports Web Serial API and this page is served with HTTPS.</div>
    <div v-else>
      <div>vue-serial: {{ serial.isOpen ? "is open (device is " + (serial.isConnected ? "connected)" : "disconnected)") : "is closed" }}</div>
      <div v-if="serial.isOpen"><input ref="input"><button :disabled="!serial.isConnected" @click="user_send">Send to device</button></div>
      <div><button :disabled="serial.isClosing" @click="user_connect">{{ !serial.isOpen ? "Connect to a device..." : "Close connection" }}</button></div>
    </div>
  </div>
</template>

<script setup>
// In this example we use the Vue3 "Composition API" but it works with the "Option API" as well.
import { ref, watch } from 'vue'
import VueSerial from 'vue-serial'

const input = ref(null); // input will contain the `<input ref="input">` element

// Configure the serial settings
const serial = new VueSerial();
serial.baudRate = 115200;
serial.dataBits = 8;
serial.stopBits = 1;
serial.parity = "none";
serial.bufferSize = 255; // set to 1 to receive byte-per-byte
serial.flowControl = "none";

// Function to ask the user to select which serial device to connect
async function user_connect () {
  if(serial.isOpen) await serial.close(); // in your application, encapsulate in a try/catch to manage errors
  else {
    await serial.connect(); // can be `serial.connect([{ usbVendorId:1027 }])` to show only FTDI devices
    if(serial.isOpen) {
      serial.startSignalsPolling(); // (optional) to listen for CTS, DCD, DSR, and RI signal events
      // await serial.write(...); // to send bytes to device automatically after connection
    }
  }
}

// Function to send the value contained in the input
async function user_send () {
  const input_elt = input.value; // refers to <input ref="input">
  const value = input_elt.value;
  await serial.write(value); // in your application, encapsulate in a try/catch to manage errors
  console.log("bytes sent:", value);
}

// This will watch for incoming data
serial.addEventListener("read", ({ value }) => { console.log("bytes read:", value); });

// This will watch for CTS input signals change (startSignalsPolling must be called after the connect function)
watch(() => serial.clearToSend, (value) => { console.log("CTS signal:", value); });

</script>
```
<details>
<summary><small>same example using static files loaded with a CDN (using <strong>Options API</strong>)</small></summary>

```HTML
<html>
<head>
  <script src="https://cdn.jsdelivr.net/npm/vue@3/dist/vue.global.prod.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/vue-serial/dist/vue-serial.umd.cjs"></script>
</head>
<body>
  <div id="app">
    <div style="font-family: sans-serif">
      <div v-if="!serial.isAvailable">Web Serial is not available. Check that this browser supports Web Serial API and this page is served with HTTPS.</div>
      <div v-else>
        <div>vue-serial: {{ serial.isOpen ? "is open (device is " + (serial.isConnected ? "connected)" : "disconnected)") : "is closed" }}</div>
        <div v-if="serial.isOpen"><input ref="input"><button :disabled="!serial.isConnected" @click="user_send">Send to device</button></div>
        <div><button :disabled="serial.isClosing" @click="user_connect">{{ !serial.isOpen ? "Connect to a device..." : "Close connection" }}</button></div>
      </div>
    </div>
  </div>
  <script>
  const app = Vue.createApp({
    data () {
      return {
        serial: new VueSerial();
      }
    },
    mounted () {
      // Configure the serial settings
      this.serial.baudRate = 115200;
      this.serial.dataBits = 8;
      this.serial.stopBits = 1;
      this.serial.parity = "none";
      this.serial.bufferSize = 255; // set to 1 to receive byte-per-byte
      this.serial.flowControl = "none";
      // This will watch for incoming data
      this.serial.addEventListener("read", ({ value }) => { console.log("bytes read:", value); });
    },
    methods: {
      async user_connect () { // Function to ask the user to select which serial device to connect
        if(this.serial.isOpen) await this.serial.close(); // in your application, encapsulate in a try/catch to manage errors
        else {
          await this.serial.connect(); // can be `serial.connect([{ usbVendorId:1027 }])` to show only FTDI devices
          if(this.serial.isOpen) {
            this.serial.startSignalsPolling(); // (optional) to listen for CTS, DCD, DSR, and RI signal events
            // await serial.write(...); // to send bytes to device automatically after connection
          }
        }
      },
      async user_send () { // Function to send the value contained in the input
        const input_elt = input.value; // refers to <input ref="input">
        const value = input_elt.value;
        await this.serial.write(value); // in your application, encapsulate in a try/catch to manage errors
        console.log("bytes sent:", value);
      }
    },
    watch: {
      "serial.clearToSend": (value) => { console.log("CTS signal:", value); }
    }
  }).mount('#app');
  </script>
</body>
</html>
```

</details>

## API
[:book: Read the API](./api/default.md)

## Project development
- `npm run dev` compiles and hot-reloads demo for development
- `npm run build:demo` compiles and minifies demo
- `npm run build:lib` compiles and minifies library
- `npm run typedoc` compiles API documentation

## Licensing
Copyright (c) 2024 Romain Lamothe, [MIT License](LICENSE)
