import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

const buildTime = Date.now();

export default defineConfig({
  base: './',
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        entryFileNames: `assets/[name]-[hash]-${buildTime}.js`,
        chunkFileNames: `assets/[name]-[hash]-${buildTime}.js`,
        assetFileNames: `assets/[name]-[hash]-${buildTime}.[ext]`,
      },
    },
  },
  server: {
    port: 5173,
    open: true,
  },
});
