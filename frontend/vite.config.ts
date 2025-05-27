// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Force port to be 5173 regardless of environment variables
const FORCE_PORT = 5173;

console.log('>>> FORCING PORT TO:', FORCE_PORT);
console.log('>>> VITE_DEV_PORT:', process.env.VITE_DEV_PORT);
console.log('>>> VITE server config loading...');
console.log('>>> process.env.PORT:', process.env.PORT);

// Override any environment variables that might affect the port
process.env.PORT = String(FORCE_PORT);
process.env.VITE_DEV_PORT = String(FORCE_PORT);

export default defineConfig({
  root: '.',
  plugins: [react()],
  server: {
    port: FORCE_PORT,
    strictPort: true,
    open: true,
    proxy: {
      '/api': {
        target: 'http://localhost:4000',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },  
  build: {
    chunkSizeWarningLimit: 1500,
    outDir:  'dist',
    sourcemap: true,
    target: 'esnext',
    lib: {
      entry: 'src/main.tsx',
      fileName: 'main',
      formats: ['es'],
    },
    manifest: true,
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