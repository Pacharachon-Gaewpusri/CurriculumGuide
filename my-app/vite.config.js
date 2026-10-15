import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: '/CurriculumGuide/',
  build: {
    // Change the output directory to 'build' instead of 'dist'
    outDir: 'build', 
  },
})
