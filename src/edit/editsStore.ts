import { useSyncExternalStore } from 'react';
import { localStore } from '../lib/localStore';

/**
 * Edições feitas pela interface (modo edição).
 *
 * Estrutura: { [slideId]: { [chave do texto]: Override } }
 * Origem ao abrir: edições locais deste navegador (se houver) → senão public/edicoes.json.
 * Para tornar permanente: “Exportar” na barra de edição e salvar como public/edicoes.json.
 */
export interface TextOverride {
  /** novo conteúdo de cada trecho de texto do elemento (na ordem) */
  texts?: string[];
  color?: string;
  fontSize?: number; // px no palco 1920x1080
  fontWeight?: number;
}
export type SlideEdits = Record<string, TextOverride>;
export type AllEdits = Record<string, SlideEdits>;

const LOCAL_KEY = 'todas';
let state: AllEdits = {};
let source: 'arquivo' | 'local' | 'vazio' = 'vazio';
const listeners = new Set<() => void>();
let saveTimer: number | undefined;

const emit = () => listeners.forEach((l) => l());

function persist() {
  window.clearTimeout(saveTimer);
  saveTimer = window.setTimeout(() => {
    localStore.put('edits', LOCAL_KEY, state).catch(() => { /* sem persistência local */ });
  }, 250);
}

async function loadBase(): Promise<AllEdits> {
  try {
    const r = await fetch(`${import.meta.env.BASE_URL}edicoes.json`, { cache: 'no-store' });
    if (r.ok) return (await r.json()) as AllEdits;
  } catch { /* sem arquivo (ex.: HTML único aberto direto) */ }
  return {};
}

/** Carrega edições: locais têm prioridade sobre public/edicoes.json. */
export async function initEdits() {
  let local: AllEdits | undefined;
  try { local = await localStore.get<AllEdits>('edits', LOCAL_KEY); } catch { /* ignore */ }
  if (local && Object.keys(local).length) {
    state = local;
    source = 'local';
  } else {
    state = await loadBase();
    source = Object.keys(state).length ? 'arquivo' : 'vazio';
  }
  emit();
}

function commit(next: AllEdits) {
  state = next;
  source = 'local';
  persist();
  emit();
}

export const edits = {
  get: () => state,
  source: () => source,
  subscribe: (l: () => void) => { listeners.add(l); return () => listeners.delete(l); },

  set(slideId: string, key: string, patch: Partial<TextOverride>) {
    const cur = state[slideId]?.[key] ?? {};
    const merged: TextOverride = { ...cur, ...patch };
    (Object.keys(merged) as (keyof TextOverride)[]).forEach((k) => merged[k] === undefined && delete merged[k]);
    const slide = { ...(state[slideId] ?? {}), [key]: merged };
    if (!Object.keys(merged).length) delete slide[key];
    commit({ ...state, [slideId]: slide });
  },

  reset(slideId: string, key: string) {
    if (!state[slideId]?.[key]) return;
    const slide = { ...state[slideId] };
    delete slide[key];
    commit({ ...state, [slideId]: slide });
  },

  resetSlide(slideId: string) {
    const next = { ...state };
    delete next[slideId];
    commit(next);
  },

  /** Descarta edições locais e volta ao public/edicoes.json. */
  async discardLocal() {
    try { await localStore.del('edits', LOCAL_KEY); } catch { /* ignore */ }
    state = await loadBase();
    source = Object.keys(state).length ? 'arquivo' : 'vazio';
    emit();
  },

  exportFile() {
    const clean = Object.fromEntries(Object.entries(state).filter(([, v]) => Object.keys(v).length));
    const blob = new Blob([JSON.stringify(clean, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'edicoes.json';
    a.click();
    URL.revokeObjectURL(a.href);
  },

  async importFile(file: File) {
    const data = JSON.parse(await file.text()) as AllEdits;
    commit(data);
  },

  count: (slideId?: string) =>
    slideId ? Object.keys(state[slideId] ?? {}).length : Object.values(state).reduce((n, s) => n + Object.keys(s).length, 0),
};

export function useSlideEdits(slideId: string): SlideEdits | undefined {
  return useSyncExternalStore(edits.subscribe, () => state[slideId]);
}

export function useAllEdits(): AllEdits {
  return useSyncExternalStore(edits.subscribe, () => state);
}
