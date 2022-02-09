import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig(async ({ command }) => {
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

  let visualizer: any;

  if (process.env.EXPLORE) {
    visualizer = (await import('rollup-plugin-visualizer')).visualizer;
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
    resolve: {
      alias: {
        react: 'preact/compat',
        'react-dom': 'preact/compat',
      },
    },
  };
});
