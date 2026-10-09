import { useSyncExternalStore } from 'react';
import { isCardLike, isEditable } from './domText';

/**
 * Guias de alinhamento (estilo Canva) ao mover ou redimensionar:
 * bordas e centros do elemento “grudam” nas bordas/centros dos outros elementos,
 * no centro e nas margens do slide. Uma linha fina mostra o alinhamento.
 * Tudo em pixels da janela; segurar Alt desliga o ímã.
 */

/** Linha candidata: posição `v` no eixo e trecho [a, b] no eixo oposto. */
interface Line { v: number; a: number; b: number }
export interface Refs { xs: Line[]; ys: Line[] }
export interface Guide { axis: 'x' | 'y'; v: number; a: number; b: number }

const SNAP_PX = 6;
const MARGIN = 96; // margem lateral dos layouts no palco 1920

const linesOf = (r: DOMRect, refs: Refs) => {
  refs.xs.push({ v: r.left, a: r.top, b: r.bottom }, { v: r.left + r.width / 2, a: r.top, b: r.bottom }, { v: r.right, a: r.top, b: r.bottom });
  refs.ys.push({ v: r.top, a: r.left, b: r.right }, { v: r.top + r.height / 2, a: r.left, b: r.right }, { v: r.bottom, a: r.left, b: r.right });
};

/** Coleta as linhas de referência do slide (uma vez, no início do arraste). */
export function collectRefs(root: HTMLElement, moving: HTMLElement): Refs {
  const refs: Refs = { xs: [], ys: [] };
  const s = root.getBoundingClientRect();
  linesOf(s, refs);
  const m = (MARGIN / 1920) * s.width;
  refs.xs.push({ v: s.left + m, a: s.top, b: s.bottom }, { v: s.right - m, a: s.top, b: s.bottom });

  root.querySelectorAll<HTMLElement>('*').forEach((el) => {
    if (el === moving || moving.contains(el) || el.contains(moving)) return;
    const ref = el.hasAttribute('data-new-card') || el.hasAttribute('data-card-text') || isEditable(el, root) || isCardLike(el, root);
    if (!ref) return;
    const r = el.getBoundingClientRect();
    if (r.width < 4 || r.height < 4 || getComputedStyle(el).visibility === 'hidden') return;
    linesOf(r, refs);
  });
  return refs;
}

/** Melhor encaixe de algum dos `points` numa linha do eixo. */
function best(points: number[], lines: Line[]) {
  let hit: { adjust: number; v: number } | null = null;
  for (const p of points) {
    for (const l of lines) {
      const d = l.v - p;
      if (Math.abs(d) <= SNAP_PX && (!hit || Math.abs(d) < Math.abs(hit.adjust))) hit = { adjust: d, v: l.v };
    }
  }
  return hit;
}

/** Linha-guia que une o elemento a todas as referências naquela posição. */
function guide(axis: 'x' | 'y', v: number, lines: Line[], a: number, b: number): Guide {
  let lo = a;
  let hi = b;
  lines.forEach((l) => { if (Math.abs(l.v - v) < 0.5) { lo = Math.min(lo, l.a); hi = Math.max(hi, l.b); } });
  return { axis, v, a: lo, b: hi };
}

/**
 * Ajusta o deslocamento (em px da janela) para encaixar.
 * `edges`: quais bordas se movem — mover = todas; redimensionar = só direita e/ou baixo.
 */
export function snap(rect: DOMRect, sx: number, sy: number, refs: Refs, edges: { x: 'all' | 'end' | null; y: 'all' | 'end' | null }) {
  const box = (dx: number, dy: number) => ({
    l: rect.left + (edges.x === 'all' ? dx : 0), r: rect.right + (edges.x ? dx : 0),
    t: rect.top + (edges.y === 'all' ? dy : 0), b: rect.bottom + (edges.y ? dy : 0),
  });
  const p = box(sx, sy);
  const hx = edges.x ? best(edges.x === 'all' ? [p.l, (p.l + p.r) / 2, p.r] : [p.r], refs.xs) : null;
  const hy = edges.y ? best(edges.y === 'all' ? [p.t, (p.t + p.b) / 2, p.b] : [p.b], refs.ys) : null;
  if (hx) sx += hx.adjust;
  if (hy) sy += hy.adjust;
  const f = box(sx, sy);
  const guides: Guide[] = [];
  if (hx) guides.push(guide('x', hx.v, refs.xs, f.t, f.b));
  if (hy) guides.push(guide('y', hy.v, refs.ys, f.l, f.r));
  return { sx, sy, guides };
}

// ---- desenho das guias -----------------------------------------------------------

let current: Guide[] = [];
const listeners = new Set<() => void>();
export function setGuides(g: Guide[]) {
  if (!g.length && !current.length) return;
  current = g;
  listeners.forEach((l) => l());
}
const subscribe = (l: () => void) => { listeners.add(l); return () => { listeners.delete(l); }; };

export function Guides() {
  const g = useSyncExternalStore(subscribe, () => current);
  return (
    <>
      {g.map((x, i) => (
        <div
          key={i}
          data-editor-ui
          style={{
            position: 'fixed', zIndex: 62, pointerEvents: 'none', background: '#EC4899',
            ...(x.axis === 'x' ? { left: x.v - 0.5, top: x.a, width: 1, height: x.b - x.a } : { top: x.v - 0.5, left: x.a, height: 1, width: x.b - x.a }),
          }}
        />
      ))}
    </>
  );
}
