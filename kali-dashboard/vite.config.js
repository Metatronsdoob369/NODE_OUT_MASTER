import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/NODE_OUT_MASTER/',
  server: {
    port: 3001,
    host: true
  }
})
