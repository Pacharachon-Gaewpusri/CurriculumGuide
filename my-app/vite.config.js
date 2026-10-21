import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: '/CurriculumGuide/', // Set the base path for the application
   server: {
    proxy: {
      // Forward any request starting with /api to the Express backend
      '/api': {
        target: 'https://localhost:5175/CurriculumGuide', // Your Express port
        changeOrigin: true,
      },
    },
   },
  build: {
    // Change the output directory to 'build' instead of 'dist'
    outDir: 'build', 
  },
})
