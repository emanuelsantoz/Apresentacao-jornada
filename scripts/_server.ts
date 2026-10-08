import { preview, type PreviewServer } from 'vite';
import { chromium, type Browser } from 'playwright';
import { existsSync } from 'node:fs';

/** Sobe o `vite preview` (requer `npm run build` antes) e abre o Chromium do Playwright. */
export async function start(): Promise<{ server: PreviewServer; browser: Browser; url: string }> {
  const server = await preview({ preview: { port: 4179, strictPort: false } });
  const url = server.resolvedUrls?.local[0] ?? 'http://localhost:4179/';
  // CHROME_PATH permite usar um Chromium já instalado (ex.: /opt/pw-browsers/.../chrome)
  const executablePath = process.env.CHROME_PATH && existsSync(process.env.CHROME_PATH) ? process.env.CHROME_PATH : undefined;
  const browser = await chromium.launch({ executablePath });
  return { server, browser, url };
}
