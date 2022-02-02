import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig(({ command }) => {
  if (command === 'serve') {
    return {
      plugins: [
        react({
          babel: {
            plugins: [
              ['@babel/plugin-proposal-decorators', { legacy: true }],
            ],
          },
        }),
      ],
    };
  }

  return {
    plugins: [
      react({
        babel: {
          plugins: [
            ['@babel/plugin-proposal-decorators', { legacy: true }],
          ],
        },
      }),
      process.env.EXPLORE && visualizer(),
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
});
