import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
// credit: https://medium.com/@eric_abell/simplifying-api-proxies-in-vite-a-guide-to-vite-config-js-a5cc3a091a2f 
export default defineConfig({
  plugins: [react()],
    server: {
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8001', // Backend server
        changeOrigin: true, // Ensure the request appears to come from the frontend server
        //rewrite: (path) => path.replace(/^\/api/, ''), // Optional: Remove '/api' prefix
      },
      '/users': {
        target: 'http://127.0.0.1:8001', // Backend server
        changeOrigin: true, // Ensure the request appears to come from the frontend server
        //rewrite: (path) => path.replace(/^\/api/, ''), // Optional: Remove '/api' prefix
      },
        '/appointments': {
        target: 'http://127.0.0.1:8001', // Backend server
        changeOrigin: true, // Ensure the request appears to come from the frontend server
        //rewrite: (path) => path.replace(/^\/api/, ''), // Optional: Remove '/api' prefix
      },
        '/reservations': {
        target: 'http://127.0.0.1:8001', // Backend server
        changeOrigin: true, // Ensure the request appears to come from the frontend server
        //rewrite: (path) => path.replace(/^\/api/, ''), // Optional: Remove '/api' prefix
      },
        '/clinics': {
        target: 'http://127.0.0.1:8001', // Backend server
        changeOrigin: true, // Ensure the request appears to come from the frontend server
        //rewrite: (path) => path.replace(/^\/api/, ''), // Optional: Remove '/api' prefix
      },
    },
  },
})
