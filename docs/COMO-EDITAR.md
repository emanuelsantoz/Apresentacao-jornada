# Como editar

> Jeito mais rápido: **modo edição** na própria apresentação (tecla E) — ver [EDICAO.md](EDICAO.md).
> Abaixo, como editar direto no código.

## Trocar um texto
Abra `src/content/slide-NN.ts` e edite o objeto `data`. Ex. (slide 3):

```ts
after: { label: 'Com a Jornada', icon: Zap, items: ['Resposta rápida para problemas comuns.', '…'] },
```

Regras de copy: título ≤ 8 palavras · até 4 itens · até 12 palavras por item. Detalhes vão em `meta.notes` (tecla N).

## Trocar ícone
Ícones são do `lucide-react` (https://lucide.dev). Importe e use o componente: `import { Rocket } from 'lucide-react'`.

## Atualizar números (slide 13)
Edite `src/data/metricas-setembro.ts`. Os KPIs (total, pico, tipo nº 1) e a frase de destaque são **calculados** pela função `resumoSetembro()`.

## Inserir prints
Veja [PRINTS.md](PRINTS.md).

## Ajustar marcadores numerados (slides 14 e 15)
Em `slide-14.ts` / `slide-15.ts`, cada item tem `pin: { x, y }` em % da tela do notebook. Depois de colocar o print real, ajuste até o marcador ficar sobre o elemento certo.
Nos slides 4–6, o círculo pulsante usa `spot: { x, y }` da mesma forma.

## Reordenar / remover slide
Em `src/content/index.tsx`, mova ou apague a linha do slide. O número no rodapé é automático.

## Adicionar slide
1. Crie `src/content/slide-22.ts` exportando `meta` e `data` (copie um slide parecido).
2. Registre em `src/content/index.tsx`:
```tsx
import * as s22 from './slide-22';
{ ...s22.meta, Component: () => <StatementLayout d={s22.data} /> },
```

## Criar um layout novo
Crie `src/components/layouts/MeuLayout.tsx` recebendo `{ d }`. Use `Reveal at={n}` para entradas por passo e `useSlideState()` para saber `step`/`print`. Declare `steps` no `meta` do slide.
