import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    minify: 'terser',
    emptyOutDir: true,
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    },
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'chart.js', 'react-chartjs-2'],
          ui: ['lucide-react', 'react-icons', 'framer-motion']
        }
      }
    }
  },
  optimizeDeps: {
    include: ['chart.js', 'react-chartjs-2']
  },
  resolve: {
    dedupe: ['chart.js', 'react', 'react-dom']
  },
  server: {
    port: 3000,
    strictPort: true
  }
}) 