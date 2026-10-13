import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { HTTPException } from 'hono/http-exception';
import { bearerAuth } from 'hono/bearer-auth';
import { handle } from '@hono/node-server/vercel';
import { defaultStorage, type Storage } from './storage.js';
import { isDoc, textosOf, validarOverride, validarTudo, type Override, type Stored } from './types.js';

/**
 * API do edicoes.json.
 *
 *  GET    /edicoes                         arquivo inteiro ({} se ainda não existe)
 *  PUT    /edicoes                         salva o arquivo inteiro (substitui): formato v2 { versao, textos, cards } ou v1
 *  (as rotas por slide/campo mexem só na parte de textos; DELETE do slide remove também os cards dele)
 *  DELETE /edicoes                         exclui o arquivo
 *  GET    /edicoes/:slideId                edições de um slide
 *  DELETE /edicoes/:slideId                remove o slide inteiro
 *  GET    /edicoes/:slideId/campo?chave=   um campo
 *  PUT    /edicoes/:slideId/campo          cria/edita um campo  { chave, valor }  (mescla com o existente)
 *  DELETE /edicoes/:slideId/campo?chave=   remove um campo
 *
 * Leitura é aberta; PUT/DELETE exigem  Authorization: Bearer <API_TOKEN>.
 */
export function createApp(storage: Storage = defaultStorage()) {
  const app = new Hono();

  const origins = (process.env.ALLOWED_ORIGINS ?? '').split(',').map((s) => s.trim()).filter(Boolean);
  app.use('*', cors({
    origin: origins.length ? origins : '*',
    allowMethods: ['GET', 'PUT', 'DELETE', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization'],
  }));

  // Proteção das rotas de escrita
  app.use('/edicoes/*', requireTokenForWrites);
  app.use('/edicoes', requireTokenForWrites);

  app.get('/', (c) => c.json({ servico: 'apresentacao-backend', ok: true }));
  app.get('/health', (c) => c.json({ ok: true, storage: process.env.BLOB_READ_WRITE_TOKEN ? 'vercel-blob' : 'arquivo-local' }));

  // ---- arquivo inteiro ----
  app.get('/edicoes', async (c) => c.json((await storage.read()) ?? {}));

  app.put('/edicoes', async (c) => {
    const body = await c.req.json().catch(() => undefined);
    const erro = validarTudo(body);
    if (erro) return c.json({ erro }, 400);
    const todos = body as Stored;
    await storage.write(todos);
    return c.json({ ok: true, slides: Object.keys(textosOf(todos)).length + (isDoc(todos) ? Object.keys(todos.cards ?? {}).length : 0) });
  });

  app.delete('/edicoes', async (c) => {
    await storage.remove();
    return c.json({ ok: true });
  });

  // ---- por slide ----
  app.get('/edicoes/:slideId', async (c) => {
    const slide = textosOf((await storage.read()) ?? {})[c.req.param('slideId')];
    return slide ? c.json(slide) : c.json({ erro: 'slide sem edições' }, 404);
  });

  app.delete('/edicoes/:slideId', async (c) => {
    const id = c.req.param('slideId');
    const all: Stored = (await storage.read()) ?? {};
    const textos = textosOf(all);
    const cards = isDoc(all) ? (all.cards ??= {}) : {};
    if (!(id in textos) && !(id in cards)) return c.json({ erro: 'slide sem edições' }, 404);
    delete textos[id];
    delete cards[id];
    await storage.write(all);
    return c.json({ ok: true });
  });

  // ---- por campo (a chave é texto livre, então vai na query/corpo e não no caminho) ----
  app.get('/edicoes/:slideId/campo', async (c) => {
    const chave = c.req.query('chave');
    if (!chave) return c.json({ erro: 'informe ?chave=' }, 400);
    const campo = textosOf((await storage.read()) ?? {})[c.req.param('slideId')]?.[chave];
    return campo ? c.json(campo) : c.json({ erro: 'campo não encontrado' }, 404);
  });

  app.put('/edicoes/:slideId/campo', async (c) => {
    const body = (await c.req.json().catch(() => undefined)) as { chave?: unknown; valor?: unknown } | undefined;
    if (!body || typeof body.chave !== 'string' || !body.chave) return c.json({ erro: 'informe { chave, valor }' }, 400);
    const erro = validarOverride(body.valor);
    if (erro) return c.json({ erro }, 400);

    const id = c.req.param('slideId');
    const all: Stored = (await storage.read()) ?? {};
    const textos = textosOf(all);
    const atual = textos[id]?.[body.chave];
    const novo: Override = { ...atual, ...(body.valor as Override) };
    textos[id] = { ...textos[id], [body.chave]: novo };
    await storage.write(all);
    return c.json({ ok: true, criado: !atual, campo: novo }, atual ? 200 : 201);
  });

  app.delete('/edicoes/:slideId/campo', async (c) => {
    const chave = c.req.query('chave');
    if (!chave) return c.json({ erro: 'informe ?chave=' }, 400);
    const id = c.req.param('slideId');
    const all: Stored = (await storage.read()) ?? {};
    const textos = textosOf(all);
    if (!textos[id]?.[chave]) return c.json({ erro: 'campo não encontrado' }, 404);
    delete textos[id][chave];
    if (!Object.keys(textos[id]).length) delete textos[id]; // não deixa slide vazio no arquivo
    await storage.write(all);
    return c.json({ ok: true });
  });

  app.onError((e, c) => {
    if (e instanceof HTTPException) return c.json({ erro: e.status === 401 ? 'token inválido ou ausente' : e.message }, e.status);
    console.error(e);
    return c.json({ erro: 'erro interno' }, 500);
  });

  return app;
}

import type { MiddlewareHandler } from 'hono';
const requireTokenForWrites: MiddlewareHandler = async (c, next) => {
  if (c.req.method === 'GET' || c.req.method === 'OPTIONS' || c.req.method === 'HEAD') return next();
  const token = process.env.API_TOKEN;
  if (!token) {
    // sem token configurado: só libera fora de produção (desenvolvimento local)
    if (process.env.VERCEL_ENV === 'production' || process.env.NODE_ENV === 'production') {
      return c.json({ erro: 'API_TOKEN não configurado no servidor' }, 500);
    }
    return next();
  }
  return bearerAuth({ token })(c, next);
};

// A runtime Node da Vercel entrega req/res do Node. O adaptador os converte
// para os objetos Web Request/Response esperados pelo Hono.
export default handle(createApp());
