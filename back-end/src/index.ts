// Entrada para a Vercel (framework Hono detecta src/index.ts e o export default).
import { createApp } from './app.js';
import { handle } from '@hono/node-server/vercel';

export default handle(createApp());
