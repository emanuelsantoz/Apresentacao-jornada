# Jornada do Cooperado & BWS_HELP — Apresentação

Treinamento interno (21 slides) para Consultoria e Atendimento. Projeto **React + Vite + TypeScript**, 100% local, no design system **Barracred WorkSpace** ([DESIGN-TOKENS](DESIGN-TOKENS.md)).

## Rodar

```bash
npm install
npm run dev          # abre em http://localhost:5173
```

## Navegar

| Tecla | Ação |
|---|---|
| → · Espaço · PgDn | próximo passo / slide |
| ← · PgUp | voltar |
| Home / End | primeiro / último |
| número + Enter | ir para o slide (ex.: `14` Enter) |
| F | tela cheia |
| O | visão geral (miniaturas) |
| N | notas do apresentador |
| E | alterna **modo edição** / **modo apresentação** |
| Esc | fecha overlays |

Também funciona clique nas laterais, swipe no celular e URL direta (`#/13`).

## Modo edição × modo apresentação

Tecla **E** (ou botão **Editar**). No modo edição, tudo que fica sob o mouse é editável: **textos** (conteúdo, cor, tamanho, peso), **prints** e **logo**. No modo apresentação, nada é editável e a tela fica limpa. Detalhes em [EDICAO.md](EDICAO.md).

Para fixar as edições no projeto: **Exportar** → salve o arquivo como `public/edicoes.json`.

## Prints dos sistemas (área editável)

Todo notebook/tablet/celular tem uma **área de print**. Duas formas de preencher:

1. **Rápida (no modo edição):** passe o mouse sobre a tela do mockup → **Enviar print**, ou arraste a imagem por cima. Fica salvo só neste navegador.
2. **Definitiva (no projeto):** salve o arquivo em `public/prints/<nome>.png`. A lista de nomes está em `public/prints/LEIA-ME.md` e em [PRINTS.md](PRINTS.md).

Sem print, aparece uma tela de exemplo recriada em código (marcada “Tela de exemplo”).

## Trocar a logo

No modo edição, clique na logo (canto superior esquerdo) ou arraste uma imagem sobre ela e escolha um **PNG** (ou SVG).
A troca vale para todos os slides e fica salva neste navegador. Para voltar à padrão, passe o mouse e clique em ↺.

São duas versões, porque o fundo muda: troque a logo num slide **claro** (versão com texto verde) e num slide **escuro** (versão com texto branco, ex.: capa).
Se você enviar só uma, ela é usada nos dois fundos.

Para fixar no projeto (vale também para o PDF e para quem abrir em outro computador), salve em `public/brand/` como `logo-verde.png` (fundo claro) e `logo-branco.png` (fundo escuro).

## Outros comandos

```bash
npm run build            # build de produção em dist/
npm run build:single     # um único index.html em dist-single/ (abre offline, fácil de enviar)
npm run typecheck && npm run lint
npm run check:overflow   # falha se algum slide tiver rolagem (precisa de build antes)
npm run export:pdf       # PDF 1 página por slide em exports/ (precisa de build antes)
npm run screenshots      # PNG de cada slide em exports/png/
```

> Se o Playwright pedir navegador: `npx playwright install chromium`.

## Pendências

- Fonte **Qanelas** (`public/fonts/`) e logos oficiais (clique na logo ou `public/brand/`).
- Prints reais das telas (15 arquivos).
- Confirmar: rótulos truncados e valores de setembro (slide 13), status oficiais (slide 18), nomes de botões/menus (slides 14, 15, 17).

Documentação: [EDICAO](EDICAO.md) · [ARQUITETURA](ARQUITETURA.md) · [COMO-EDITAR](COMO-EDITAR.md) · [CONTEUDO](CONTEUDO.md) · [PRINTS](PRINTS.md) · [DESIGN-TOKENS](DESIGN-TOKENS.md) · [ANIMACOES](ANIMACOES.md) · [EXPORTAR-PDF](EXPORTAR-PDF.md) · [REFERENCIAS](REFERENCIAS.md)
