import { Move } from 'lucide-react';
import type { CSSProperties, PointerEvent as ReactPointerEvent } from 'react';
import { edits } from './editsStore';
import { collectRefs, setGuides, snap } from './snap';

/**
 * Mover e redimensionar no modo edição.
 *  - `box`: elemento original do slide (texto ou card) — tamanho e deslocamento ficam em `box::caminho`;
 *  - `card`: card criado pela interface — posição e tamanho no próprio card.
 * Ao arrastar, bordas e centros encaixam nos outros elementos (guias rosa); Alt desliga o ímã.
 * Um arraste inteiro vira uma única entrada no histórico (Ctrl+Z desfaz o arraste todo).
 */
export type Handle = 'e' | 's' | 'se' | 'move';
export interface CardTarget { el: HTMLElement; root: HTMLElement; kind: 'box' | 'card'; slideId: string; key: string }

const CURSOR: Record<Handle, string> = { e: 'ew-resize', s: 'ns-resize', se: 'nwse-resize', move: 'move' };
const MIN_W = 80;
const MIN_H = 40;

/**
 * Começa um arraste. Com `threshold`, só começa depois de o mouse andar alguns px
 * (permite que um clique simples continue selecionando).
 */
export function startDrag(e: { clientX: number; clientY: number }, t: CardTarget, handle: Handle, threshold = 3) {
  const rect = t.el.getBoundingClientRect();
  const ratio = rect.width / t.el.offsetWidth || 1; // px da janela por px do elemento (palco + transformações)
  const w0 = t.el.offsetWidth;
  const h0 = t.el.offsetHeight;
  const card = t.kind === 'card' ? edits.card(t.slideId, t.key) : undefined;
  const box = t.kind === 'box' ? edits.get().textos[t.slideId]?.[t.key] : undefined;
  const x0 = e.clientX;
  const y0 = e.clientY;
  const opts = { label: handle === 'move' ? 'mover' : 'tamanho', tag: `arraste:${Date.now()}`, window: Infinity };
  const edges = handle === 'move' ? { x: 'all', y: 'all' } as const
    : { x: handle === 's' ? null : 'end', y: handle === 'e' ? null : 'end' } as const;
  let refs: ReturnType<typeof collectRefs> | null = null;
  let started = false;

  const onMove = (ev: PointerEvent) => {
    let sx = ev.clientX - x0;
    let sy = ev.clientY - y0;
    if (!started) {
      if (Math.abs(sx) + Math.abs(sy) < threshold) return;
      started = true;
      refs = collectRefs(t.root, t.el);
      document.body.style.cursor = CURSOR[handle];
      document.body.style.userSelect = 'none';
      window.getSelection()?.removeAllRanges();
    }
    if (!edges.x) sx = 0;
    if (!edges.y) sy = 0;
    if (!ev.altKey && refs) {
      const s = snap(rect, sx, sy, refs, edges);
      sx = s.sx;
      sy = s.sy;
      setGuides(s.guides);
    } else setGuides([]);
    const dx = Math.round(sx / ratio);
    const dy = Math.round(sy / ratio);

    if (handle === 'move') {
      if (card) {
        edits.updateCard(t.slideId, t.key, {
          x: Math.min(Math.max(card.x + dx, -card.w + 60), 1920 - 60),
          y: Math.min(Math.max(card.y + dy, -card.h + 40), 1080 - 40),
        }, opts);
      } else {
        edits.set(t.slideId, t.key, { dx: (box?.dx ?? 0) + dx || undefined, dy: (box?.dy ?? 0) + dy || undefined }, opts);
      }
      return;
    }
    const w = edges.x ? Math.max(MIN_W, w0 + dx) : undefined;
    const h = edges.y ? Math.max(MIN_H, h0 + dy) : undefined;
    if (card) edits.updateCard(t.slideId, t.key, { ...(w !== undefined && { w }), ...(h !== undefined && { h }) }, opts);
    else edits.set(t.slideId, t.key, { ...(w !== undefined && { width: w }), ...(h !== undefined && { height: h }) }, opts);
  };
  const onUp = () => {
    window.removeEventListener('pointermove', onMove);
    window.removeEventListener('pointerup', onUp);
    window.removeEventListener('pointercancel', onUp);
    setGuides([]);
    if (!started) return;
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
    // o clique que encerra o arraste não deve selecionar outra coisa
    const swallow = (ev: MouseEvent) => { ev.stopPropagation(); ev.preventDefault(); };
    window.addEventListener('click', swallow, { capture: true, once: true });
    window.setTimeout(() => window.removeEventListener('click', swallow, { capture: true }), 80);
  };
  window.addEventListener('pointermove', onMove);
  window.addEventListener('pointerup', onUp);
  window.addEventListener('pointercancel', onUp);
}

const down = (target: CardTarget, h: Handle) => (e: ReactPointerEvent) => {
  if (e.button !== 0) return;
  e.preventDefault();
  e.stopPropagation();
  startDrag(e, target, h, 0);
};

/** Contorno + alças de tamanho (direita, baixo, canto). */
export function CardFrame({ target, strong }: { target: CardTarget; strong: boolean }) {
  const r = target.el.getBoundingClientRect();
  const handle = (h: Handle, pos: CSSProperties) => (
    <span data-editor-ui title="Arraste para mudar o tamanho" onPointerDown={down(target, h)} style={{ ...dot, ...pos, cursor: CURSOR[h] }} />
  );
  return (
    <>
      <div
        data-editor-ui
        style={{
          position: 'fixed', left: r.left - 3, top: r.top - 3, width: r.width + 6, height: r.height + 6, zIndex: 59, pointerEvents: 'none',
          borderRadius: 10, outline: strong ? '2px solid #1D4ED8' : '1.5px dashed rgba(29,78,216,0.7)',
        }}
      />
      {handle('e', { left: r.right - 5, top: r.top + r.height / 2 - 12, width: 10, height: 24 })}
      {handle('s', { left: r.left + r.width / 2 - 12, top: r.bottom - 5, width: 24, height: 10 })}
      {handle('se', { left: r.right - 7, top: r.bottom - 7, width: 14, height: 14 })}
    </>
  );
}

/** Botão “Mover” logo abaixo do elemento selecionado. */
export function MovePill({ target }: { target: CardTarget }) {
  const r = target.el.getBoundingClientRect();
  return (
    <span data-editor-ui onPointerDown={down(target, 'move')} title="Arraste para mover (Alt: sem ímã) · setas movem 1 px, Shift+setas 10 px" style={{ ...moveBtn, left: r.left, top: r.bottom + 8 }}>
      <Move size={13} /> Mover
    </span>
  );
}

const dot: CSSProperties = {
  position: 'fixed', zIndex: 61, boxSizing: 'border-box', borderRadius: 4, background: '#fff', border: '2px solid #1D4ED8',
  boxShadow: '0 1px 3px rgba(0,0,0,.3)', touchAction: 'none',
};
const moveBtn: CSSProperties = {
  position: 'fixed', zIndex: 61, display: 'inline-flex', alignItems: 'center', gap: 5, height: 24, padding: '0 9px', borderRadius: 6,
  background: '#1D4ED8', color: '#fff', fontFamily: 'var(--font-brand)', fontSize: 12, fontWeight: 600, cursor: 'move', touchAction: 'none',
  userSelect: 'none',
};
