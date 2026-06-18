import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

/** Vite 构建配置 — 灶王爷 PWA 应用 */
export default defineConfig({
  plugins: [react()],
  base: '/zaowangye/',
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
  server: {
    port: 3000,
    open: true,
  },
});
