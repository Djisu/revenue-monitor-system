// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  root: '.',
  plugins: [react()],
  server: {
    open: true, // Automatically open the browser
    proxy: {
      '/api': {
        target: 'http://localhost:3000', // Your backend server
        changeOrigin: true,
      },
    },
  },
  build: {
    chunkSizeWarningLimit: 1500, // Set the limit to 1.5 MB (1500 kB)
    outDir: './dist', // Ensure the output directory is set to 'dist'
    sourcemap: true, // optional
    target: 'esnext',
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  base: '', // Make sure it's set to an empty string if you're deploying to the root
  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
  },
});





