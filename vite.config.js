// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // base: '/Dream-Scholarships', // Set the base URL for the HEAD
  base: process.env.VITE_BASE_URL || '/Dream-Scholarships',    
  server: {
    port: 3001, // You can change this if needed
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
