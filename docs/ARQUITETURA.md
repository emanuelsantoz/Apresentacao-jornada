# Arquitetura

```
content-source/           roteiro original + print do BWS (não editar)
public/prints/            prints reais dos mockups  ← você coloca aqui
public/brand/, fonts/     logos SVG e Qanelas
scripts/                  check-overflow, export-pdf, screenshots (Playwright)
src/
  app/                    App (escolhe Deck ou PrintView), Deck, PrintView
  components/
    stage/                Stage (1920x1080 escalado), SlideFrame (fundo/logo/rodapé), SlideView,
                          Overview, Hud, Shapes (triângulos + aurora), BrandMark
    layouts/              arquétipos de slide (Cover, Agenda, Compare, TabletDuo, Flow, DeviceFocus,
                          Steps, ModuleCover, Concepts, Metrics, Annotated, Status, Statement, Rules)
    devices/              Tablet, Laptop, Phone, PrintSlot (área de print), BwsScreens (telas de exemplo)
    charts/               AreaLine, HBars (SVG + d3-scale/d3-shape)
    ui/                   Reveal, CountUp, Title, Chip, IconBadge, BulletList
  content/                slide-01.ts … slide-21.ts (meta + dados) · prints.ts · index.tsx (registro/ordem)
  data/                   metricas-setembro.ts
  edit/                   modo edição: EditMode, editsStore, domText, TextEditor, EditBar
  lib/                    localStore (IndexedDB: prints, logo, edições)
  hooks/                  useDeck, useKeyboardNav, useSlideState, usePrint, useStageScale, useIdle
  styles/ theme/ types/
```

## Fluxo

`content/slide-NN.ts` (texto e dados tipados) → `content/index.tsx` liga ao layout → `Deck` mostra um slide por vez dentro do `Stage` → `SlideView` fornece `{step, print}` via contexto → `Reveal` e gráficos reagem ao passo.

## Decisões

- **Palco fixo 1920×1080** escalado com `transform: scale()`; nada rola (checado por script).
- **Passos (`steps`)** por slide: o deck avança passos internos antes de trocar de slide. O estado final (todos os passos) é o usado em PDF e miniaturas.
- **Rota `?print=1`**: todos os slides empilhados, sem animação.
- **Edição na interface**: overrides por nó de texto (caminho + texto original), aplicados após cada render; exportáveis para `public/edicoes.json`.
- **Prints**: IndexedDB (conveniência local) → `public/prints/` (definitivo) → tela de exemplo.
- **Gráficos** recriados em SVG a partir dos dados do painel do BWS (não usamos screenshot como slide).
