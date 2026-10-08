import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';

/**
 * Dois modos de exibição:
 *  - apresentação: limpo, nada editável, clique nas laterais navega.
 *  - edição: textos, prints e logo editáveis ao passar o mouse.
 * Alterna com a tecla E ou pelo botão da barra de controles.
 */
interface EditModeValue { editing: boolean; toggle: () => void; setEditing: (v: boolean) => void }

const Ctx = createContext<EditModeValue>({ editing: false, toggle: () => {}, setEditing: () => {} });

export function EditModeProvider({ children }: { children: ReactNode }) {
  const [editing, setEditing] = useState(() => new URLSearchParams(window.location.search).has('editar'));
  const toggle = useCallback(() => setEditing((e) => !e), []);

  useEffect(() => {
    document.body.dataset.mode = editing ? 'edicao' : 'apresentacao';
  }, [editing]);

  return <Ctx.Provider value={{ editing, toggle, setEditing }}>{children}</Ctx.Provider>;
}

export const useEditMode = () => useContext(Ctx);
