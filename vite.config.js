import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  css: {
    preprocessorOptions: {
      less: {
        // Ant Design custom theme dəyişənləri
        javascriptEnabled: true,
        modifyVars: {
          '@primary-color': '#12579e',
          '@link-color': '#1DA57A',
          '@border-radius-base': '6px'
        }
      }
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  }
})
