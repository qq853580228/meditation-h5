import vue from '@vitejs/plugin-vue'
import path from 'node:path'
import { defineConfig, type Plugin } from 'vite'
import { mockMiddleware } from './mock/server.ts'

// dev 环境本地 mock 服务：真实 HTTP 请求，DevTools Network 面板可见
const mockServer = (): Plugin => ({
  name: 'mock-server',
  configureServer(server) {
    server.middlewares.use('/api', mockMiddleware)
  },
})

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), mockServer()],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, 'src'),
    },
  },
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
      },
    },
  },
})
