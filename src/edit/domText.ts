import type { SlideEdits, TextOverride } from './editsStore';

/**
 * Aplicação das edições no DOM renderizado pelo React.
 *
 * Cada elemento que contém texto direto vira uma “unidade editável”, identificada por:
 *   caminho (índices dos filhos a partir da raiz do slide) + texto original.
 * Incluir o texto original evita aplicar a edição no lugar errado quando o slide
 * troca de conteúdo por passo (ex.: caixas de destaque dos tablets).
 *
 * Só alteramos `nodeValue` dos nós de texto existentes e propriedades de `style`;
 * o React continua dono da estrutura, então nada quebra em re-renderizações.
 */
const originalText = new WeakMap<Text, string>();
const originalStyle = new WeakMap<HTMLElement, { color: string; fontSize: string; fontWeight: string }>();
const touched = new WeakMap<Element, Set<HTMLElement>>();

const EXCLUDE = '[data-print-slot], [data-no-edit], svg, [data-editor-ui]';

export function directTextNodes(el: Element): Text[] {
  return Array.from(el.childNodes).filter((n): n is Text => n.nodeType === Node.TEXT_NODE && !!n.nodeValue?.trim());
}

/** O elemento é uma unidade de texto editável? */
export function isEditable(el: Element, root: Element): el is HTMLElement {
  return el instanceof HTMLElement && root.contains(el) && !el.closest(EXCLUDE) && directTextNodes(el).length > 0;
}

/** Sobe a partir do alvo do mouse até achar uma unidade editável. */
export function findEditable(target: Element | null): { el: HTMLElement; root: HTMLElement } | null {
  const root = target?.closest<HTMLElement>('[data-slide-root]');
  if (!target || !root) return null;
  let el: Element | null = target;
  while (el && el !== root) {
    if (isEditable(el, root)) return { el, root };
    el = el.parentElement;
  }
  return null;
}

function path(el: Element, root: Element) {
  const parts: number[] = [];
  let cur: Element | null = el;
  while (cur && cur !== root) {
    const parent: Element | null = cur.parentElement;
    if (!parent) break;
    parts.unshift(Array.prototype.indexOf.call(parent.children, cur));
    cur = parent;
  }
  return parts.join('.');
}

export const originalsOf = (el: Element) => directTextNodes(el).map((n) => originalText.get(n) ?? n.nodeValue ?? '');

/** Chave estável da unidade de texto. */
export const keyOf = (el: Element, root: Element) => `${path(el, root)}::${originalsOf(el).join('␟')}`;

function remember(el: HTMLElement) {
  if (!originalStyle.has(el)) {
    originalStyle.set(el, { color: el.style.color, fontSize: el.style.fontSize, fontWeight: el.style.fontWeight });
  }
  directTextNodes(el).forEach((n) => { if (!originalText.has(n)) originalText.set(n, n.nodeValue ?? ''); });
}

function restore(el: HTMLElement) {
  const st = originalStyle.get(el);
  if (st) Object.assign(el.style, st);
  directTextNodes(el).forEach((n) => {
    const o = originalText.get(n);
    if (o !== undefined && n.nodeValue !== o) n.nodeValue = o;
  });
}

function apply(el: HTMLElement, o: TextOverride) {
  remember(el);
  const st = originalStyle.get(el)!;
  const nodes = directTextNodes(el);
  nodes.forEach((n, i) => {
    const want = o.texts?.[i] ?? originalText.get(n) ?? '';
    if (n.nodeValue !== want) n.nodeValue = want;
  });
  const color = o.color ?? st.color;
  const fontSize = o.fontSize ? `${o.fontSize}px` : st.fontSize;
  const fontWeight = o.fontWeight ? String(o.fontWeight) : st.fontWeight;
  if (el.style.color !== color) el.style.color = color;
  if (el.style.fontSize !== fontSize) el.style.fontSize = fontSize;
  if (el.style.fontWeight !== fontWeight) el.style.fontWeight = fontWeight;
}

/** Aplica (e desfaz, quando removidas) as edições de um slide. */
export function applySlideEdits(root: HTMLElement, slideEdits: SlideEdits | undefined) {
  const set = touched.get(root) ?? new Set<HTMLElement>();
  touched.set(root, set);
  const active = new Set<HTMLElement>();
  if (slideEdits && Object.keys(slideEdits).length) {
    root.querySelectorAll<HTMLElement>('*').forEach((el) => {
      if (!isEditable(el, root)) return;
      const o = slideEdits[keyOf(el, root)];
      if (o) { apply(el, o); active.add(el); set.add(el); }
    });
  }
  set.forEach((el) => {
    if (!active.has(el)) { restore(el); set.delete(el); }
  });
}
