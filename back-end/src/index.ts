// Entrada para a Vercel (framework Hono detecta src/index.ts e o export default).
import { createApp } from './app.js';

export default createApp().fetch;
