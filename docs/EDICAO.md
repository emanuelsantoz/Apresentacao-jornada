# Modo edição × modo apresentação

| | Modo apresentação | Modo edição |
|---|---|---|
| Como entrar | tecla **E** ou botão **Apresentar** | tecla **E** ou botão **Editar** (canto) · ou abrir com `?editar` |
| Ao recarregar | volta no último modo usado (e no mesmo slide, pela URL `#/N`) · `?apresentar` força o modo apresentação | idem |
| Visual | limpo, controles somem após 2 s | faixa verde no topo + contornos ao passar o mouse |
| Clique nas laterais | navega | seleciona texto/card (use as setas para navegar) |
| Textos | fixos | **clique e digite direto no slide**; barra com tamanho, peso, cor e fundo |
| Cards | fixos | clique no card → alças para **mudar o tamanho arrastando** |
| Cards novos | aparecem normalmente | **+ Card de texto** cria um card; arraste para mover |
| Prints | fixos | passe o mouse → *Enviar print* ou arraste a imagem |
| Logo | fixa | clique → escolha PNG/SVG |

## Editar um texto
1. Tecla **E**.
2. Passe o mouse: o texto editável ganha um contorno tracejado verde.
3. Clique: o cursor entra no próprio texto. Digite normalmente.
4. A barra flutuante tem:
   - **Tamanho** em px do palco 1920×1080 (aviso abaixo de 24 px);
   - **Peso** R / M / S / B;
   - **A**: cor do texto (paleta Barracred + seletor livre);
   - **Marca-texto**: fundo colorido. Com palavras selecionadas, o fundo vale só para elas. Sem seleção, vale para o texto inteiro. **Sem fundo** remove.
5. **✓ Confirmar** (ou **Enter**) fecha e salva na hora. **✕ Cancelar** (ou **Esc**) desfaz as alterações daquele item. **↺** volta ao original.

Clicar em outro lugar também mantém a alteração (o salvamento é automático). O Confirmar é só para quem quer fechar e ter certeza de que foi salvo.

Títulos com destaque verde são dois trechos: clique na parte normal ou na parte verde separadamente.
Textos dentro das telas de exemplo dos mockups não são editáveis (são substituídos pelos prints).

## Cards
- **Cards existentes** (caixas com fundo, borda ou sombra): clique numa área do card fora do texto. Arraste as alças da **direita**, de **baixo** ou do **canto**. **↺** volta ao tamanho original.
- **Card novo**: botão **+ Card de texto** na faixa do topo. O card nasce no centro do slide com o texto selecionado; é só digitar.
  - Mover: arraste pela borda interna do card ou pelo botão **Mover**.
  - Fundo do card (inclui “sem fundo”) e **Excluir** (ou tecla **Delete** com o card selecionado) ficam na barra.
  - O texto do card tem as mesmas opções dos outros textos (tamanho, peso, cor, fundo).

## Mover elementos e guias de alinhamento
- **Qualquer texto ou card** (original ou novo) pode ser movido:
  - texto: clique nele e arraste o botão azul **Mover** que aparece logo abaixo;
  - card: arraste pela área do card fora do texto (ou pelo **Mover**).
- **Setas** movem o card selecionado 1 px; **Shift+setas**, 10 px.
- **Ímã (estilo Canva)**: ao arrastar ou redimensionar, bordas e centros “grudam” nas bordas/centros dos outros elementos, no centro do slide e nas margens laterais. Uma **linha rosa** fina mostra com quem o elemento alinhou. Segure **Alt** para mover livre, sem ímã.
- **↺** volta texto/card à posição (e tamanho) original. O movimento também entra no **Ctrl+Z** e no **Cancelar**.
- Tecnicamente o deslocamento usa a propriedade CSS `translate` (não interfere nas animações) e fica salvo como `dx`/`dy` em `box::posição`.

## Desfazer e status
- **Ctrl+Z** desfaz a última alteração (um trecho de digitação, um arraste, uma cor…). **Ctrl+Y** ou **Ctrl+Shift+Z** refaz. Os botões ↶ ↷ na faixa do topo fazem o mesmo e mostram o que será desfeito.
- O status na faixa mostra **Salvando…**, **Salvo neste navegador · hh:mm** ou erro.
- O histórico vale para a sessão aberta. Ao recarregar a página, as edições continuam, mas o histórico de desfazer recomeça.

## Onde as edições ficam
- Salvas automaticamente **neste navegador** (IndexedDB).
- **Salvar no projeto** (só com `npm run dev`): grava `public/edicoes.json` direto no projeto. O botão fica laranja quando há alterações que ainda não estão no arquivo e mostra “Projeto em dia” quando está tudo gravado.
- Fora do modo dev: **Exportar** (baixa `edicoes.json`) e salve em `public/edicoes.json` do projeto.
- **Importar** carrega um `edicoes.json`. **Restaurar slide** remove as edições e os cards novos do slide atual. As duas ações também podem ser desfeitas com Ctrl+Z.
- Ao abrir: se há edições locais, elas valem; senão, vale `public/edicoes.json`.

## Formato do `edicoes.json`
```json
{
  "versao": 2,
  "textos": {
    "slide-03": {
      "0.3.0.0.1.0.0::do Cooperado resolve?": {
        "texts": ["do Cooperado resolve hoje?"], "color": "#DCA349", "fontSize": 80,
        "background": "#FEF08A",
        "marks": [{ "i": 0, "start": 3, "end": 12, "color": "#BBF7D0" }]
      },
      "box::0.2.1.1.0": { "width": 560, "height": 240, "dx": 24, "dy": -12 }
    }
  },
  "cards": {
    "slide-03": [
      { "id": "c1", "x": 750, "y": 420, "w": 440, "h": 190, "fill": "#FFFFFF", "t": { "texts": ["Novo texto"], "fontSize": 36, "fontWeight": 600 } }
    ]
  }
}
```
- Textos: a chave é *posição no slide* + *texto original*. `background` é o fundo do texto inteiro e `marks` o fundo em trechos (`i` = qual trecho de texto, `start`/`end` = posição dos caracteres).
- `box::posição` guarda tamanho (`width`/`height`) e deslocamento (`dx`/`dy`) de um texto ou card existente.
- O formato antigo (só os textos, sem `versao`) continua sendo lido.

Se você mudar o texto direto no código (`src/content/`), a edição antiga deixa de casar e é ignorada; refaça pela interface.

## Técnico
`src/edit/`:
- `EditMode.tsx`: contexto do modo; lembra o último modo (localStorage).
- `editsStore.ts`: estado, histórico (desfazer/refazer), status de salvamento, exportar e salvar no projeto.
- `domText.ts`: aplica edições de texto e tamanho de card no DOM sem quebrar o React.
- `highlights.ts`: fundo das palavras via CSS Custom Highlight API (`::highlight`), sem alterar o DOM.
- `TextEditor.tsx`: edição direta (contenteditable), seleção, atalhos.
- `EditToolbar.tsx`: barra flutuante.
- `CardFrame.tsx`: alças de tamanho, botão Mover e arraste.
- `snap.tsx`: ímã e guias de alinhamento.
- `NewCards.tsx`: camada dos cards novos.
- `EditBar.tsx`: faixa do topo.
- `notify.tsx`: avisos.

`SlideView` aplica as edições e renderiza os cards novos em todo slide (deck, miniaturas e PDF). O endpoint `POST /__edicoes` do “Salvar no projeto” fica em `vite.config.ts` e só existe no servidor de desenvolvimento.
