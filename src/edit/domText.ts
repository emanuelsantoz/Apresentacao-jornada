import type { Override, SlideEdits } from './editsStore';
import { highlightItems, setHighlights } from './highlights';

/**
 * Aplicação das edições no DOM renderizado pelo React.
 *
 * Cada elemento que contém texto direto vira uma “unidade editável”, identificada por:
 *   caminho (índices dos filhos a partir da raiz do slide) + texto original.
 * Incluir o texto original evita aplicar a edição no lugar errado quando o slide
 * troca de conteúdo por passo (ex.: caixas de destaque dos tablets).
 * Cards existentes (caixas com fundo/borda/sombra) podem ter o tamanho alterado e qualquer texto ou card
 * pode ser movido (deslocamento dx/dy): chave `box::caminho`.
 *
 * Só alteramos `nodeValue` dos nós de texto existentes e propriedades de `style`;
 * o React continua dono da estrutura, então nada quebra em re-renderizações.
 */
const originalText = new WeakMap<Text, string>();
const STYLE_PROPS = ['color', 'fontSize', 'fontWeight', 'width', 'height', 'flex', 'maxWidth', 'minHeight', 'translate'] as const;
type StyleProp = (typeof STYLE_PROPS)[number];
const originalStyle = new WeakMap<HTMLElement, Record<StyleProp, string>>();
const touched = new WeakMap<Element, Set<HTMLElement>>();

export const EXCLUDE = '[data-print-slot], [data-no-edit], svg, [data-editor-ui], [data-new-cards]';
export const BOX_PREFIX = 'box::';

/** Nós de texto diretos. Um texto apagado pela edição continua contando (mantém a ordem e a chave). */
export function directTextNodes(el: Element): Text[] {
  return Array.from(el.childNodes).filter(
    (n): n is Text => n.nodeType === Node.TEXT_NODE && (originalText.has(n as Text) || !!n.nodeValue?.trim()),
  );
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

const visible = (c: string) => c !== 'transparent' && !/rgba\([^)]*,\s*0\)$/.test(c);

/** Parece um card? (fundo, borda ou sombra + cantos/sombra, tamanho razoável, sem mockup dentro) */
export function isCardLike(el: Element, root: HTMLElement): el is HTMLElement {
  if (!(el instanceof HTMLElement) || el === root || el.closest(EXCLUDE) || el.hasAttribute('data-slide-frame')) return false;
  const w = el.offsetWidth;
  const h = el.offsetHeight;
  if (w < 100 || h < 50 || w * h > 1920 * 1080 * 0.45) return false;
  if (el.querySelector('[data-print-slot]')) return false;
  const cs = getComputedStyle(el);
  const shadow = cs.boxShadow !== 'none';
  const border = parseFloat(cs.borderTopWidth) > 0 && cs.borderTopStyle !== 'none';
  const round = parseFloat(cs.borderTopLeftRadius) > 0 || parseFloat(cs.borderBottomRightRadius) > 0;
  return (visible(cs.backgroundColor) || shadow || border) && (round || shadow);
}

/** Card existente mais próximo que contém o alvo. */
export function findCard(target: Element | null): { el: HTMLElement; root: HTMLElement } | null {
  const root = target?.closest<HTMLElement>('[data-slide-root]');
  if (!target || !root) return null;
  let el: Element | null = target;
  while (el && el !== root) {
    if (isCardLike(el, root)) return { el, root };
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

function atPath(root: Element, p: string): HTMLElement | null {
  let cur: Element | undefined = root;
  for (const i of p.split('.')) {
    cur = cur?.children[Number(i)];
    if (!cur) return null;
  }
  return cur instanceof HTMLElement ? cur : null;
}

export const originalsOf = (el: Element) => directTextNodes(el).map((n) => originalText.get(n) ?? n.nodeValue ?? '');

/** Chave estável da unidade de texto. */
export const keyOf = (el: Element, root: Element) => `${path(el, root)}::${originalsOf(el).join('␟')}`;
export const boxKeyOf = (el: Element, root: Element) => `${BOX_PREFIX}${path(el, root)}`;

/** Guarda texto e estilo originais (antes da primeira edição). */
export function remember(el: HTMLElement) {
  if (!originalStyle.has(el)) {
    originalStyle.set(el, Object.fromEntries(STYLE_PROPS.map((p) => [p, el.style[p]])) as Record<StyleProp, string>);
  }
  directTextNodes(el).forEach((n) => { if (!originalText.has(n)) originalText.set(n, n.nodeValue ?? ''); });
}

function setStyle(el: HTMLElement, prop: StyleProp, value: string) {
  if (el.style[prop] !== value) el.style[prop] = value;
}

/** Aplica o override de texto (`{}` volta ao original). Só escreve o que mudou: não mexe no cursor durante a digitação. */
function applyText(el: HTMLElement, o: Override) {
  remember(el);
  const st = originalStyle.get(el)!;
  const nodes = directTextNodes(el);
  nodes.forEach((n, i) => {
    const want = o.texts?.[i] ?? originalText.get(n) ?? '';
    if (n.nodeValue !== want) n.nodeValue = want;
  });
  setStyle(el, 'color', o.color ?? st.color);
  setStyle(el, 'fontSize', o.fontSize ? `${o.fontSize}px` : st.fontSize);
  setStyle(el, 'fontWeight', o.fontWeight ? String(o.fontWeight) : st.fontWeight);
  setHighlights(el, highlightItems(nodes, o));
}

function applyBox(el: HTMLElement, o: Override) {
  remember(el);
  const st = originalStyle.get(el)!;
  const sized = o.width !== undefined || o.height !== undefined;
  setStyle(el, 'width', o.width !== undefined ? `${o.width}px` : st.width);
  setStyle(el, 'maxWidth', o.width !== undefined ? 'none' : st.maxWidth);
  setStyle(el, 'height', o.height !== undefined ? `${o.height}px` : st.height);
  setStyle(el, 'minHeight', o.height !== undefined ? '0px' : st.minHeight);
  setStyle(el, 'flex', sized ? '0 0 auto' : st.flex); // em flex, o tamanho fixo vence o encolher/esticar
  // `translate` é independente de `transform`: não briga com as animações (motion) do elemento
  setStyle(el, 'translate', o.dx || o.dy ? `${o.dx ?? 0}px ${o.dy ?? 0}px` : st.translate);
}

/** Aplica (e desfaz, quando removidas) as edições de um slide. */
export function applySlideEdits(root: HTMLElement, slideEdits: SlideEdits | undefined) {
  const set = touched.get(root) ?? new Set<HTMLElement>();
  touched.set(root, set);
  const textO = new Map<HTMLElement, Override>();
  const boxO = new Map<HTMLElement, Override>();
  if (slideEdits && Object.keys(slideEdits).length) {
    root.querySelectorAll<HTMLElement>('*').forEach((el) => {
      if (!isEditable(el, root)) return;
      const o = slideEdits[keyOf(el, root)];
      if (o) textO.set(el, o);
    });
    Object.entries(slideEdits).forEach(([key, o]) => {
      if (!key.startsWith(BOX_PREFIX)) return;
      const el = atPath(root, key.slice(BOX_PREFIX.length));
      if (el && !el.closest(EXCLUDE)) boxO.set(el, o);
    });
  }
  const active = new Set([...textO.keys(), ...boxO.keys()]);
  active.forEach((el) => {
    applyText(el, textO.get(el) ?? {});
    applyBox(el, boxO.get(el) ?? {});
    set.add(el);
  });
  set.forEach((el) => {
    if (active.has(el)) return;
    applyText(el, {});
    applyBox(el, {});
    set.delete(el);
  });
}
