import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const proxy = {
  '/api': {
    target: 'http://127.0.0.1:3001',
    changeOrigin: false,
  },
};

const localSecurityHeaders = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Referrer-Policy': 'no-referrer',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=(), usb=()',
};

export default defineConfig({
  plugins: [react()],
  // Local development remains loopback-only and does not expose the Vite server to the LAN.
  server: {
    host: '127.0.0.1',
    port: 5173,
    strictPort: true,
    cors: false,
    headers: localSecurityHeaders,
    fs: { strict: true },
    proxy,
  },
  preview: {
    host: '127.0.0.1',
    port: 4173,
    strictPort: true,
    cors: false,
    headers: localSecurityHeaders,
    proxy,
  },
  // Source maps stay out of production output to avoid exposing implementation details.
  build: {
    target: 'es2022',
    sourcemap: false,
    cssCodeSplit: true,
    modulePreload: { polyfill: false },
    rollupOptions: {
      output: {
        manualChunks: { react: ['react', 'react-dom'] },
      },
    },
  },
});
