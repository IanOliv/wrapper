import * as path from 'path';
import { federation } from '@module-federation/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

import manifest from './manifest.json';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      manifest,
      // Layout fixes were shipping across several rapid deploys and going
      // unseen on the installed PWA because the default 'prompt' mode waits
      // for a manual "Reload now" click on a toast that's easy to miss on a
      // home-screen app. New builds now activate and reload on their own.
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'favicon.ico', 'robots.txt', 'apple-touch-icon.png'],
      // switch to "true" to enable sw on development
      devOptions: {
        enabled: false,
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html}', '**/*.{svg,png,jpg,gif}'],
      },
    }),
    // Module Federation: the host consumes remotes discovered at runtime from
    // a manifest, not declared here. See src/remotes/ and src/store/remotes.
    federation({
      name: 'host',
      dts: false,
      // Remotes are NOT declared here on purpose. This plugin's `remotes`
      // option rewrites `import('name/Module')` into a build-time-known
      // virtual module — it can't support remotes discovered at runtime.
      // Instead, src/remotes/registry.ts calls registerRemotes()/loadRemote()
      // from @module-federation/runtime directly. This still shares the same
      // runtime singleton (and its shared scope, below) that this plugin's
      // own generated host-init bootstrap sets up — confirmed empirically,
      // in dev and in a production build, before building the rest of this.
      remotes: {},
      // @emotion/react and @emotion/styled are deliberately NOT shared: their
      // generated shared-scope chunk hits a circular init error ("Cannot
      // access '...' before initialization") under this plugin's Rollup
      // chunking. Each side bundles its own copy instead — harmless here
      // since emotion doesn't hold cross-boundary state the way React does.
      // @mui/material is deliberately NOT shared: singleton sharing across
      // deep imports (e.g. '@mui/material/Typography') hit real bugs in this
      // Rollup/Vite setup (circular init errors, subpath imports silently
      // bypassing the shared scope). The remote gets the live theme object
      // as a prop instead — see apps/chat-remote/src/Chat/index.tsx.
      // recoil is NOT shared: tested with a real atom/consumer in Chat and
      // confirmed it still isn't a true singleton across the boundary — the
      // remote's useRecoilState throws "must be used inside a <RecoilRoot>"
      // even though the host provides one, because the remote resolves its
      // own separate recoil module/Context, not the host's. Cross-boundary
      // app state (e.g. the logged-in user profile) should be passed as a
      // prop into the exposed component instead, the same way the theme is
      // — see apps/chat-remote/src/Chat/index.tsx.
      shared: {
        react: { singleton: true, requiredVersion: '^18.2.0' },
        'react-dom': { singleton: true, requiredVersion: '^18.2.0' },
      },
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    // required by @module-federation/vite's runtime (top-level await)
    target: 'chrome89',
  },
  server: {
    port: 5173,
    strictPort: true,
  },
  preview: {
    port: 4173,
    strictPort: true,
  },
});
