<template>

  <div v-if="!serial.isOpen" class="page">

    <div class="box">
      <div class="title">vue-serial utility</div>
      <div v-if="!serial.isAvailable">
        <h3>⚠️ Oops!</h3>
        <div>Sorry, either Web Serial API is not available on this web browser, or this page has not been accessed from an HTTPS server.</div>
      </div>
      <div v-else>
        <details class="settings">
          <summary>Set settings</summary>
          <table style="width: 100%">
            <tr>
              <td colspan="2" class="title">SERIAL PORT</td>
            </tr>
            <tr>
              <td style="text-align: right">Baud rate:</td>
              <td>
                <select v-model="serial.baudRate">
                  <option v-for="baudRate of baudRates" :value="baudRate">{{ baudRate }}</option>
                </select>
              </td>
            </tr>
            <tr>
              <td style="text-align: right">Data bits:</td>
              <td>
                <select v-model="serial.dataBits">
                  <option value="7">7</option>
                  <option value="8">8</option>
                </select>
              </td>
            </tr>
            <tr>
              <td style="text-align: right">Stop bits:</td>
              <td>
                <select v-model="serial.stopBits">
                  <option value="1">1</option>
                  <option value="2">2</option>
                </select>
              </td>
            </tr>
            <tr>
              <td style="text-align: right">Parity:</td>
              <td>
                <select v-model="serial.parity">
                  <option value="none">none</option>
                  <option value="even">even</option>
                  <option value="odd">odd</option>
                </select>
              </td>
            </tr>
            <tr>
              <td style="text-align: right">Flow control:</td>
              <td>
                <select v-model="serial.flowControl">
                  <option value="none">none</option>
                  <option value="hardware">hardware</option>
                </select>
              </td>
            </tr>
            <tr>
              <td colspan="2" class="title">DISPLAY</td>
            </tr>
            <tr>
              <td style="text-align: right">Display mode:</td>
              <td>
                <select v-model="display_mode">
                  <option value="text">Raw text</option>
                  <option value="xterm">Terminal (Xterm)</option>
                </select>
              </td>
            </tr>
            <tr>
              <td style="text-align: right">Log commands:</td>
              <td>
                <select v-model="log_commands_yes_no">
                  <option value="yes">yes</option>
                  <option value="no">no</option>
                </select>
              </td>
            </tr>
            <tr>
              <td colspan="2" class="title">INTERNAL</td>
            </tr>
            <tr>
              <td style="text-align: right">Buffer size:</td>
              <td>
                <input type="text" v-model="serial.bufferSize" maxlength="6" style="width: 80px" oninput="this.value = this.value.replace(/\D/g, '')">
              </td>
            </tr>
          </table>
          <button style="opacity: 0.6; font-size: 0.9em; margin: 20px 10px 10px 10px" @click="restoreDefaults">Restore default settings</button>
        </details>
        <div style="display: flex; justify-content: center; text-align: center; margin: 30px 0 20px 0">
          <button @click="connect()" style="display: flex; align-items: center; gap: 10px; padding-left: 16px;">
            <svg width="25" height="25" viewBox="0 0 40 40">
              <path d="M9 16l15 15l-3 3c0 0-3-3-3-3c-2.8 2.8-7.3 4.8-9 3c0 0-5 5-5 5c0 0-3-3-3-3c0 0 5-5 5-5c-2-1.9-0.2-5.8 3-9c0 0-3-3-3-3c0 0 3-3 3-3Z" fill="#afc8e6"/>
              <path d="M31 24l-15-15l3-3c0 0 3 3 3 3c2.8-2.8 7.3-4.8 9-3c0 0 5-5 5-5c0 0 3 3 3 3c0 0-5 5-5 5c2 1.9 .2 5.8-3 9c0 0 3 3 3 3c0 0-3 3-3 3Z" fill="#afc8e6"/>
            </svg>
            Connect to a serial port
          </button>
        </div>
      </div>
    </div>
  </div>

  <div v-else class="page">
    <div class="bar">
      <div>vue-serial</div>
      <div>|</div>
      <div v-if="serial.isConnected" style="color: rgb(80 200 100)">connected</div>
      <div v-else style="color: rgb(255 100 100); text-decoration: dotted underline; cursor: help" title="The serial device has been removed from the computer!">disconnected!</div>
      <div class="settings">
        <div>
          <div>baudrate:</div>
          <select v-model="serial.baudRate">
            <option v-for="baudRate of baudRates" :value="baudRate">{{ baudRate }}</option>
          </select>
        </div>
        <div>
          <div>data bits:</div>
          <select v-model="serial.dataBits">
            <option value="7">7</option>
            <option value="8">8</option>
          </select>
        </div>
        <div>
          <div>parity:</div>
          <select v-model="serial.parity">
            <option value="none">none</option>
            <option value="even">even</option>
            <option value="odd">odd</option>
          </select>
        </div>
        <div>
          <div>flow control:</div>
          <select v-model="serial.flowControl">
            <option value="none">none</option>
            <option value="hardware">hw</option>
          </select>
        </div>
        <div>buffer:<span class="link" @click="prompt_bufferSize">{{ serial.bufferSize }}</span></div>
        <div>
          <div>log commands:</div>
          <select v-model="log_commands_yes_no">
            <option value="yes">yes</option>
            <option value="no">no</option>
          </select>
        </div>
      </div>
      <div style="flex-grow: 1"></div>
      <div style="font-size: 0.8em">
        <button @click="close" :disabled="serial.isClosing">{{ serial.isClosing ? "closing..." : "Close" }}</button>
      </div>
    </div>
    <TerminalView v-if="display_mode == 'xterm'" ref="terminal_view" class="view" @write="write" :log_commands_enabled="(log_commands_yes_no == 'yes')" />
    <SerialLogView v-else ref="serial_log_view" class="view" @write="write" :log_commands_enabled="(log_commands_yes_no == 'yes')" />
  </div>
</template>

<script>
import VueSerial from '../vue-serial.ts'; // set from 'vue-serial' in your application
import SerialLogView from './components/SerialLogView.vue';
import TerminalView from './components/TerminalView.vue';
export default {
  components: { SerialLogView, TerminalView },
  data () {
    return {
      serial: new VueSerial(),
      baudRates: [110, 220, 300, 1200, 2400, 4800, 9600, 19200, 38400, 57600, 115200, 230400, 460800, 921600],
      display_mode: "text",
      log_commands_yes_no: "yes"
    }
  },
  methods: {
    async connect () {
      try {
        await this.serial.connect();
        console.log("Connected to device (VID="+this.serial.usbVendorId+" PID="+this.serial.usbProductId+")");
        this.serial.startSignalsPolling();
      } catch (e) {
        console.error(e);
        alert("Oops! This device port failed to open (make sure settings are valid and it is not already opened in another window).");
      }
    },
    close () {
      if(confirm("Are you sure to close the connection? All content will be lost.")) this.serial.close();
    },
    async read (event) {
      if(this.display_mode == "xterm") await this.$refs.terminal_view.append(event.value);
      else await this.$refs.serial_log_view.append(event.value);
    },
    write (bytes) {
      this.serial.write(bytes);
    },
    restoreDefaults () {
      this.serial.restoreDefaults();
      this.display_mode = "text";
      this.log_commands_yes_no = "yes";
    },
    prompt_bufferSize () {
      const new_bufferSize = prompt("Set the read and write buffers size (in bytes):", this.serial.bufferSize);
      if(new_bufferSize) this.serial.bufferSize = parseInt(new_bufferSize);
    }
  },
  mounted() {
    this.serial.addEventListener("read", this.read);
  },
  watch: {
    "serial.isOpen" (isOpen) {
      window.onbeforeunload = (isOpen) ? () => "A connection is open. Are you sure to close the page?" : null;
    },
    "serial.clearToSend": (clearToSend) => console.log("clearToSend signal has changed to ", clearToSend),
    "serial.dataCarrierDetect": (dataCarrierDetect) => console.log("dataCarrierDetect signal has changed to ", dataCarrierDetect),
    "serial.dataSetReady": (dataSetReady) => console.log("dataSetReady signal has changed to ", dataSetReady),
    "serial.ringIndicator": (ringIndicator) => console.log("ringIndicator signal has changed to ", ringIndicator)
  }
}
</script>

<style scoped>
.page {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-direction: column;
  width: 100%;
  height: 100%;
}
.box {
  width: 100%;
  max-width: 420px;
  background: rgb(255 255 255 / 4%);
  border-radius: 10px;
  margin: 10vh 10px 10px 10px;
  padding: 10px 15px;
}
.title {
  color: rgb(205, 219, 235);
  font-size: 1.1em;
  font-weight: bold;
  padding: 10px 0 0 0;
}
.box > .title {
  font-size: 1.5em;
  text-align: center;
  padding: 10px 0 15px 0;
  margin: 0 0 15px 0;
  border-bottom: solid 1px rgb(255 255 255 / 15%);
}
.box details.settings {
  padding: 5px 10px;
  background: rgb(255 255 255 / 3%);
  border-radius: 5px;
  font-size: 0.8em;
}
.box details.settings summary {
  font-size: 1.2em;
}
.bar {
  display: flex;
  width: 100%;
  min-height: 50px;
  align-items: center;
  justify-content: flex-start;
  gap: 10px;
  padding: 0 5px 0 15px;
  border-bottom: solid 1px rgb(91 104 120 / 50%);
  white-space: nowrap;
}
.bar > .settings {
  display: flex;
  height: 100%;
  align-items: center;
  flex-shrink: 1;
  overflow: auto;
  margin-left: 15px;
  gap: 15px;
  color: rgb(175 200 230 / 60%);
  font-size: 0.85em;
}
.bar > .settings > div {
  display: flex;
}
span.link {
  border-bottom: solid rgb(91 104 120);
}
.view {
  width: 100%;
  min-height: 0;
  flex-grow: 1;
}
</style>
