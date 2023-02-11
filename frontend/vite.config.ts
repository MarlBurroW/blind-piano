import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dotenv from 'dotenv'

dotenv.config();

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: "0.0.0.0",
    port: Number(process.env.PORT) || 3000,
  },
  plugins: [react()],
  build: {
    emptyOutDir: true,
    outDir: '/backend/public'
  }
})
