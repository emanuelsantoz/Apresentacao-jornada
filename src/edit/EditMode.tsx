import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';

/**
 * Dois modos de exibição:
 *  - apresentação: limpo, nada editável, clique nas laterais navega.
 *  - edição: textos, cards, prints e logo editáveis.
 * Alterna com a tecla E ou pelo botão da barra de controles.
 * Ao recarregar a página, volta no último modo usado (o slide vem da URL #/N).
 * `?editar` ou `?apresentar` na URL forçam o modo.
 */
interface EditModeValue { editing: boolean; toggle: () => void; setEditing: (v: boolean) => void }

const Ctx = createContext<EditModeValue>({ editing: false, toggle: () => {}, setEditing: () => {} });
const MODE_KEY = 'bws-help:modo';

function initialMode() {
  const q = new URLSearchParams(window.location.search);
  if (q.has('editar')) return true;
  if (q.has('apresentar') || q.has('print')) return false;
  try { return localStorage.getItem(MODE_KEY) === 'edicao'; } catch { return false; }
}

export function EditModeProvider({ children }: { children: ReactNode }) {
  const [editing, setEditing] = useState(initialMode);
  const toggle = useCallback(() => setEditing((e) => !e), []);

  useEffect(() => {
    const mode = editing ? 'edicao' : 'apresentacao';
    document.body.dataset.mode = mode;
    if (new URLSearchParams(window.location.search).has('print')) return; // PDF não altera o modo salvo
    try { localStorage.setItem(MODE_KEY, mode); } catch { /* navegador sem armazenamento */ }
  }, [editing]);

  return <Ctx.Provider value={{ editing, toggle, setEditing }}>{children}</Ctx.Provider>;
}

export const useEditMode = () => useContext(Ctx);
