import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,                  // importante para Docker
    port: 5173,
    cors: true,
    proxy: {
      '/sanctum/csrf-cookie': {
        target: 'http://localhost',
        changeOrigin: true,
        secure: false,
      },
      '/login': {
        target: 'http://localhost',
        changeOrigin: true,
        secure: false,
      },
      '/logout': {
        target: 'http://localhost',
        changeOrigin: true,
        secure: false,
      },
      '/api': {
        target: 'http://localhost',
        changeOrigin: true,
        secure: false,
      }
    }
  }
})
