/**
 * Cliente da API do edicoes.json (back-end/ → Vercel + Vercel Blob).
 *
 *  GET /edicoes   (aberto)                 → arquivo inteiro ({} se ainda não existe)
 *  PUT /edicoes   (Authorization: Bearer)  → substitui o arquivo inteiro
 *
 * A URL vem de VITE_API_URL (veja .env.example). O token de escrita NUNCA entra no código/bundle:
 * quem edita informa uma vez e ele fica só no localStorage do próprio navegador.
 */
const DEFAULT_API = 'https://apresentacao-jornada-drnc.vercel.app';

export const API_URL: string = ((import.meta.env.VITE_API_URL as string | undefined) || DEFAULT_API).replace(/\/+$/, '');
/** VITE_CLOUD=off desliga a sincronização (usa só o navegador + public/edicoes.json). */
export const CLOUD_ENABLED = import.meta.env.VITE_CLOUD !== 'off';

const TOKEN_KEY = 'bws-help:token';
export const tokenStore = {
  get(): string {
    try { return localStorage.getItem(TOKEN_KEY) ?? ''; } catch { return ''; }
  },
  set(token: string) {
    try { if (token) localStorage.setItem(TOKEN_KEY, token); else localStorage.removeItem(TOKEN_KEY); } catch { /* sem armazenamento */ }
  },
};

export class CloudError extends Error {
  constructor(message: string, readonly kind: 'rede' | 'auth' | 'servidor', readonly status?: number) {
    super(message);
  }
}

async function request(path: string, init: RequestInit, timeoutMs = 10000): Promise<Response> {
  const ctl = new AbortController();
  const timer = window.setTimeout(() => ctl.abort(), timeoutMs);
  try {
    return await fetch(`${API_URL}${path}`, { ...init, signal: ctl.signal, cache: 'no-store' });
  } catch {
    throw new CloudError('Sem conexão com a nuvem', 'rede');
  } finally {
    window.clearTimeout(timer);
  }
}

async function fail(r: Response): Promise<never> {
  let msg = `Erro ${r.status}`;
  try { const j = (await r.json()) as { erro?: string }; if (j.erro) msg = j.erro; } catch { /* corpo não é JSON */ }
  if (r.status === 401 || r.status === 403) throw new CloudError('Token recusado pela nuvem', 'auth', r.status);
  throw new CloudError(msg, 'servidor', r.status);
}

export async function cloudRead(): Promise<unknown> {
  const r = await request('/edicoes', { method: 'GET', headers: { Accept: 'application/json' } });
  if (!r.ok) return fail(r);
  try { return await r.json(); } catch { throw new CloudError('Resposta inválida da nuvem', 'servidor', r.status); }
}

export async function cloudWrite(doc: unknown, token: string): Promise<void> {
  const r = await request('/edicoes', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(doc),
  }, 20000);
  if (!r.ok) return fail(r);
}
