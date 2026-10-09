import assert from 'node:assert/strict';
import { createApp } from '../src/app.js';
import type { Storage } from '../src/storage.js';
import type { AllEdits } from '../src/types.js';

// storage em memória: testa a API sem Blob
let mem: AllEdits | null = null;
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
