# Design tokens — Barracred WorkSpace

> “Uma só linguagem visual.” Fonte: `src/styles/tokens.css` (CSS) e `src/theme/tokens.ts` (TS). Altere os dois juntos.

## Paleta oficial
| Token | Hex | Uso |
|---|---|---|
| `--ws-chrome` | #0B2E1F | fundos escuros (capas, painéis dos dispositivos), barras |
| `--ws-primary` | #0B5D3B | destaque nos títulos, números vazados, marcas institucionais |
| `--ws-action` | #12864F | ações, CTAs, progresso, trilhos, marcadores ativos |
| `--ws-canvas` | #F5F7F6 | fundo dos slides claros |
| `--ws-selection` | #E8F5E9 | seleção, chips, ícones claros e acento sobre o chrome |
| `--ws-text` | #1F2937 | títulos e texto |
| `--ws-muted` / `--ws-border` | #6B7280 / #E5E7EB | texto secundário / bordas |
| `--ws-chrome-2` | #0F3A28 | derivado: superfície sólida sobre o chrome (no lugar de vidro/transparência) |

Status (somente em **badges discretos**: fundo claro + texto): sucesso #12864F/#E8F5E9 · alerta #B45309/#FEF3C7 · erro #B91C1C/#FEE2E2 · info #1D4ED8/#DBEAFE.

## Princípios aplicados
1. **ERP corporativo denso, não site de marketing** — removidas as formas decorativas flutuantes e o fundo “aurora”.
2. **Verde institucional no chrome e nas ações primárias** — chrome nos painéis escuros, ação em botões, trilhos, setas e marcadores.
3. **Dados primeiro** — números com `tabular-nums`, KPIs e gráficos em destaque, rótulos diretos nas barras.
4. **Status em badges discretos, nunca como cor da página** — cards e caixas de destaque ficaram neutros; a cor de status aparece só no badge/ícone.
5. **Sem gradientes, sombras fortes ou efeitos de vidro** — fundos sólidos, área do gráfico em cor lisa, sombra de card = borda 1 px + sombra mínima, sem blur/transparência.

## Tipografia
Pilha: `Qanelas → Inter (local, @fontsource) → Arial`. Inter é a fonte de referência do WorkSpace; Qanelas assume se os arquivos forem colocados em `public/fonts/`.
Escala (palco 1920×1080): display 120–168 · título 64–68 · subtítulo 38 · corpo 30 (mín. 24) · label 24 · legenda 21.

## Forma
Raios 12 / 10 / 6 px · `--shadow-card` (borda 1 px + sombra mínima) · `--shadow-pop` só em elementos sobrepostos (caixas de destaque sobre os mockups).

## Compatibilidade
Nomes antigos foram mantidos como aliases para não quebrar componentes: `--c-green-900/950 → chrome`, `--c-green-700 → primária`, `--c-green-600 → ação`, `--c-lime → seleção`, `--c-paper → canvas`, `--c-ink → texto`.
