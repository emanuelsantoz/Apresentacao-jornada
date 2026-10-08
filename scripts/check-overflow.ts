/**
 * Garante que nenhum slide tem rolagem nem conteúdo vazando do palco 1920x1080.
 * Uso: npm run build && npm run check:overflow   (sai com código 1 se encontrar problema)
 */
import { start } from './_server';

const { server, browser, url } = await start();
const problems: string[] = [];
for (const vp of [{ width: 1920, height: 1080 }, { width: 1366, height: 768 }]) {
  const page = await browser.newPage({ viewport: vp });
  await page.goto(`${url}?print=1`, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(800);
  const found = await page.evaluate(() => {
    const out: string[] = [];
    document.querySelectorAll<HTMLElement>('[data-print-page]').forEach((sec) => {
      const n = sec.dataset.printPage;
      const box = sec.getBoundingClientRect();
      sec.querySelectorAll<HTMLElement>('*').forEach((el) => {
        const cs = getComputedStyle(el);
        if ((cs.overflowY === 'auto' || cs.overflowY === 'scroll') && el.scrollHeight > el.clientHeight + 1) out.push(`slide ${n}: rolagem em <${el.tagName.toLowerCase()}>`);
      });
      // texto saindo do palco (ignora decorativos aria-hidden e elementos dentro de telas de exemplo)
      sec.querySelectorAll<HTMLElement>('h1, p, span').forEach((el) => {
        if (el.closest('[aria-hidden], [data-print-slot]')) return;
        const r = el.getBoundingClientRect();
        if (r.width && (r.right > box.right + 1 || r.bottom > box.bottom + 1 || r.left < box.left - 1)) {
          out.push(`slide ${n}: texto fora do palco: "${(el.textContent ?? '').slice(0, 40)}"`);
        }
      });
    });
    return out;
  });
  problems.push(...found.map((f) => `[${vp.width}x${vp.height}] ${f}`));
  await page.close();
}
await browser.close();
server.httpServer.close();
if (problems.length) {
  console.error([...new Set(problems)].join('\n'));
  process.exit(1);
}
console.log('✔ Nenhum slide com rolagem ou texto fora do palco.');
