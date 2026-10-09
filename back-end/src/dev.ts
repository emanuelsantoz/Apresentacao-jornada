// Servidor local: npm run dev  →  http://localhost:8787
import { serve } from '@hono/node-server';
import { createApp } from './app.js';

const port = Number(process.env.PORT ?? 8787);
serve({ fetch: createApp().fetch, port });
console.log(`API em http://localhost:${port}  (${process.env.BLOB_READ_WRITE_TOKEN ? 'Vercel Blob' : 'arquivo local .dev-data/'})`);
