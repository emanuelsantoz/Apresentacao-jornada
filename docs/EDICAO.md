# Modo edição × modo apresentação

| | Modo apresentação | Modo edição |
|---|---|---|
| Como entrar | padrão ao abrir | tecla **E** ou botão **Editar** (canto) · ou abrir com `?editar` |
| Visual | limpo, controles somem após 2 s | faixa verde no topo + contornos ao passar o mouse |
| Clique nas laterais | navega | seleciona texto (use as setas para navegar) |
| Textos | fixos | **clique para editar** conteúdo, cor, tamanho e peso |
| Prints | fixos | passe o mouse → *Enviar print* ou arraste a imagem |
| Logo | fixa | clique → escolha PNG/SVG |

## Editar um texto
1. Tecla **E**.
2. Passe o mouse: o texto editável ganha um contorno tracejado.
3. Clique: abre a barra com
   - **Conteúdo** (campo de texto; a mudança aparece na hora);
   - **Cor** (paleta Barracred + seletor livre);
   - **Tamanho** em px do palco 1920×1080 (aviso abaixo de 24 px);
   - **Peso** (Regular, Medium, SemiBold, Bold).
4. **↺** restaura o original daquele texto · **Esc** fecha.

Títulos com destaque verde são dois trechos: clique na parte normal ou na parte verde separadamente.
Textos dentro das telas de exemplo dos mockups não são editáveis (são substituídos pelos prints).

## Onde as edições ficam
- Salvas automaticamente **neste navegador** (IndexedDB).
- Para levar a outro computador ou para o PDF: **Exportar** (baixa `edicoes.json`) e salve em `public/edicoes.json` do projeto.
- **Importar** carrega um `edicoes.json`. **Desfazer slide** limpa as edições do slide atual.
- Ao abrir: se há edições locais, elas valem; senão, vale `public/edicoes.json`.

## Formato do `edicoes.json`
```json
{
  "slide-03": {
    "0.3.0.0.1.0.0::do Cooperado resolve?": { "texts": ["do Cooperado resolve hoje?"], "color": "#DCA349", "fontSize": 80 }
  }
}
```
A chave é *posição no slide* + *texto original*. Se você mudar o texto direto no código (`src/content/`), a edição antiga deixa de casar e é ignorada; refaça pela interface.

## Técnico
`src/edit/`: `EditMode.tsx` (contexto/modo), `editsStore.ts` (estado, salvar, exportar), `domText.ts` (aplica edições aos nós de texto sem quebrar o React), `TextEditor.tsx` (contornos + barra), `EditBar.tsx` (faixa do topo). `SlideView` aplica as edições em todo slide (deck, miniaturas e PDF).
