import { readdirSync } from 'node:fs';
import { resolve } from 'node:path';

import devtools from 'solid-devtools/vite';
import { defineConfig } from 'vite';
import Inspect from 'vite-plugin-inspect';
import { VitePWA } from 'vite-plugin-pwa';
import solidPlugin from 'vite-plugin-solid';
import solidSvg from 'vite-plugin-solid-svg';

import codegenPlugin from './codegen.plugin';

const base = process.env.BASE_PATH ?? '/';

export default defineConfig({
  base,
  plugins: [
    Inspect(),
    devtools(),
    codegenPlugin(),
    solidPlugin(),
    solidSvg({
      defaultAsComponent: false,
    }),
    VitePWA({
      srcDir: 'src',
      filename: 'sw.ts',
      strategies: 'injectManifest',
      manifest: {
        name: 'Revolt',
        short_name: 'Revolt',
        description: 'User-first open source chat platform.',
        categories: ['communication', 'chat', 'messaging'],
        start_url: '/pwa',
        orientation: 'portrait',
        display_override: ['window-controls-overlay'],
        display: 'standalone',
        background_color: '#101823',
        theme_color: '#101823',
        icons: [
          {
            src: `${base}assets/icons/android-chrome-192x192.png`,
            type: 'image/png',
            sizes: '192x192',
          },
          {
            src: `${base}assets/icons/android-chrome-512x512.png`,
            type: 'image/png',
            sizes: '512x512',
          },
          {
            src: `${base}assets/icons/monochrome.svg`,
            type: 'image/svg+xml',
            sizes: '48x48 72x72 96x96 128x128 256x256',
            purpose: 'monochrome',
          },
          {
            src: `${base}assets/icons/masking-512x512.png`,
            type: 'image/png',
            sizes: '512x512',
            purpose: 'maskable',
          },
        ],
        // TODO: take advantage of shortcuts
      },
    }),
  ],
  build: {
    target: 'esnext',
    rollupOptions: {
      external: ['hast'],
    },
  },
  optimizeDeps: {
    exclude: ['solid-styled-components', 'hast'],
  },
  resolve: {
    alias: {
      'styled-system': resolve(__dirname, 'styled-system'),
      ...readdirSync(resolve(__dirname, 'components')).reduce(
        (p, f) => ({
          ...p,
          [`@revolt/${f}`]: resolve(__dirname, 'components', f),
        }),
        {}
      ),
    },
  },
});
