import { fileURLToPath, URL } from 'node:url'
import { defineConfig, UserConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import basicSsl from '@vitejs/plugin-basic-ssl'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const config: UserConfig = {
    base: "./",
    plugins: [
      vue(), basicSsl()
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    },
    build: {
      outDir: "./docs"
    }
  };
  if(mode == "library") {
    config.build = {
      outDir: "dist",
      sourcemap: true,
      lib: {
        entry: "./src/vue-serial.ts",
        name: "VueSerial",
        fileName: "vue-serial"
      },
      rollupOptions: {
        external: ["vue"],
        output: { globals: { vue: "Vue" }}
      }
    }
  }
  return config;
})
