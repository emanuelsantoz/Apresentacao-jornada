# Exportar PDF (`/documento`)

```bash
npm run build
npm run export:pdf     # → exports/jornada-do-cooperado-bws-help.pdf
```

Como funciona: `scripts/export-pdf.ts` sobe o `vite preview`, abre `?print=1` no Chromium (Playwright), espera fontes e prints e gera o PDF com `@page 1920x1080`, uma página por slide, todos os passos revelados.

- Use prints em `public/prints/` (os enviados pelo navegador não entram no PDF).
- Para usar um Chromium já instalado: `CHROME_PATH=/caminho/do/chrome npm run export:pdf`.
- Primeira vez: `npx playwright install chromium`.
