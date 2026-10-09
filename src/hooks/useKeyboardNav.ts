import { useEffect, useRef } from 'react';

interface Handlers {
  next: () => void;
  prev: () => void;
  goTo: (i: number) => void;
  total: number;
  toggleOverview: () => void;
  toggleNotes: () => void;
  toggleEdit: () => void;
  closeOverlays: () => void;
}

/** Teclado: → Espaço PgDn | ← PgUp | Home End | número+Enter | F | O | N | E (edição) | Esc */
export function useKeyboardNav(h: Handlers) {
  const ref = useRef(h);
  ref.current = h;
  const typed = useRef('');

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      if (t.closest('input, textarea, [contenteditable]:not([contenteditable="false"])')) return;
      if (e.ctrlKey || e.metaKey || e.altKey) return; // atalhos (Ctrl+Z etc.) não navegam
      const k = ref.current;
      if (/^[0-9]$/.test(e.key)) { typed.current += e.key; return; }
      switch (e.key) {
        case 'ArrowRight': case ' ': case 'PageDown': e.preventDefault(); k.next(); break;
        case 'ArrowLeft': case 'PageUp': e.preventDefault(); k.prev(); break;
        case 'Home': k.goTo(0); break;
        case 'End': k.goTo(k.total - 1); break;
        case 'Enter':
          if (typed.current) k.goTo(parseInt(typed.current, 10) - 1);
          else k.next();
          break;
        case 'f': case 'F':
          if (document.fullscreenElement) void document.exitFullscreen();
          else void document.documentElement.requestFullscreen?.();
          break;
        case 'o': case 'O': k.toggleOverview(); break;
        case 'n': case 'N': k.toggleNotes(); break;
        case 'e': case 'E': k.toggleEdit(); break;
        case 'Escape': k.closeOverlays(); break;
      }
      typed.current = '';
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);
}
