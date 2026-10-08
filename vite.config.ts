import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { viteSingleFile } from 'vite-plugin-singlefile';

// `npm run build:single` gera um único index.html (útil para compartilhar/abrir offline).
export default defineConfig(({ mode }) => ({
  base: './',
  plugins: [react(), ...(mode === 'single' ? [viteSingleFile()] : [])],
  server: { host: true, port: 5173 },
  preview: { host: true, port: 4173 },
  build: { outDir: mode === 'single' ? 'dist-single' : 'dist' },
}));
