import { defineConfig } from 'vite'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  build: {
    lib: {
      entry: './src/index.ts',
      name: 'NiceModalVue',
      fileName: 'nice-modal-vue',
    },
  },
  plugins: [vue(), vueJsx()],
})
