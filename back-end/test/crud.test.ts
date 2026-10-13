import assert from 'node:assert/strict';
import { createApp } from '../src/app.js';
import type { Storage } from '../src/storage.js';
import type { Stored } from '../src/types.js';

// storage em memória: testa a API sem Blob
let mem: Stored | null = null;
const storage: Storage = {
  read: async () => (mem ? structuredClone(mem) : null),
  write: async (d) => { mem = structuredClone(d); },
  remove: async () => { mem = null; },
};
process.env.API_TOKEN = 'segredo';
const app = createApp(storage);
const H = { 'Content-Type': 'application/json', Authorization: 'Bearer segredo' };
const call = (m: string, p: string, body?: unknown, h: Record<string, string> = H) =>
  app.request(p, { method: m, headers: h, body: body === undefined ? undefined : JSON.stringify(body) });
const KEY = 'div>h1:nth-child(2)::Qual dor a Jornada';

let r = await call('GET', '/edicoes'); assert.equal(r.status, 200); assert.deepEqual(await r.json(), {});
r = await call('PUT', '/edicoes', { 'slide-03': { [KEY]: { texts: ['Qual desafio'] } } }); assert.equal(r.status, 200);
r = await call('GET', '/edicoes/slide-03'); assert.deepEqual(await r.json(), { [KEY]: { texts: ['Qual desafio'] } });

// editar: mescla (mantém texts, adiciona color)
r = await call('PUT', '/edicoes/slide-03/campo', { chave: KEY, valor: { color: '#0B5D3B' } }); assert.equal(r.status, 200);
r = await call('GET', `/edicoes/slide-03/campo?chave=${encodeURIComponent(KEY)}`);
assert.deepEqual(await r.json(), { texts: ['Qual desafio'], color: '#0B5D3B' });

// criar campo novo em slide novo
r = await call('PUT', '/edicoes/slide-01/campo', { chave: 'a::b', valor: { fontSize: 40 } }); assert.equal(r.status, 201);

// validação
r = await call('PUT', '/edicoes/slide-01/campo', { chave: 'a::b', valor: { fontSize: 'x' } }); assert.equal(r.status, 400);
r = await call('PUT', '/edicoes', [1]); assert.equal(r.status, 400);

// excluir campo; slide some quando fica vazio
r = await call('DELETE', `/edicoes/slide-01/campo?chave=${encodeURIComponent('a::b')}`); assert.equal(r.status, 200);
r = await call('GET', '/edicoes/slide-01'); assert.equal(r.status, 404);
r = await call('DELETE', `/edicoes/slide-03/campo?chave=nao-existe`); assert.equal(r.status, 404);

// auth
r = await call('PUT', '/edicoes', {}, { 'Content-Type': 'application/json' }); assert.equal(r.status, 401);
r = await call('DELETE', '/edicoes', undefined, { Authorization: 'Bearer errado' }); assert.equal(r.status, 401);
r = await call('GET', '/edicoes', undefined, {}); assert.equal(r.status, 200); // leitura aberta

// excluir slide e arquivo
r = await call('DELETE', '/edicoes/slide-03'); assert.equal(r.status, 200);
r = await call('PUT', '/edicoes', { 'slide-02': {} }); r = await call('DELETE', '/edicoes'); assert.equal(mem, null);
console.log('✔ CRUD ok');

// ---- formato v2 (marca-texto, posição/tamanho, cards novos) ----
const DOC = {
  versao: 2,
  textos: { 'slide-14': { 'box::0.1': { dx: 10, dy: -4, width: 300 }, 'x::Texto': { texts: ['Novo'], background: '#FEF08A', marks: [{ i: 0, start: 0, end: 3, color: '#BBF7D0' }] } } },
  cards: { 'slide-14': [{ id: 'c1', x: 750, y: 420, w: 440, h: 190, fill: '#FFFFFF', t: { texts: ['Card'], fontSize: 36 } }] },
};
r = await call('PUT', '/edicoes', DOC); assert.equal(r.status, 200);
r = await call('GET', '/edicoes'); assert.deepEqual(await r.json(), DOC);
r = await call('GET', '/edicoes/slide-14'); assert.deepEqual(await r.json(), DOC.textos['slide-14']); // por slide = só textos
r = await call('PUT', '/edicoes/slide-14/campo', { chave: 'x::Texto', valor: { color: '#0B5D3B' } }); assert.equal(r.status, 200);
r = await call('GET', '/edicoes'); const depois = (await r.json()) as typeof DOC;
assert.equal(depois.cards['slide-14'].length, 1); // os cards não somem ao editar um campo
assert.equal((depois.textos['slide-14']['x::Texto'] as { color?: string }).color, '#0B5D3B');
r = await call('PUT', '/edicoes', { versao: 2, textos: {}, cards: { s: [{ id: 'a', x: 1 }] } }); assert.equal(r.status, 400); // card incompleto
r = await call('PUT', '/edicoes', { versao: 1, textos: {}, cards: {} }); assert.equal(r.status, 400);
r = await call('PUT', '/edicoes', { s: { k: { dx: 'x' } } }); assert.equal(r.status, 400);
r = await call('DELETE', '/edicoes/slide-14'); assert.equal(r.status, 200); // remove textos e cards do slide
r = await call('GET', '/edicoes'); const fim = (await r.json()) as typeof DOC;
assert.deepEqual([Object.keys(fim.textos), Object.keys(fim.cards)], [[], []]);
console.log('✔ formato v2 ok');
