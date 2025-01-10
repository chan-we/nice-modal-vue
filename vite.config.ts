import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, 'lib/index.ts'),
      name: 'NiceModalVue',
      formats: ['es', 'cjs'],
      fileName: (format) => `index.${format}.js`,
    },
    minify: false,
    rollupOptions: {
      // 确保外部化处理 Vue，不打包进库中
      external: ['vue'],
      output: {
        globals: {
          vue: 'Vue', // UMD 全局变量
        },
      },
    },
  },
  plugins: [vue()],
})
