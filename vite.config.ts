// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer'

export default defineConfig({
  base: "./", // ✅ علشان يشتغل في preview وعلى أي سيرفر عادي
  plugins: [
    react(),
    ViteImageOptimizer({
      jpg: { quality: 70 },
      png: { quality: 80 },
      webp: { quality: 70 }
    })
  ],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    chunkSizeWarningLimit: 1000,
  }
})
