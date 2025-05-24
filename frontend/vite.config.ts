// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

console.log('>>> VITE_DEV_PORT:', process.env.VITE_DEV_PORT);
console.log('>>> VITE server config loading...');
console.log('>>> process.env.PORT:', process.env.PORT);

export default defineConfig({
  root: '.',
  plugins: [react()],
  server: {
    port: 5173,
    strictPort: true,
    open: true,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },  
  build: {
    chunkSizeWarningLimit: 1500,
    outDir: 'dist',
    sourcemap: true,
    target: 'esnext',
    rollupOptions: {
      external: [],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  base: '',
  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
  },
});

