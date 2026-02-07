import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000, // optional, default is 5173
  },
  build: {
    outDir: 'build', // same as CRA
  },
  resolve: {
    alias: [
      { find: '@', replacement: '/src' },
      { find: '@/server', replacement: '../server/src/*' },
    ],
  },
})
