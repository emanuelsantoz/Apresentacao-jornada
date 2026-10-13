# back-end · API do `edicoes.json`

Pequena API **Hono** (roda na Vercel) que guarda o arquivo de edições da apresentação no **Vercel Blob**.
Fase 2 do projeto: hoje o `edicoes.json` vive só no navegador; aqui ele passa a ter um lugar central.

Arquivo no Blob: `apresentacao/edicoes.json` · formato v2: `{ versao: 2, textos: { [slideId]: { [chave]: Override } }, cards: { [slideId]: NewCard[] } }` (o formato antigo, só `{ [slideId]: { [chave]: Override } }`, continua aceito). `Override` = `texts, color, fontSize, fontWeight, background, marks, width, height, dx, dy`.

## Rotas

| Método | Rota | O que faz |
|---|---|---|
| GET | `/edicoes` | Busca o arquivo inteiro (`{}` se ainda não existe) |
| PUT | `/edicoes` | Salva o arquivo inteiro (substitui) |
| DELETE | `/edicoes` | Exclui o arquivo |
| GET | `/edicoes/:slideId` | Edições de um slide |
| DELETE | `/edicoes/:slideId` | Remove o slide inteiro |
| GET | `/edicoes/:slideId/campo?chave=…` | Busca um campo |
| PUT | `/edicoes/:slideId/campo` | Cria ou edita um campo. Corpo: `{ "chave": "…", "valor": { "color": "#0B5D3B" } }` (mescla com o que já existe) |
| DELETE | `/edicoes/:slideId/campo?chave=…` | Exclui um campo (slide vazio some do arquivo) |
| GET | `/health` | Estado do serviço e do armazenamento |

Leitura é aberta. **PUT/DELETE exigem** `Authorization: Bearer <API_TOKEN>`.
A `chave` (ex.: `div>h1:nth-child(2)::Qual dor…`) é texto livre, por isso vai na query/corpo e não no caminho.

## Rodar local

```bash
cd back-end
npm install
npm run dev      # http://localhost:8787  (sem token do Blob grava em .dev-data/edicoes.json)
npm test         # testa o CRUD completo sem precisar de Blob
```

Exemplo:

```bash
curl -X PUT localhost:8787/edicoes/slide-01/campo \
  -H "Content-Type: application/json" \
  -d '{"chave":"h1::Jornada do Cooperado","valor":{"color":"#0B5D3B","fontSize":120}}'
curl localhost:8787/edicoes
```

## Publicar na Vercel

1. Na Vercel, crie um projeto apontando para a pasta `back-end` (Root Directory = `back-end`).
2. No projeto: **Storage → Create → Blob** e conecte (isso cria `BLOB_READ_WRITE_TOKEN` automaticamente).
3. Em **Settings → Environment Variables** adicione `API_TOKEN` (chave longa) e `ALLOWED_ORIGINS` (URL onde a apresentação roda).
4. `npm run deploy` (ou push no Git). Em produção, sem `API_TOKEN` as rotas de escrita respondem 500 de propósito.

## Observações

- O arquivo no Blob é **público por URL** (só contém textos/estilos dos slides). Quem altera é protegido pelo token.
- Gravação é "ler → alterar → regravar": duas edições no mesmo instante podem se sobrescrever. Para poucos editores, tudo bem.
- O front já usa esta API (`GET /edicoes` ao abrir, `PUT /edicoes` ao editar, com o token digitado por quem edita). Veja `docs/EDICAO.md` › Nuvem.
- Ao mudar `types.ts` (campos novos no editor), publique o back-end de novo: ele recusa campos que não conhece.
