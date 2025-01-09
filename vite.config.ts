import { defineConfig } from 'vite'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  build: {
    lib: {
      entry:  path.resolve(__dirname, 'lib/index.tsx'),
      name: 'NiceModalVue',
      fileName: 'index',
    },
  },
  plugins: [vue(), vueJsx()],
})
