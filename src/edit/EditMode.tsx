import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';

/**
 * Dois modos de exibição:
 *  - apresentação: limpo, nada editável, clique nas laterais navega.
 *  - edição: textos, cards, prints e logo editáveis.
 * Alterna com a tecla E ou pelo botão da barra de controles.
 * Ao recarregar a página, volta no último modo usado (o slide vem da URL #/N).
 * `?editar` ou `?apresentar` na URL forçam o modo.
 */
interface EditModeValue { editing: boolean; locked: boolean; toggle: () => void; setEditing: (v: boolean) => void }

const Ctx = createContext<EditModeValue>({ editing: false, locked: false, toggle: () => {}, setEditing: () => {} });
const MODE_KEY = 'bws-help:modo';

function initialMode() {
  const q = new URLSearchParams(window.location.search);
  if (q.has('editar')) return true;
  if (q.has('apresentar') || q.has('print')) return false;
  try { return localStorage.getItem(MODE_KEY) === 'edicao'; } catch { return false; }
}

export function EditModeProvider({ children }: { children: ReactNode }) {
  // Link somente-apresentação (?apresentar): a edição fica bloqueada (sem botão, sem tecla E, sem ?editar).
  const locked = isViewOnlyUrl();
  const [editing, setEditingRaw] = useState(() => (locked ? false : initialMode()));
  const setEditing = useCallback((v: boolean) => { if (!locked) setEditingRaw(v); }, [locked]);
  const toggle = useCallback(() => { if (!locked) setEditingRaw((e) => !e); }, [locked]);

  useEffect(() => {
    const mode = editing ? 'edicao' : 'apresentacao';
    document.body.dataset.mode = mode;
    if (new URLSearchParams(window.location.search).has('print')) return; // PDF não altera o modo salvo
    if (locked) return; // visitante do link não altera o modo salvo do editor
    try { localStorage.setItem(MODE_KEY, mode); } catch { /* navegador sem armazenamento */ }
  }, [editing]);

  return <Ctx.Provider value={{ editing, locked, toggle, setEditing }}>{children}</Ctx.Provider>;
}

export const useEditMode = () => useContext(Ctx);

/** Verdadeiro quando a URL tem ?apresentar (ou ?view): só modo apresentação. */
export function isViewOnlyUrl(): boolean {
  const q = new URLSearchParams(window.location.search);
  return q.has('apresentar') || q.has('view');
}

/** Monta o link somente-apresentação a partir do link base (a URL atual, sem ?editar nem hash). */
export function buildViewLink(slideNumber?: number): string {
  const u = new URL(window.location.href);
  u.search = '?apresentar';
  u.hash = slideNumber ? `#/${slideNumber}` : '';
  return u.toString();
}
