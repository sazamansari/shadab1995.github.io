import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  assetsInclude: ['**/*.jpeg', '**/*.jpg', '**/*.png', '**/*.gif'],
  server: {
    port: 3000,
    host: true
  }
})
