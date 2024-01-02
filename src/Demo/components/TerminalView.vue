<template>
  <div ref="terminal_container" class="terminal_container"></div>
</template>

<script>
import { Terminal } from "xterm"
import { FitAddon } from "xterm-addon-fit";
import { WebLinksAddon } from "xterm-addon-web-links";
import "xterm/css/xterm.css";

/** @type {Terminal} */
let term;

/** @type {FitAddon} */
let fitAddon;

export default {
  props: {
    log_commands_enabled: Boolean
  },
  mounted () {
    term = new Terminal({ scrollback: 10000 });
    fitAddon = new FitAddon();
    term.loadAddon(fitAddon);
    term.loadAddon(new WebLinksAddon());
    term.onData((data) => {
      if(this.log_commands_enabled) term.write(data);
      this.$emit("write", data);
    });
    term.open(this.$refs.terminal_container);
    window.addEventListener("resize", this.fit);
    this.fit();
    term.focus();
  },
  beforeUnmount () {
    window.removeEventListener("resize", this.fit);
    term = null;
    fitAddon = null;
  },
  methods: {
    async append (bytes) {
      if(term) {
        await new Promise((resolve) => {
          term.write(bytes, resolve);
        });
      }
    },
    fit () {
      if(fitAddon) fitAddon.fit();
    }
  },
}
</script>
<style scoped>
.terminal_container {
  width: 100%;
  height: 100%;
  background: black;
}
</style>