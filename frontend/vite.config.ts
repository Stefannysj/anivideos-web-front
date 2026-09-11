import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const proxy = {
  '/api': {
    target: 'http://127.0.0.1:3001',
    changeOrigin: false,
  },
};

export default defineConfig({
  plugins: [react()],
  // El proxy facilita el desarrollo local. No forma parte de dist/.
  server: { host: '127.0.0.1', port: 5173, strictPort: true, cors: false, proxy },
  preview: { host: '127.0.0.1', port: 4173, strictPort: true, cors: false, proxy },
  build: { target: 'es2022', sourcemap: false },
});
