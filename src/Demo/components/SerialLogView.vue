<template>
  <div class="log_view">
    <div ref="monaco_container" class="monaco_container"></div>
    <input type="text" ref="input" class="input" @keyup="input_keyup" placeholder="Write a command and press the enter key to send it">
  </div>
</template>

<script>
import * as monaco from "monaco-editor"
import editorWorker from "monaco-editor/esm/vs/editor/editor.worker?worker"

/** @type {monaco.editor.IStandaloneCodeEditor} */
let code_editor;

let line_dates = [];

self.MonacoEnvironment = {
  getWorker(_, label) { return new editorWorker(); }
};

export default {
  props: {
    log_commands_enabled: Boolean
  },
  methods: {
    async append (bytes) {
      const scrollLock = code_editor.getScrollTop() + code_editor.getLayoutInfo().height >= code_editor.getScrollHeight();
      const model = code_editor.getModel();
      const endLineNumber = model.getFullModelRange().endLineNumber;
      const endColumn = model.getFullModelRange().endColumn;
      const newLine = endLineNumber > 1 || endColumn > 1;
      const now = new Date();
      line_dates[endLineNumber + (newLine ? 1 : 0)] = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')} `;
      const range = new monaco.Range(endLineNumber, endColumn, endLineNumber, endColumn);
      const decoder = new TextDecoder();
      model.applyEdits([{ range, text: (newLine ? "\n" : "") + (typeof bytes == "string" ? bytes : decoder.decode(bytes)), forceMoveMarkers: true }]);
      if(scrollLock) code_editor.revealLine(code_editor.getModel().getLineCount());
    },
    input_keyup (event) {
      if(event.key == "Enter") {
        if(this.log_commands_enabled) this.append("> "+event.target.value);
        this.$emit("write", event.target.value);
        event.target.value = "";
      }
    }
  },
  mounted () {
    line_dates = [0, "Ready to receive"];
    code_editor = monaco.editor.create(this.$refs.monaco_container, {
      theme: "vs-dark",
      automaticLayout: true,
      padding: { top: 10, bottom: 5 },
      fontSize: 16,
      folding: false,
      scrollBeyondLastLine: false,
      renderLineHighlight: 'none',
      minimap: { enabled: false },
      readOnly: true,
      domReadOnly: true,
      lineNumbers: (i) => (line_dates[i] ?? i),
      lineNumbersMinChars: 22
    });
    this.$refs.input?.focus();
  }
}
</script>
<style scoped>
.log_view {
  display: flex;
  flex-direction: column;
}
.monaco_container {
  min-height: 0;
  flex-grow: 1;
}
input.input {
  width: 100%;
  font-size: 20px;
  border: none;
  border-top: solid 1px rgb(91 104 120 / 50%);
  padding: 10px;
  padding-left: 40px;
  outline: none;
  background: 15px center no-repeat url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="13" height="15" viewBox="0 0 26 30"><path d="M5 5 L18 15 L5 25" stroke="rgb(175 200 230)" fill="none" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"></path></svg>');
}
input.input::placeholder {
  font-size: 16px;
}
</style>