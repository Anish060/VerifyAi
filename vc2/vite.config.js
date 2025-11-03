import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    outDir: 'dist', // <-- Vercel expects this
  },
  server: {
    port: 5173, // only affects local dev
  },
})
