import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { viteSingleFile } from 'vite-plugin-singlefile';

/** Só em `npm run dev`: o botão “Salvar no projeto” grava public/edicoes.json. */
function salvarEdicoes(): Plugin {
  return {
    name: 'salvar-edicoes',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use('/__edicoes', (req, res) => {
        if (req.method !== 'POST') { res.statusCode = 405; res.end(); return; }
        let body = '';
        req.on('data', (c: Buffer) => { body += c; });
        req.on('end', () => {
          try {
            const data: unknown = JSON.parse(body);
            if (!data || typeof data !== 'object' || Array.isArray(data)) throw new Error('formato inválido');
            writeFileSync(resolve(server.config.publicDir, 'edicoes.json'), `${JSON.stringify(data, null, 2)}\n`);
            res.end('ok');
          } catch (e) {
            res.statusCode = 400;
            res.end(String(e));
          }
        });
      });
    },
  };
}

// `npm run build:single` gera um único index.html (útil para compartilhar/abrir offline).
export default defineConfig(({ mode }) => ({
  base: './',
  plugins: [react(), salvarEdicoes(), ...(mode === 'single' ? [viteSingleFile()] : [])],
  server: { host: true, port: 5173 },
  preview: { host: true, port: 4173 },
  build: { outDir: mode === 'single' ? 'dist-single' : 'dist' },
}));
