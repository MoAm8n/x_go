import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer'

export default defineConfig({
  base: "/x_go/",
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
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom'],
          mui: ['@mui/material', '@mui/icons-material'],
          leaflet: ['leaflet', 'react-leaflet'],
          charts: ['recharts'],
          i18n: ['i18next', 'react-i18next'],
          vendor: ['axios', 'lodash']
        },
        entryFileNames: `assets/[name].js`,
        chunkFileNames: `assets/[name].js`,
        assetFileNames: `assets/[name].[ext]`
      }
    }
  },
  server: {
    proxy: {
      // يمكنك إضافة proxy هنا إذا لزم الأمر
    }
  }
})