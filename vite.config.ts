import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
// import { visualizer } from 'rollup-plugin-visualizer';

// https://vitejs.dev/config/
export default defineConfig(({ command }) => {
  if (command === 'serve') {
    return {
      plugins: [
        react(),
      ],
    };
  }

  return {
    plugins: [
      react(),
      // visualizer(),
    ],
    build: {
      minify: 'esbuild',
    },
    resolve: {
      alias: {
        react: 'preact/compat',
        'react-dom': 'preact/compat',
      },
    },
  };
})
