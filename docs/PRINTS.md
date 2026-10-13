# Prints (área editável dos mockups)

Cada mockup tem uma `PrintSlot`. Ordem de prioridade:

1. **Print enviado no modo edição** (tecla E; passe o mouse na tela → *Enviar print*, ou arraste a imagem). Fica no IndexedDB deste navegador. Para remover, use o ícone de lixeira.
2. **Arquivo em `public/prints/<id>.png`** (ou .jpg/.webp) — é o que vale para todos, para o build e o PDF.
3. **Tela de exemplo** recriada em código.

Um mesmo `id` pode aparecer em mais de um slide (ex.: `help-01-caixa-do-help` na capa e no slide 14).

Proporção ideal: tablet **4:3**, notebook **16:10**. O print preenche a tela alinhado ao topo (`object-fit: cover`).

| id | Slides |
|---|---|
| jornada-01-inicio | 4 |
| jornada-02-sessoes | 1, 4 |
| jornada-03-alerta | 5 |
| jornada-04-sucesso | 5 |
| jornada-05-sem-acesso | 6 |
| jornada-06-sem-informacoes | 6 |
| jornada-07-botao-abrir-chamado | 8, 9 |
| jornada-08-observacao | 9 |
| jornada-09-enviar | 9 |
| jornada-10-email-confirmacao | 10 |
| help-01-caixa-do-help | 1, 14 |
| help-02-novo-chamado | 15 |
| help-03-email-abertura | 16 |
| help-04-acompanhamento | 17 |
| help-05-avaliacao | 19 |

Catálogo no código: `src/content/prints.ts`.

## Logo
A logo funciona igual: clique nela para enviar um PNG/SVG. Ids locais: `logo-fundo-claro` e `logo-fundo-escuro`. Arquivos permanentes: `public/brand/logo-verde.png` e `public/brand/logo-branco.png`.

## Expandir a imagem
Todo print real dentro de um notebook/tablet ganha um botão **⤢** no canto superior direito da tela. Ele abre a imagem inteira, maior, sobre o slide (Esc, **X** ou clique fora para fechar; as setas não trocam de slide enquanto estiver aberta). O botão não aparece no PDF nem na visão geral.
No e-mail do slide 16 a imagem do notebook é um recorte (`prints/help-03-email-corpo.png`); ao expandir, abre a imagem completa (`prints/help-03-email-completo.png`).
