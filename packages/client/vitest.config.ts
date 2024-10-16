import { resolve } from 'node:path';

import { defineConfig, mergeConfig } from 'vite';

import viteConfig from './vite.config';

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: ['node_modules/@testing-library/jest-dom/dist/index.js'],
      testTransformMode: {
        web: ['/.[jt]sx?$/'],
      },
      pool: 'forks',
      poolOptions: {
        forks: {
          isolate: false,
        },
      },
      deps: {
        optimizer: {
          web: {
            exclude: ['solid-js'],
          },
        },
      },
      server: {
        deps: {
          inline: ['solid-icons', '@solid-aria/focus'],
        },
      },
      coverage: {
        reporter: ['text', 'json', 'html'],
      },
    },
    resolve: {
      conditions: ['development', 'browser'],
      alias: {
        '@test': resolve(__dirname, 'test'),
      },
    },
  })
);
