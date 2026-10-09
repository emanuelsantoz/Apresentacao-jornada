import { useSyncExternalStore } from 'react';
import { localStore } from '../lib/localStore';

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
export interface EditsMeta {
  status: SaveStatus;
  savedAt?: number;
  source: 'arquivo' | 'local' | 'vazio';
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
let meta: EditsMeta = { status: 'carregando', source: 'vazio', pendingProject: false };
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

/** Carrega edições: locais têm prioridade sobre public/edicoes.json. */
export async function initEdits() {
  let local: EditsDoc | undefined;
  try {
    const raw = await localStore.get<unknown>('edits', LOCAL_KEY);
    if (raw) local = parseDoc(raw);
  } catch { /* ignore */ }
  const base = await loadBase();
  projectJson = docJson(base);
  if (local && !isEmpty(local)) {
    state = local;
    meta = { ...meta, source: 'local' };
  } else {
    state = base;
    meta = { ...meta, source: isEmpty(base) ? 'vazio' : 'arquivo' };
  }
  setMeta({ status: 'salvo', pendingProject: docJson(state) !== projectJson });
}

function commit(next: EditsDoc, { label, tag, window: win = 1000 }: Opts) {
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
