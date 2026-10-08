/**
 * Exporta a apresentação em PDF: 1 página por slide, 1920x1080, estado final.
 * Uso: npm run build && npm run export:pdf  →  exports/jornada-do-cooperado-bws-help.pdf
 */
import { mkdirSync } from 'node:fs';
import { start } from './_server';

const { server, browser, url } = await start();
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
await page.goto(`${url}?print=1`, { waitUntil: 'networkidle' });
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(1500); // prints e SVGs
mkdirSync('exports', { recursive: true });
const file = 'exports/jornada-do-cooperado-bws-help.pdf';
await page.pdf({ path: file, printBackground: true, preferCSSPageSize: true, width: '1920px', height: '1080px' });
await browser.close();
server.httpServer.close();
console.log(`✔ PDF gerado em ${file}`);
