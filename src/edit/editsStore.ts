import { useSyncExternalStore } from 'react';
import { localStore } from '../lib/localStore';
import { CLOUD_ENABLED, CloudError, cloudRead, cloudWrite, tokenStore } from '../lib/cloud';

/**
 * Edições feitas pela interface (modo edição).
 *
 * Documento: { textos: { [slideId]: { [chave]: Override } }, cards: { [slideId]: NewCard[] } }
 * Origem ao abrir: edições locais deste navegador (se houver) → senão public/edicoes.json.
 * Para tornar permanente: “Salvar no projeto” (em desenvolvimento) ou “Exportar” → public/edicoes.json.
 *
 * Toda alteração entra no histórico (Ctrl+Z / Ctrl+Y). Digitação e arrastes seguidos
 * no mesmo item viram uma única entrada.
 */

/** Fundo colorido num trecho do texto: nó de texto `i`, caracteres [start, end). */
export interface Mark { i: number; start: number; end: number; color: string }

export interface TextOverride {
  /** novo conteúdo de cada trecho de texto do elemento (na ordem) */
  texts?: string[];
  color?: string;
  fontSize?: number; // px no palco 1920x1080
  fontWeight?: number;
  /** fundo (marca-texto) no texto inteiro */
  background?: string;
  /** fundo em trechos específicos */
  marks?: Mark[];
}
/** Tamanho e deslocamento de um elemento existente (chave `box::caminho`). */
export interface BoxOverride { width?: number; height?: number; dx?: number; dy?: number }
export type Override = TextOverride & BoxOverride;
export type SlideEdits = Record<string, Override>;
export type AllEdits = Record<string, SlideEdits>;

/** Card criado pela interface. `t.texts[0]` é o conteúdo. */
export interface NewCard { id: string; x: number; y: number; w: number; h: number; fill: string; t: TextOverride }
export type AllCards = Record<string, NewCard[]>;

export interface EditsDoc { textos: AllEdits; cards: AllCards }

export type SaveStatus = 'carregando' | 'salvando' | 'salvo' | 'erro';
/**
 * Estado da sincronização com a nuvem (API no Vercel):
 *  ok = nuvem em dia · enviando · pendente = alterações ainda não enviadas · sem-token = falta o token para enviar
 *  offline = não alcançou a API · erro = a API recusou · conflito = nuvem e este navegador mudaram por caminhos diferentes
 */
export type CloudStatus = 'desligada' | 'carregando' | 'ok' | 'enviando' | 'pendente' | 'sem-token' | 'offline' | 'erro' | 'conflito';

export interface EditsMeta {
  status: SaveStatus;
  savedAt?: number;
  source: 'nuvem' | 'arquivo' | 'local' | 'vazio';
  cloud: CloudStatus;
  cloudAt?: number;
  cloudMsg?: string;
  undoLabel?: string;
  redoLabel?: string;
  /** há alterações que ainda não estão em public/edicoes.json */
  pendingProject: boolean;
}

interface Opts { label: string; tag?: string; window?: number }

const LOCAL_KEY = 'todas';
const MAX_HISTORY = 200;
const EMPTY: EditsDoc = { textos: {}, cards: {} };

let state: EditsDoc = EMPTY;
let projectJson = JSON.stringify(EMPTY);
const past: { doc: EditsDoc; label: string }[] = [];
let future: { doc: EditsDoc; label: string }[] = [];
let lastTag: string | undefined;
let lastAt = 0;
let meta: EditsMeta = { status: 'carregando', source: 'vazio', cloud: CLOUD_ENABLED ? 'carregando' : 'desligada', pendingProject: false };
const listeners = new Set<() => void>();
let saveTimer: number | undefined;

const emit = () => listeners.forEach((l) => l());
const setMeta = (patch: Partial<EditsMeta>) => { meta = { ...meta, ...patch }; emit(); };

const historyMeta = () => ({ undoLabel: past[past.length - 1]?.label, redoLabel: future[future.length - 1]?.label });
const isEmpty = (d: EditsDoc) => !Object.keys(d.textos).length && !Object.keys(d.cards).length;

/** Aceita o formato atual ({versao:2, textos, cards}) e o antigo (só textos). */
function parseDoc(raw: unknown): EditsDoc {
  if (!raw || typeof raw !== 'object') return EMPTY;
  const r = raw as Partial<EditsDoc> & { versao?: number };
  if (r.versao || 'textos' in r || 'cards' in r) return { textos: r.textos ?? {}, cards: r.cards ?? {} };
  return { textos: raw as AllEdits, cards: {} };
}

/** Remove slides vazios para o arquivo exportado ficar limpo. */
function serialize(d: EditsDoc) {
  const textos = Object.fromEntries(Object.entries(d.textos).filter(([, v]) => Object.keys(v).length));
  const cards = Object.fromEntries(Object.entries(d.cards).filter(([, v]) => v.length));
  return { versao: 2, textos, cards };
}
const docJson = (d: EditsDoc) => JSON.stringify(serialize(d));

async function writeLocal() {
  window.clearTimeout(saveTimer);
  saveTimer = undefined;
  try {
    await localStore.put('edits', LOCAL_KEY, serialize(state));
    setMeta({ status: 'salvo', savedAt: Date.now() });
  } catch {
    setMeta({ status: 'erro' });
  }
}

function persist() {
  window.clearTimeout(saveTimer);
  saveTimer = window.setTimeout(() => void writeLocal(), 400);
}

async function loadBase(): Promise<EditsDoc> {
  try {
    const r = await fetch(`${import.meta.env.BASE_URL}edicoes.json`, { cache: 'no-store' });
    if (r.ok) return parseDoc(await r.json());
  } catch { /* sem arquivo (ex.: HTML único aberto direto) */ }
  return EMPTY;
}

// ---- nuvem ---------------------------------------------------------------------------------------

const SYNC_KEY = 'bws-help:nuvem'; // JSON do último estado confirmado na nuvem (para saber se há alterações locais)
const lsGet = (k: string) => { try { return localStorage.getItem(k); } catch { return null; } };
const lsSet = (k: string, v: string) => { try { localStorage.setItem(k, v); } catch { /* sem armazenamento */ } };

let cloudJson: string | null = null; // último conteúdo conhecido da nuvem (null = desconhecido)
let conflictDoc: EditsDoc | null = null; // versão da nuvem durante um conflito
let cloudTimer: number | undefined;
let pushing = false;

const cloudDirty = () => cloudJson === null || docJson(state) !== cloudJson;

function scheduleCloud(ms = 1500) {
  window.clearTimeout(cloudTimer);
  cloudTimer = window.setTimeout(() => void pushCloud(), ms);
}

/** Depois de qualquer mudança local: marca o que falta enviar e agenda o envio. */
function markCloudDirty() {
  if (!CLOUD_ENABLED || meta.cloud === 'conflito' || meta.cloud === 'carregando' || pushing) return;
  if (!cloudDirty()) { setMeta({ cloud: 'ok', cloudMsg: undefined }); return; }
  if (!tokenStore.get()) { setMeta({ cloud: 'sem-token', cloudMsg: undefined }); return; }
  setMeta({ cloud: 'pendente', cloudMsg: undefined });
  scheduleCloud();
}

/**
 * Confere a nuvem ANTES de qualquer envio. Se lá há algo que este navegador não conhece (outra pessoa
 * salvou, ou a nuvem nunca foi lida nesta sessão), vira conflito em vez de sobrescrever.
 */
async function learnCloud(): Promise<'ok' | 'conflito' | 'falha'> {
  try {
    const doc = parseDoc(await cloudRead());
    const json = docJson(doc);
    const unknownChange = cloudJson === null ? lsGet(SYNC_KEY) !== json : json !== cloudJson;
    cloudJson = json;
    if (!isEmpty(doc) && json !== docJson(state) && unknownChange) {
      conflictDoc = doc;
      setMeta({ cloud: 'conflito', cloudMsg: 'A nuvem tem uma versão diferente da deste navegador' });
      return 'conflito';
    }
    return 'ok';
  } catch (e) {
    const err = e instanceof CloudError ? e : new CloudError('Falha ao ler a nuvem', 'servidor');
    setMeta({ cloud: err.kind === 'rede' ? 'offline' : 'erro', cloudMsg: err.message });
    return 'falha';
  }
}

/** Envia o documento inteiro para a nuvem (substitui o arquivo lá). */
async function pushCloud(): Promise<boolean> {
  window.clearTimeout(cloudTimer);
  if (!CLOUD_ENABLED || meta.cloud === 'carregando') return false;
  const token = tokenStore.get();
  if (!token) { setMeta({ cloud: 'sem-token' }); return false; }
  if (pushing) return false;
  pushing = true;
  const seen = await learnCloud();
  if (seen !== 'ok') { pushing = false; if (seen === 'falha' && meta.cloud === 'offline') scheduleCloud(20000); return false; }
  if (docJson(state) === cloudJson) { pushing = false; lsSet(SYNC_KEY, cloudJson!); setMeta({ cloud: 'ok', cloudAt: Date.now(), cloudMsg: undefined }); return true; } // nada a enviar
  setMeta({ cloud: 'enviando', cloudMsg: undefined });
  const sent = docJson(state);
  try {
    await cloudWrite(JSON.parse(sent), token);
    cloudJson = sent;
    lsSet(SYNC_KEY, sent);
    pushing = false;
    if (docJson(state) !== sent) { markCloudDirty(); return true; } // mudou durante o envio
    setMeta({ cloud: 'ok', cloudAt: Date.now(), cloudMsg: undefined });
    return true;
  } catch (e) {
    pushing = false;
    const err = e instanceof CloudError ? e : new CloudError('Falha ao enviar', 'servidor');
    setMeta({ cloud: err.kind === 'rede' ? 'offline' : 'erro', cloudMsg: err.message });
    if (err.kind !== 'auth') scheduleCloud(20000); // tenta de novo (sem insistir se o token foi recusado)
    return false;
  }
}

/** Troca o conteúdo pelo da nuvem (entra no histórico: Ctrl+Z traz de volta o anterior). */
function adoptCloud(doc: EditsDoc) {
  commitRaw(doc, { label: 'carregar da nuvem' });
  cloudJson = docJson(doc);
  lsSet(SYNC_KEY, cloudJson);
  conflictDoc = null;
  setMeta({ cloud: 'ok', cloudAt: Date.now(), cloudMsg: undefined, source: 'nuvem' });
}

/** Atualização vinda de outro lugar (sem histórico): usada ao voltar para a aba. */
async function refreshFromCloud() {
  if (!CLOUD_ENABLED || pushing || meta.cloud === 'conflito' || meta.cloud === 'carregando' || meta.cloud === 'enviando') return;
  if (cloudJson === null) { if ((await learnCloud()) === 'ok') markCloudDirty(); return; } // nunca leu a nuvem: só confere
  if (cloudDirty()) return; // há alterações locais ainda não enviadas
  try {
    const doc = parseDoc(await cloudRead());
    const json = docJson(doc);
    if (isEmpty(doc) || json === cloudJson) { cloudJson = json; if (meta.cloud !== 'ok') setMeta({ cloud: 'ok', cloudMsg: undefined }); return; }
    if (docJson(state) !== (cloudJson ?? '')) return; // mudou enquanto buscava
    state = doc;
    past.length = 0;
    future = [];
    cloudJson = json;
    lsSet(SYNC_KEY, json);
    persist();
    setMeta({ ...historyMeta(), cloud: 'ok', cloudAt: Date.now(), cloudMsg: undefined, source: 'nuvem' });
  } catch (e) {
    if (e instanceof CloudError && e.kind === 'rede') setMeta({ cloud: 'offline', cloudMsg: e.message });
  }
}

/** Carrega edições: nuvem → este navegador (se tiver alterações não enviadas) → public/edicoes.json. */
let initPromise: Promise<void> | undefined;
export function initEdits(): Promise<void> {
  return (initPromise ??= doInit());
}

async function doInit() {
  const cloudP: Promise<EditsDoc | 'falha' | null> = CLOUD_ENABLED
    ? cloudRead().then((raw) => parseDoc(raw), () => 'falha' as const)
    : Promise.resolve(null);

  let local: EditsDoc | undefined;
  try {
    const raw = await localStore.get<unknown>('edits', LOCAL_KEY);
    if (raw) local = parseDoc(raw);
  } catch { /* ignore */ }
  const base = await loadBase();
  projectJson = docJson(base);
  const cloud = await cloudP;

  const hasLocal = !!local && !isEmpty(local);
  const cloudDoc = cloud && cloud !== 'falha' ? cloud : null;
  const cloudHas = !!cloudDoc && !isEmpty(cloudDoc);
  const synced = lsGet(SYNC_KEY);
  cloudJson = cloudDoc ? docJson(cloudDoc) : null;

  if (cloud === 'falha') {
    // sem alcançar a API: segue com o que há neste navegador / no projeto
    state = hasLocal ? local! : base;
    meta = { ...meta, source: hasLocal ? 'local' : isEmpty(base) ? 'vazio' : 'arquivo', cloud: 'offline', cloudMsg: 'Sem conexão com a nuvem' };
    window.setTimeout(() => void refreshFromCloud(), 20000); // tenta de novo (lê antes de enviar qualquer coisa)
  } else if (!CLOUD_ENABLED || !cloudDoc) {
    state = hasLocal ? local! : base;
    meta = { ...meta, source: hasLocal ? 'local' : isEmpty(base) ? 'vazio' : 'arquivo', cloud: CLOUD_ENABLED ? 'ok' : 'desligada' };
  } else if (!hasLocal) {
    state = cloudHas ? cloudDoc : base;
    if (cloudHas) { lsSet(SYNC_KEY, cloudJson!); persist(); }
    meta = { ...meta, source: cloudHas ? 'nuvem' : isEmpty(base) ? 'vazio' : 'arquivo', cloud: 'ok' };
  } else {
    const localJson = docJson(local!);
    const localInSync = synced !== null && localJson === synced;
    if (localInSync) {
      // sem alterações locais pendentes: vale o que está na nuvem (pode ter vindo de outra pessoa)
      state = cloudHas && cloudJson !== localJson ? cloudDoc : local!;
      meta = { ...meta, source: state === cloudDoc ? 'nuvem' : 'local', cloud: 'ok' };
      if (state === cloudDoc) { lsSet(SYNC_KEY, cloudJson!); persist(); }
    } else if (!cloudHas || cloudJson === localJson || (synced !== null && cloudJson === synced)) {
      // só este navegador mudou: vale o local e fica para enviar
      state = local!;
      meta = { ...meta, source: 'local', cloud: 'ok' };
    } else {
      // nuvem e navegador mudaram por caminhos diferentes: o usuário escolhe
      state = local!;
      conflictDoc = cloudDoc;
      meta = { ...meta, source: 'local', cloud: 'conflito', cloudMsg: 'A nuvem tem uma versão diferente da deste navegador' };
    }
  }
  setMeta({ status: 'salvo', pendingProject: docJson(state) !== projectJson });
  if (cloud !== 'falha') markCloudDirty();
}

if (typeof window !== 'undefined') {
  document.addEventListener('visibilitychange', () => { if (!document.hidden) void refreshFromCloud(); });
  window.addEventListener('online', () => { if (meta.cloud === 'offline') { void refreshFromCloud(); markCloudDirty(); } });
}

function commit(next: EditsDoc, opts: Opts) {
  commitRaw(next, opts);
  markCloudDirty();
}

function commitRaw(next: EditsDoc, { label, tag, window: win = 1000 }: Opts) {
  const now = Date.now();
  const coalesce = tag !== undefined && tag === lastTag && now - lastAt < win;
  if (!coalesce) {
    past.push({ doc: state, label });
    if (past.length > MAX_HISTORY) past.shift();
  }
  future = [];
  lastTag = tag;
  lastAt = now;
  state = next;
  persist();
  meta = { ...meta, ...historyMeta(), status: 'salvando', source: 'local', pendingProject: docJson(next) !== projectJson };
  emit();
}

function travel(from: typeof past, to: typeof future) {
  const entry = from.pop();
  if (!entry) return undefined;
  to.push({ doc: state, label: entry.label });
  state = entry.doc;
  lastTag = undefined;
  persist();
  meta = { ...meta, ...historyMeta(), status: 'salvando', source: 'local', pendingProject: docJson(state) !== projectJson };
  emit();
  markCloudDirty();
  return entry.label;
}

const withSlideTextos = (slideId: string, slide: SlideEdits): EditsDoc => ({ ...state, textos: { ...state.textos, [slideId]: slide } });
const withSlideCards = (slideId: string, list: NewCard[]): EditsDoc => ({ ...state, cards: { ...state.cards, [slideId]: list } });

const clean = <T extends object>(o: T): T => {
  const out = { ...o };
  (Object.keys(out) as (keyof T)[]).forEach((k) => out[k] === undefined && delete out[k]);
  return out;
};

let seq = 0;
const newId = () => `c${Date.now().toString(36)}${(seq++).toString(36)}`;

export const edits = {
  get: () => state,
  meta: () => meta,
  subscribe: (l: () => void) => { listeners.add(l); return () => listeners.delete(l); },

  /** Mescla `patch` no item (campos `undefined` são removidos). */
  set(slideId: string, key: string, patch: Partial<Override>, opts: Opts) {
    const merged = clean({ ...(state.textos[slideId]?.[key] ?? {}), ...patch });
    edits.put(slideId, key, Object.keys(merged).length ? merged : undefined, opts);
  },

  /** Substitui o item inteiro (`undefined` remove). */
  put(slideId: string, key: string, value: Override | undefined, opts: Opts) {
    const slide = { ...(state.textos[slideId] ?? {}) };
    if (JSON.stringify(slide[key]) === JSON.stringify(value)) return;
    if (value) slide[key] = value;
    else delete slide[key];
    commit(withSlideTextos(slideId, slide), opts);
  },

  /** Vários itens de uma vez (uma única entrada no histórico). */
  putMany(slideId: string, entries: [string, Override | undefined][], opts: Opts) {
    const slide = { ...(state.textos[slideId] ?? {}) };
    let changed = false;
    entries.forEach(([key, value]) => {
      if (JSON.stringify(slide[key]) === JSON.stringify(value)) return;
      changed = true;
      if (value) slide[key] = value;
      else delete slide[key];
    });
    if (changed) commit(withSlideTextos(slideId, slide), opts);
  },

  reset(slideId: string, ...keys: string[]) {
    edits.putMany(slideId, keys.map((k) => [k, undefined]), { label: 'restaurar original' });
  },

  resetSlide(slideId: string) {
    const textos = { ...state.textos };
    const cards = { ...state.cards };
    delete textos[slideId];
    delete cards[slideId];
    commit({ textos, cards }, { label: 'restaurar slide' });
  },

  addCard(slideId: string): string {
    const list = state.cards[slideId] ?? [];
    const off = (list.length % 6) * 36;
    const card: NewCard = {
      id: newId(), x: 750 + off, y: 420 + off, w: 440, h: 190, fill: '#FFFFFF',
      t: { texts: ['Novo texto'], fontSize: 36, fontWeight: 600 }, // sem cor: segue o fundo (claro/escuro)
    };
    commit(withSlideCards(slideId, [...list, card]), { label: 'novo card' });
    return card.id;
  },

  updateCard(slideId: string, id: string, patch: Partial<Omit<NewCard, 'id'>>, opts: Opts) {
    const list = state.cards[slideId] ?? [];
    commit(withSlideCards(slideId, list.map((c) => (c.id === id ? { ...c, ...patch, t: clean({ ...c.t, ...patch.t }) } : c))), opts);
  },

  /** Substitui (ou recria, ao cancelar) um card inteiro. */
  putCard(slideId: string, card: NewCard, opts: Opts) {
    const list = state.cards[slideId] ?? [];
    const exists = list.some((c) => c.id === card.id);
    commit(withSlideCards(slideId, exists ? list.map((c) => (c.id === card.id ? card : c)) : [...list, card]), opts);
  },

  removeCard(slideId: string, id: string) {
    commit(withSlideCards(slideId, (state.cards[slideId] ?? []).filter((c) => c.id !== id)), { label: 'excluir card' });
  },

  card: (slideId: string, id: string) => state.cards[slideId]?.find((c) => c.id === id),

  /** Próxima alteração começa uma nova entrada no histórico. */
  breakHistory() { lastTag = undefined; },

  undo: () => travel(past, future),
  redo: () => travel(future, past),

  /** Grava agora neste navegador (sem esperar o intervalo). */
  flush: () => writeLocal(),

  // ---- nuvem ----
  /** Informa/troca o token de escrita (fica só neste navegador). */
  setToken(token: string) {
    tokenStore.set(token.trim());
    if (meta.cloud === 'erro' || meta.cloud === 'sem-token') setMeta({ cloud: 'pendente', cloudMsg: undefined });
    markCloudDirty();
    if (tokenStore.get() && cloudDirty() && meta.cloud !== 'conflito') void pushCloud();
  },
  hasToken: () => !!tokenStore.get(),
  /** Envia agora para a nuvem (em vez de esperar o envio automático). */
  syncNow: () => pushCloud(),
  /** Busca a versão da nuvem e a aplica (Ctrl+Z desfaz). */
  async pullCloud() {
    try {
      const doc = parseDoc(await cloudRead());
      if (isEmpty(doc)) { setMeta({ cloud: meta.cloud === 'conflito' ? 'conflito' : 'ok', cloudMsg: undefined }); return 'vazia' as const; }
      adoptCloud(doc);
      return 'ok' as const;
    } catch (e) {
      const err = e instanceof CloudError ? e : new CloudError('Falha ao carregar', 'servidor');
      setMeta({ cloud: err.kind === 'rede' ? 'offline' : 'erro', cloudMsg: err.message });
      return 'erro' as const;
    }
  },
  /** Conflito: 'nuvem' descarta as alterações deste navegador; 'local' sobrescreve a nuvem com elas. */
  async resolveConflict(use: 'nuvem' | 'local') {
    if (use === 'nuvem' && conflictDoc) { adoptCloud(conflictDoc); return; }
    conflictDoc = null;
    setMeta({ cloud: 'pendente', cloudMsg: undefined });
    await pushCloud();
  },

  /** Em desenvolvimento: grava public/edicoes.json pelo servidor do Vite. */
  async saveToProject() {
    const body = JSON.stringify(serialize(state), null, 2);
    const r = await fetch(`${import.meta.env.BASE_URL}__edicoes`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body });
    if (!r.ok) throw new Error(await r.text());
    projectJson = docJson(state);
    setMeta({ pendingProject: false });
  },

  exportFile() {
    const blob = new Blob([JSON.stringify(serialize(state), null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'edicoes.json';
    a.click();
    URL.revokeObjectURL(a.href);
  },

  async importFile(file: File) {
    commit(parseDoc(JSON.parse(await file.text())), { label: 'importar' });
  },

  count: (slideId?: string) => {
    const n = (id: string) => Object.keys(state.textos[id] ?? {}).length + (state.cards[id]?.length ?? 0);
    if (slideId) return n(slideId);
    return [...new Set([...Object.keys(state.textos), ...Object.keys(state.cards)])].reduce((t, id) => t + n(id), 0);
  },
};

// grava o que estiver pendente antes de fechar/trocar de aba
if (typeof window !== 'undefined') {
  window.addEventListener('pagehide', () => { if (saveTimer !== undefined) void writeLocal(); });
  document.addEventListener('visibilitychange', () => { if (document.hidden && saveTimer !== undefined) void writeLocal(); });
}

export function useSlideEdits(slideId: string): SlideEdits | undefined {
  return useSyncExternalStore(edits.subscribe, () => state.textos[slideId]);
}

export function useSlideCards(slideId: string): NewCard[] | undefined {
  return useSyncExternalStore(edits.subscribe, () => state.cards[slideId]);
}

export function useEditsDoc(): EditsDoc {
  return useSyncExternalStore(edits.subscribe, () => state);
}

export function useEditsMeta(): EditsMeta {
  return useSyncExternalStore(edits.subscribe, () => meta);
}
