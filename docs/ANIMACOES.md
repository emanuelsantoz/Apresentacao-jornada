# Animações

Biblioteca: `motion` (Framer Motion). Tokens em `src/theme/tokens.ts` → `motionTokens` (ease, durações).

| Onde | Animação |
|---|---|
| Troca de slide | fade + deslocamento 60 px, 550 ms |
| `Reveal` | entrada por passo (`at`), direção `up/left/right/scale`, `dimAfter` esmaece |
| Capa | notebook e tablet entram em sequência |
| Agenda | fases 01 → 02, conector cresce |
| Antes × depois | “depois” entra e “antes” esmaece |
| Tablets (4–6) | tela da frente troca de lugar com a de trás; ponto pulsante; caixa de destaque |
| Fluxo (7) | trilho preenche (largura, não transform), pontos de dados viajam, nós acendem |
| Gráficos (13) | linha se desenha (`pathLength`), barras crescem, `CountUp` nos KPIs, hover com valor |
| Marcadores (14–15) | marcador ativo cresce com mola |
| Status (18) | trilho **atrás** dos ícones; linha cresce e cada estação aparece quando a linha chega; depois pulsos percorrem o trilho em loop (constantes `FILL_START`/`FILL_DURATION` em `StatusLayout.tsx`) |
| Regras (21) | arquivo “pula” do Teams para o SharePoint |
| Fundo | sólido (WorkSpace) — sem formas flutuantes; `shapes` no meta reativa os triângulos se necessário |

- **Passos:** `meta.steps` define quantos cliques internos o slide tem. Use `<Reveal at={1}>` para aparecer no 1º clique.
- **Reduced motion:** `MotionConfig reducedMotion="user"` respeita `prefers-reduced-motion`.
- **PDF/miniaturas:** `print=true` renderiza o estado final sem animação.
- Ajustar duração: altere `motionTokens.slide` / `reveal` ou a prop `transition` do componente.
