import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

import path from 'node:path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      'convex-vue': path.resolve(__dirname, '../src/index.ts')
    }
  }
})
