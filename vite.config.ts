import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
  ],
  build: {
    minify: 'esbuild',
  },
  resolve: {
    alias: {
      // react: 'preact/compat',
      // 'react-dom': 'preact/compat',
    },
  },
})
