import { federation } from '@module-federation/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'chat_remote',
      filename: 'remoteEntry.js',
      // Manual ambient types live in apps/host/src/remotes.d.ts instead —
      // automatic .d.ts generation isn't needed for this prototype.
      dts: false,
      exposes: {
        './Chat': './src/Chat',
      },
      // @emotion/react and @emotion/styled deliberately NOT shared — see the
      // matching comment in apps/host/vite.config.ts.
      // @mui/material deliberately NOT shared — see the matching comment in
      // apps/host/vite.config.ts.
      // recoil deliberately NOT shared — see the matching comment in
      // apps/host/vite.config.ts.
      shared: {
        react: { singleton: true, requiredVersion: '^18.2.0' },
        'react-dom': { singleton: true, requiredVersion: '^18.2.0' },
      },
    }),
  ],
  build: {
    // required by @module-federation/vite's runtime (top-level await)
    target: 'chrome89',
    modulePreload: false,
    cssCodeSplit: false,
  },
  server: {
    port: 5174,
    strictPort: true,
    cors: true,
  },
  preview: {
    port: 5174,
    strictPort: true,
    cors: true,
  },
});
