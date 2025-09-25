import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5176, // Changed port to avoid conflict
    strictPort: true
  },
  define: {
    __APP_VERSION__: JSON.stringify('1.0.0')
  }
})
