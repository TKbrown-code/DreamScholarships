// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
<<<<<<< HEAD
  base: process.env.VITE_BASE_PATH || '/Dream-Scholarships',
=======
>>>>>>> c523b2b (auth fix)
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
