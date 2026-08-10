import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

// The core package ships `main: dist/index.js` with no exports map, so we alias
// straight at source. Dev needs no build step, and the probe stays honest about
// consuming the real engine rather than a copy.
const core = fileURLToPath(
  new URL('../../packages/small-bets-portfolio/src/core/index.ts', import.meta.url)
);

export default defineConfig({
  resolve: {
    alias: {
      '@greenfieldoverride/small-bets-portfolio/core': core,
    },
  },
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg'],
      manifest: {
        name: 'Small Bets — what it costs to start',
        short_name: 'Small Bets',
        description:
          'Activation-energy scoring for income experiments. Everything stays on your device.',
        theme_color: '#0f172a',
        background_color: '#0f172a',
        display: 'standalone',
        start_url: '/',
        // SVG only for now. Raster maskable icons should be added before this
        // is offered as installable in earnest — referencing PNGs that don't
        // exist yet would just ship a broken manifest.
        icons: [
          {
            src: 'favicon.svg',
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'any',
          },
        ],
      },
      workbox: {
        // No network calls to cache — the whole app is local. Precache the
        // shell so it works offline, which is the point of moving here.
        globPatterns: ['**/*.{js,css,html,svg,png,woff2}'],
      },
    }),
  ],
});
