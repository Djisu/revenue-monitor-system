// vite.config.ts
// @ts-ignore
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';




const FORCE_PORT = 5173;

process.env.PORT = String(FORCE_PORT);
process.env.VITE_DEV_PORT = String(FORCE_PORT);

export default defineConfig({
  root: '.',
  plugins: [react()],
  server: {
    port: FORCE_PORT,
    strictPort: true,
    open: true,
    // proxy: {
    //   '/api': {
    //     target: 'http://localhost:3000',
    //     changeOrigin: true,
    //     secure: false,
    //     rewrite: (path) => path.replace(/^\/api/, ''),
    //   },
    // },
  },
  build: {
    chunkSizeWarningLimit: 1500,
    outDir: 'dist',
    sourcemap: true,
    target: 'esnext',
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
  base: '/', // ✅ Must be '/' for proper routing on Render
  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
  },
  
});
