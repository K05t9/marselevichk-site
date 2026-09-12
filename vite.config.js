import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    // локально API можно поднять: node server/server.cjs (порт 3001)
    proxy: {
      '/api': 'http://localhost:3001',
    },
  },
})
