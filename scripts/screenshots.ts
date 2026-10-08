/** Gera PNG de cada slide (estado final) em exports/png/ — útil para revisão rápida. */
import { mkdirSync } from 'node:fs';
import { start } from './_server';

const { server, browser, url } = await start();
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
await page.goto(`${url}?print=1`, { waitUntil: 'networkidle' });
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(1200);
mkdirSync('exports/png', { recursive: true });
const n = await page.locator('[data-print-page]').count();
for (let i = 0; i < n; i++) {
  await page.locator('[data-print-page]').nth(i).screenshot({ path: `exports/png/slide-${String(i + 1).padStart(2, '0')}.png` });
}
await browser.close();
server.httpServer.close();
console.log(`✔ ${n} PNGs em exports/png/`);
