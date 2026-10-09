import type { Mark, TextOverride } from './editsStore';

/**
 * Fundo colorido (marca-texto) em palavras, sem alterar o DOM do React:
 * usa a CSS Custom Highlight API (`::highlight()`), que pinta intervalos de texto.
 * Cada elemento registra seus trechos; um único registro global é refeito por quadro.
 */
interface Item { node: Text; start: number; end: number; color: string }

const regs = new Map<Element, Item[]>();
const rules = new Set<string>();
let names: string[] = [];
let raf = 0;
let sheet: HTMLStyleElement | null = null;

const supported = () => typeof CSS !== 'undefined' && 'highlights' in CSS && typeof Highlight !== 'undefined';
const safeColor = (c: string) => (/^#[0-9a-f]{3,8}$/i.test(c) ? c.toLowerCase() : null);

function ensureRule(name: string, color: string) {
  if (rules.has(name)) return;
  sheet ??= document.head.appendChild(document.createElement('style'));
  sheet.append(`::highlight(${name}) { background-color: ${color}; }\n`);
  rules.add(name);
}

function sync() {
  raf = 0;
  if (!supported()) return;
  const byColor = new Map<string, Range[]>();
  regs.forEach((items, el) => {
    if (!el.isConnected) { regs.delete(el); return; }
    items.forEach(({ node, start, end, color }) => {
      if (!node.isConnected) return;
      const s = Math.min(Math.max(start, 0), node.length);
      const e = Math.min(Math.max(end, 0), node.length);
      if (e <= s) return;
      const r = new Range();
      r.setStart(node, s);
      r.setEnd(node, e);
      const list = byColor.get(color) ?? [];
      list.push(r);
      byColor.set(color, list);
    });
  });
  names.forEach((n) => CSS.highlights.delete(n));
  names = [];
  byColor.forEach((ranges, color) => {
    const name = `ed-bg-${color.slice(1)}`;
    ensureRule(name, color);
    CSS.highlights.set(name, new Highlight(...ranges));
    names.push(name);
  });
}

/** Registra (ou limpa, com lista vazia) os trechos destacados de um elemento. */
export function setHighlights(el: Element, items: Item[]) {
  if (items.length) regs.set(el, items);
  else if (!regs.delete(el)) return;
  if (!raf) raf = requestAnimationFrame(sync);
}

/** Converte fundo inteiro + trechos de um override em intervalos sobre os nós de texto. */
export function highlightItems(nodes: Text[], o: TextOverride | undefined): Item[] {
  if (!o) return [];
  const out: Item[] = [];
  const bg = o.background && safeColor(o.background);
  if (bg) nodes.forEach((node) => out.push({ node, start: 0, end: node.length, color: bg }));
  o.marks?.forEach((m) => {
    const c = safeColor(m.color);
    if (c && nodes[m.i]) out.push({ node: nodes[m.i], start: m.start, end: m.end, color: c });
  });
  return out;
}

// ---- edição dos trechos -------------------------------------------------------

/** Remove o intervalo [s, e) do nó `i` de todas as marcas (divide as que cruzam). */
export function subtractMarks(marks: Mark[], i: number, s: number, e: number): Mark[] {
  return marks.flatMap((m) => {
    if (m.i !== i || m.end <= s || m.start >= e) return [m];
    const parts: Mark[] = [];
    if (m.start < s) parts.push({ ...m, end: s });
    if (m.end > e) parts.push({ ...m, start: e });
    return parts;
  });
}

/** Ajusta as marcas do nó `i` depois que o texto mudou de `before` para `after`. */
export function shiftMarks(marks: Mark[], i: number, before: string, after: string): Mark[] {
  if (before === after) return marks;
  let p = 0;
  while (p < before.length && p < after.length && before[p] === after[p]) p++;
  let s = 0;
  while (s < before.length - p && s < after.length - p && before[before.length - 1 - s] === after[after.length - 1 - s]) s++;
  const oldEnd = before.length - s; // fim do trecho trocado no texto antigo
  const delta = after.length - before.length;
  const move = (x: number, isEnd: boolean) => {
    // inserção pura: texto digitado colado a uma marca não herda o fundo
    if (p === oldEnd) return x < p || (x === p && isEnd) ? x : x + delta;
    if (x <= p) return x;
    if (x >= oldEnd) return x + delta;
    return isEnd ? after.length - s : p; // dentro do trecho trocado
  };
  return marks
    .map((m) => (m.i !== i ? m : { ...m, start: move(m.start, false), end: move(m.end, true) }))
    .filter((m) => m.end > m.start);
}
