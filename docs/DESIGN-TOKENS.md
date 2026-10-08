# Design tokens

Fonte: `src/theme/tokens.ts` e `src/styles/tokens.css` (mantenha os dois iguais).

## Cores da marca
| Token | Hex | Uso |
|---|---|---|
| --c-green-900 | #104726 | títulos, painéis escuros |
| --c-green-950 | #0A2416 | fundo profundo (derivado do 900) |
| --c-green-600 | #28972E | destaques, CTAs |
| --c-green-700 | #1E6D2F | apoio, linha do gráfico |
| --c-lime | #AFBF30 | acento, progresso, números vazados |
| --c-teal / blue / gold / yellow | #23775B / #39A3BE / #DCA349 / #F2EB80 | apoio pontual |

Semânticos: sucesso `#28972E`, alerta (laranja) `#E08A1E`, erro `#C8423B`, info `#39A3BE` — sempre com ícone + rótulo.

## Tipografia (palco 1920×1080)
Pilha: `Qanelas → Plus Jakarta Sans (local) → Arial`. Display 124–168 px · título 64–72 · subtítulo 40 · corpo 30 (mín. 24) · label 24 · legenda 21. Números com `tabular-nums`.

## Forma
Raios 36/24/14 px · sombra de card suave · triângulos arredondados em SVG (contorno e preenchimento) flutuando devagar · fundo “aurora” (manchas verdes desfocadas) nos painéis escuros.

## Decisões de precedência
1. **Apresentação** segue a marca (SKILL.md Barracred).
2. **Dentro dos mockups** (telas de exemplo) seguem os tokens BWS: chrome `#0B2E1F`, canvas `#F5F7F6`, badges tint, raio 6 px.
3. **Gráficos** recriam o painel “Evolução e Tipos” do BWS (linha + área, barras horizontais) com a paleta da marca; eixo único; maior barra destacada em `#104726`.
4. **Fonte intermediária:** como os arquivos Qanelas não foram enviados, incluímos Plus Jakarta Sans (local, via @fontsource) antes do Arial para manter o caráter geométrico-humanista. Ao adicionar Qanelas em `public/fonts/`, ela assume automaticamente.
5. **Referências de composição** (enviadas pelo usuário): ref. 1 → distribuição e numerais vazados; ref. 2 → mockups de notebook/celular sobre painel escuro; ref. 3 → composição de gráficos e fluxos.
