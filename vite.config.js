// vite.config.js — project root (NOT inside src/).
//
// Two proxy paths, one per backend, so the browser only ever talks to
// the Vite dev server itself in dev (same-origin — no CORS preflight,
// ever) while Vite forwards each request server-to-server to the real
// backend. This is the fix for the CORS errors hitting both APIs
// directly from the browser in dev:
//   /backend-api/*  -> the main SyntraCore backend (auth, roles,
//                       permissions, quotes, house-jobs, ...)
//                       see src/api/axios.js
//   /email-api/*    -> the Email-Intake Engine (a separate backend,
//                       currently behind an ngrok tunnel)
//                       see src/features/email-inbox/api/emailApiClient.js
//
// In a production build there's no dev-server proxy, so both clients
// fall back to calling their backend directly — that requires each
// backend's own CORS config to allow the deployed frontend's origin;
// this file only solves it for local dev.
//
// Swap `@vitejs/plugin-react` for `@vitejs/plugin-react-swc` below if
// that's the plugin this project actually uses (check package.json).
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Loads .env / .env.local / .env.[mode] — same files Vite already
  // exposes to the app as import.meta.env, just also readable here in
  // config (import.meta.env isn't available in this file).
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],
    server: {
      proxy: {
        '/backend-api': {
          target: env.VITE_API_BASE_URL || 'http://localhost:8000',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/backend-api/, ''),
        },
        '/email-api': {
          target: env.VITE_EMAIL_API_BASE_URL || 'https://confider-atom-resonate.ngrok-free.dev',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/email-api/, ''),
          // Harmless to send even though the interstitial page this
          // dodges only ever triggers for direct *browser* requests to
          // ngrok, not this server-to-server proxied one.
          headers: { 'ngrok-skip-browser-warning': 'true' },
        },
      },
    },
  };
});
