import { useCallback, useEffect, useRef, useState, type CSSProperties } from 'react';
import { CardFrame, MovePill, startDrag, type CardTarget } from './CardFrame';
import { Guides } from './snap';
import { boxKeyOf, directTextNodes, findCard, findEditable, keyOf, originalsOf, remember } from './domText';
import { EditToolbar } from './EditToolbar';
import { edits, useEditsDoc, type Mark, type NewCard, type Override, type TextOverride } from './editsStore';
import { shiftMarks, subtractMarks } from './highlights';
import { notify } from './notify';

/**
 * Editor do modo edição:
 *  - clicar num texto edita direto no slide (sem caixa); a barra flutuante cuida de tamanho, peso, cor e fundo;
 *  - selecionar palavras + “fundo” pinta só o trecho;
 *  - clicar num card mostra alças para mudar o tamanho; cards novos também se movem;
 *  - Enter/✓ confirma e salva · Esc/✕ cancela as alterações do item · Ctrl+Z / Ctrl+Y desfazem/refazem.
 */
type Kind = 'text' | 'cardText' | 'box' | 'card';
interface Sel {
  kind: Kind;
  /** texto em edição (text/cardText) ou o card (box/card) */
  el: HTMLElement;
  root: HTMLElement;
  slideId: string;
  /** chave do override (text/box) ou id do card novo (cardText/card) */
  key: string;
  /** estado do item ao selecionar (para “Cancelar”) */
  start: string;
  /** texto: chave e estado inicial da posição (`box::caminho`) do próprio texto */
  boxKey?: string;
  boxStart?: string;
  nodes: Text[];
  snapshot: ChildNode[];
  locked: HTMLElement[];
}
type Part = { i: number; start: number; end: number };

const isInline = (k: Kind) => k === 'text' || k === 'cardText';
const textNodesOf = (el: Element) => Array.from(el.childNodes).filter((n): n is Text => n.nodeType === Node.TEXT_NODE);

function itemOf(s: Sel): Override | NewCard | undefined {
  return s.kind === 'text' || s.kind === 'box' ? edits.get().textos[s.slideId]?.[s.key] : edits.card(s.slideId, s.key);
}

function makeSel(kind: Kind, el: HTMLElement, root: HTMLElement): Sel {
  if (kind === 'text') remember(el);
  const key = kind === 'text' ? keyOf(el, root) : kind === 'box' ? boxKeyOf(el, root) : (kind === 'card' ? el.dataset.newCard : el.dataset.cardText)!;
  const s: Sel = {
    kind, el, root, key, slideId: root.dataset.slideId!, start: '',
    nodes: kind === 'text' ? directTextNodes(el) : [],
    snapshot: kind === 'text' ? Array.from(el.childNodes) : [],
    locked: [],
  };
  s.start = JSON.stringify(itemOf(s) ?? null);
  if (kind === 'text') {
    s.boxKey = boxKeyOf(el, root);
    s.boxStart = JSON.stringify(edits.get().textos[s.slideId]?.[s.boxKey] ?? null);
  }
  return s;
}

/** O que o “Mover” desloca: o próprio texto/card selecionado. */
function moveTargetOf(s: Sel): CardTarget {
  if (s.kind === 'cardText') return { el: s.el.closest<HTMLElement>('[data-new-card]')!, root: s.root, kind: 'card', slideId: s.slideId, key: s.key };
  if (s.kind === 'card') return { el: s.el, root: s.root, kind: 'card', slideId: s.slideId, key: s.key };
  return { el: s.el, root: s.root, kind: 'box', slideId: s.slideId, key: s.kind === 'text' ? s.boxKey! : s.key };
}

function caretAt(x: number, y: number): Range | null {
  const d = document as Document & { caretPositionFromPoint?: (x: number, y: number) => { offsetNode: Node; offset: number } | null };
  const p = d.caretPositionFromPoint?.(x, y);
  if (p) {
    const r = document.createRange();
    r.setStart(p.offsetNode, p.offset);
    return r;
  }
  return document.caretRangeFromPoint?.(x, y) ?? null;
}

function placeCaret(el: HTMLElement, where: { x: number; y: number } | 'all' | 'end') {
  const s = window.getSelection();
  if (!s) return;
  let r: Range | null = null;
  if (typeof where === 'object') {
    r = caretAt(where.x, where.y);
    if (r && !el.contains(r.startContainer)) r = null;
  }
  if (!r) {
    r = document.createRange();
    r.selectNodeContents(el);
    if (where !== 'all') r.collapse(false);
  }
  s.removeAllRanges();
  s.addRange(r);
}

/** Liga a edição direta no elemento. Filhos com elementos (ex.: trecho verde do título) ficam protegidos. */
function beginInline(s: Sel, caret: { x: number; y: number } | 'all' | 'end') {
  const el = s.el;
  el.setAttribute('contenteditable', 'plaintext-only');
  if (el.contentEditable !== 'plaintext-only') el.setAttribute('contenteditable', 'true');
  el.spellcheck = false;
  s.locked = Array.from(el.children).filter((c): c is HTMLElement => c instanceof HTMLElement);
  s.locked.forEach((c) => c.setAttribute('contenteditable', 'false'));
  el.focus({ preventScroll: true });
  placeCaret(el, caret);
}

function endInline(s: Sel) {
  if (!isInline(s.kind)) return;
  s.el.removeAttribute('contenteditable');
  s.locked.forEach((c) => c.removeAttribute('contenteditable'));
  if (document.activeElement === s.el) s.el.blur();
}

/**
 * O navegador pode apagar ou criar nós durante a digitação. Devolve ao elemento exatamente os nós
 * que o React conhece (na ordem) e junta texto “solto” ao nó vizinho. Retorna o nó que recebeu texto.
 */
function normalize(el: HTMLElement, snapshot: ChildNode[], nodes: Text[]): Text | null {
  const known = new Set<Node>(snapshot);
  const editable = new Set<Node>(nodes);
  for (let i = snapshot.length - 1; i >= 0; i--) {
    const n = snapshot[i];
    if (n.parentNode === el) continue;
    if (n.nodeType === Node.TEXT_NODE) n.nodeValue = '';
    el.insertBefore(n, snapshot.slice(i + 1).find((m) => m.parentNode === el) ?? null);
  }
  let last: Text | null = null;
  let lead = '';
  let changed: Text | null = null;
  for (const n of Array.from(el.childNodes)) {
    if (known.has(n)) {
      if (editable.has(n)) {
        last = n as Text;
        if (lead) { last.nodeValue = lead + (last.nodeValue ?? ''); lead = ''; changed = last; }
      }
      continue;
    }
    const s = n.textContent ?? '';
    n.remove();
    if (!s) continue;
    if (last) { last.nodeValue = (last.nodeValue ?? '') + s; changed = last; } else lead += s;
  }
  return changed;
}

/** Trecho selecionado dentro dos nós de texto (por nó). */
function partsOf(range: Range, nodes: Text[]): Part[] {
  return nodes.flatMap((n, i) => {
    if (!range.intersectsNode(n)) return [];
    const start = range.startContainer === n ? range.startOffset : 0;
    const end = range.endContainer === n ? range.endOffset : n.length;
    return end > start ? [{ i, start, end }] : [];
  });
}

const rgbToHex = (rgb: string) => {
  const m = rgb.match(/\d+/g);
  if (!m) return '#000000';
  return `#${m.slice(0, 3).map((x) => Number(x).toString(16).padStart(2, '0')).join('')}`;
};

export function TextEditor() {
  useEditsDoc(); // re-renderiza (alças, barra) quando as edições mudam
  const [sel, setSel] = useState<Sel | null>(null);
  const selRef = useRef<Sel | null>(null);
  const [hover, setHover] = useState<{ el: HTMLElement; tone: 'text' | 'card' } | null>(null);
  const [, force] = useState(0);
  const parts = useRef<Part[]>([]);
  const [hasParts, setHasParts] = useState(false);

  const select = useCallback((next: Sel | null, caret: { x: number; y: number } | 'all' | 'end' = 'end') => {
    const prev = selRef.current;
    if (prev && prev.el !== next?.el) endInline(prev);
    selRef.current = next;
    parts.current = [];
    setHasParts(false);
    edits.breakHistory();
    if (next && isInline(next.kind) && prev?.el !== next.el) beginInline(next, caret);
    setSel(next);
  }, []);

  // ---- ações -------------------------------------------------------------------

  const curText = (s: Sel): TextOverride | undefined =>
    s.kind === 'text' ? edits.get().textos[s.slideId]?.[s.key] : edits.card(s.slideId, s.key)?.t;

  const styleText = useCallback((patch: Partial<TextOverride>, label: string) => {
    const s = selRef.current;
    if (!s) return;
    const opts = { label, tag: `${label}:${s.key}` };
    if (s.kind === 'text') edits.set(s.slideId, s.key, patch, opts);
    else if (s.kind === 'cardText') edits.updateCard(s.slideId, s.key, { t: patch }, opts);
  }, []);

  const applyBg = useCallback((color: string | null) => {
    const s = selRef.current;
    if (!s || !isInline(s.kind)) return;
    const o = curText(s);
    const nodes = s.kind === 'text' ? s.nodes : textNodesOf(s.el);
    let background = o?.background;
    let marks: Mark[] = [...(o?.marks ?? [])];
    if (parts.current.length) {
      if (background) { // fundo do texto todo vira marcas, para poder recortar só o trecho
        nodes.forEach((n, i) => marks.push({ i, start: 0, end: n.length, color: background! }));
        background = undefined;
      }
      parts.current.forEach((p) => {
        marks = subtractMarks(marks, p.i, p.start, p.end);
        if (color) marks.push({ ...p, color });
      });
    } else {
      background = color ?? undefined;
      marks = [];
    }
    styleText({ background, marks: marks.length ? marks : undefined }, 'fundo');
  }, [styleText]);

  const fillCard = useCallback((fill: string) => {
    const s = selRef.current;
    if (s && (s.kind === 'card' || s.kind === 'cardText')) edits.updateCard(s.slideId, s.key, { fill }, { label: 'fundo do card' });
  }, []);

  const restore = useCallback(() => {
    const s = selRef.current;
    if (!s) return;
    if (s.kind === 'text') edits.reset(s.slideId, s.key, s.boxKey!);
    else if (s.kind === 'box') edits.reset(s.slideId, s.key);
    else if (s.kind === 'cardText') {
      edits.updateCard(s.slideId, s.key, { t: { fontSize: 36, fontWeight: 600, color: undefined, background: undefined, marks: undefined } }, { label: 'restaurar estilo' });
    } else edits.updateCard(s.slideId, s.key, { w: 440, h: 190 }, { label: 'restaurar tamanho' });
  }, []);

  const cancel = useCallback(() => {
    const s = selRef.current;
    if (!s) return;
    const boxNow = s.boxKey ? JSON.stringify(edits.get().textos[s.slideId]?.[s.boxKey] ?? null) : undefined;
    if (JSON.stringify(itemOf(s) ?? null) !== s.start || boxNow !== s.boxStart) {
      const start = JSON.parse(s.start) as Override | NewCard | null;
      if (s.kind === 'text' || s.kind === 'box') {
        const entries: [string, Override | undefined][] = [[s.key, (start as Override | null) ?? undefined]];
        if (s.boxKey) entries.push([s.boxKey, (JSON.parse(s.boxStart!) as Override | null) ?? undefined]);
        edits.putMany(s.slideId, entries, { label: 'cancelar' });
      } else if (start) edits.putCard(s.slideId, start as NewCard, { label: 'cancelar' });
      notify('Alterações do item canceladas · Ctrl+Z traz de volta');
    }
    select(null);
  }, [select]);

  const confirm = useCallback(() => {
    select(null);
    void edits.flush().then(() => notify(edits.meta().status === 'erro' ? 'Não foi possível salvar neste navegador' : '✓ Alteração confirmada e salva'));
  }, [select]);

  const removeCard = useCallback(() => {
    const s = selRef.current;
    if (!s || (s.kind !== 'card' && s.kind !== 'cardText')) return;
    select(null);
    edits.removeCard(s.slideId, s.key);
    notify('Card excluído · Ctrl+Z desfaz');
  }, [select]);

  // ---- digitação no próprio slide -------------------------------------------------

  useEffect(() => {
    if (!sel || !isInline(sel.kind)) return;
    const el = sel.el;

    const onInput = () => {
      if (sel.kind === 'text') {
        const changed = normalize(el, sel.snapshot, sel.nodes);
        const cur = curText(sel);
        const originals = originalsOf(el);
        const texts = sel.nodes.map((n) => n.nodeValue ?? '');
        let marks = cur?.marks ?? [];
        texts.forEach((t, i) => { marks = shiftMarks(marks, i, cur?.texts?.[i] ?? originals[i], t); });
        edits.set(sel.slideId, sel.key, {
          texts: texts.every((t, i) => t === originals[i]) ? undefined : texts,
          marks: marks.length ? marks : undefined,
        }, { label: 'texto', tag: `texto:${sel.key}` });
        if (changed) {
          const r = document.createRange();
          r.setStart(changed, changed.length);
          window.getSelection()?.removeAllRanges();
          window.getSelection()?.addRange(r);
        }
      } else {
        el.querySelectorAll('br, div, p').forEach((b) => b.replaceWith(document.createTextNode(b.textContent ?? '')));
        el.normalize();
        const text = el.textContent ?? '';
        const card = edits.card(sel.slideId, sel.key);
        if (!card) return;
        const marks = shiftMarks(card.t.marks ?? [], 0, card.t.texts?.[0] ?? '', text);
        edits.updateCard(sel.slideId, sel.key, { t: { texts: [text], marks: marks.length ? marks : undefined } }, { label: 'texto', tag: `texto:${sel.key}` });
      }
    };
    const onBefore = (e: InputEvent) => {
      if (e.inputType === 'insertParagraph' || e.inputType === 'insertLineBreak' || e.inputType.startsWith('format') || e.inputType === 'insertFromDrop') e.preventDefault();
      if (e.inputType === 'historyUndo' || e.inputType === 'historyRedo') { // desfazer pelo menu do navegador
        e.preventDefault();
        const redo = e.inputType === 'historyRedo';
        const label = redo ? edits.redo() : edits.undo();
        notify(label ? `${redo ? 'Refeito' : 'Desfeito'}: ${label}` : 'Nada para desfazer');
      }
    };
    const onPaste = (e: ClipboardEvent) => {
      e.preventDefault();
      const t = (e.clipboardData?.getData('text/plain') ?? '').replace(/\s*\n\s*/g, ' ');
      document.execCommand('insertText', false, t);
    };
    const onSelChange = () => {
      const s = window.getSelection();
      if (!s?.rangeCount) return;
      const r = s.getRangeAt(0);
      if (!el.contains(r.commonAncestorContainer)) return; // clique na barra: mantém o último trecho
      parts.current = r.collapsed ? [] : partsOf(r, sel.kind === 'text' ? sel.nodes : textNodesOf(el));
      setHasParts(parts.current.length > 0);
    };

    el.addEventListener('input', onInput);
    el.addEventListener('beforeinput', onBefore);
    el.addEventListener('paste', onPaste);
    document.addEventListener('selectionchange', onSelChange);
    return () => {
      el.removeEventListener('input', onInput);
      el.removeEventListener('beforeinput', onBefore);
      el.removeEventListener('paste', onPaste);
      document.removeEventListener('selectionchange', onSelChange);
    };
  }, [sel]);

  // ---- mouse e teclado ----------------------------------------------------------

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const t = e.target as Element;
      if (t.closest('[data-editor-ui]')) return;
      const text = t.closest<HTMLElement>('[data-card-text]') ?? findEditable(t)?.el;
      if (text) { setHover((h) => (h?.el === text ? h : { el: text, tone: 'text' })); return; }
      const card = t.closest<HTMLElement>('[data-new-card]') ?? (t.closest('[data-print-slot], [data-no-edit]') ? null : findCard(t)?.el);
      setHover((h) => (card ? (h?.el === card ? h : { el: card, tone: 'card' }) : null));
    };

    // clique seleciona (fase de captura: impede navegação e ações do slide)
    const onClick = (e: MouseEvent) => {
      const t = e.target as Element;
      if (t.closest('[data-editor-ui]')) return;
      const root = t.closest<HTMLElement>('[data-slide-root]');
      if (!root) return;
      const cur = selRef.current;

      const cardText = t.closest<HTMLElement>('[data-card-text]');
      const text = cardText ? { el: cardText, kind: 'cardText' as const } : (() => { const h = findEditable(t); return h && { el: h.el, kind: 'text' as const }; })();
      if (text) {
        e.stopPropagation();
        if (cur?.el === text.el) return; // já em edição: o clique só posiciona o cursor
        e.preventDefault();
        select(makeSel(text.kind, text.el, root), { x: e.clientX, y: e.clientY });
        return;
      }
      if (t.closest('[data-print-slot], [data-no-edit]')) { select(null); return; } // prints e logo têm edição própria

      const newCard = t.closest<HTMLElement>('[data-new-card]');
      const card = newCard ? { el: newCard, kind: 'card' as const } : (() => { const h = findCard(t); return h && { el: h.el, kind: 'box' as const }; })();
      if (card) {
        e.preventDefault();
        e.stopPropagation();
        if (cur?.el !== card.el) select(makeSel(card.kind, card.el, root));
        return;
      }
      select(null);
    };

    // arrastar um card pela área fora do texto move o card (novo ou original)
    const onDown = (e: PointerEvent) => {
      if (e.button !== 0) return;
      const t = e.target as Element;
      const root = t.closest<HTMLElement>('[data-slide-root]');
      if (!root || t.closest('[data-editor-ui], [data-card-text], [data-print-slot], [data-no-edit]') || findEditable(t)) return;
      const newCard = t.closest<HTMLElement>('[data-new-card]');
      const card = newCard ? { el: newCard, kind: 'card' as const } : (() => { const h = findCard(t); return h && { el: h.el, kind: 'box' as const }; })();
      if (!card) return;
      e.preventDefault();
      const s = selRef.current?.el === card.el ? selRef.current : makeSel(card.kind, card.el, root);
      if (s !== selRef.current) select(s);
      startDrag(e, moveTargetOf(s), 'move');
    };

    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      const field = !!t.closest?.('input, textarea, select');
      const mod = e.ctrlKey || e.metaKey;
      const k = e.key.toLowerCase();
      if (mod && !field && (k === 'z' || k === 'y')) {
        e.preventDefault();
        e.stopPropagation();
        const redo = k === 'y' || e.shiftKey;
        const label = redo ? edits.redo() : edits.undo();
        notify(label ? `${redo ? 'Refeito' : 'Desfeito'}: ${label}` : redo ? 'Nada para refazer' : 'Nada para desfazer');
        return;
      }
      const cur = selRef.current;
      if (!cur || field || mod) return;
      if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); cancel(); }
      else if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); e.stopPropagation(); confirm(); }
      else if ((e.key === 'Delete' || e.key === 'Backspace') && cur.kind === 'card') { e.preventDefault(); e.stopPropagation(); removeCard(); }
      else if (e.key.startsWith('Arrow') && !isInline(cur.kind)) { // card selecionado: setas movem (Shift = 10 px)
        e.preventDefault();
        e.stopPropagation();
        const step = e.shiftKey ? 10 : 1;
        const dx = e.key === 'ArrowLeft' ? -step : e.key === 'ArrowRight' ? step : 0;
        const dy = e.key === 'ArrowUp' ? -step : e.key === 'ArrowDown' ? step : 0;
        const opts = { label: 'mover', tag: `setas:${cur.key}` };
        if (cur.kind === 'card') {
          const c = edits.card(cur.slideId, cur.key);
          if (c) edits.updateCard(cur.slideId, cur.key, { x: c.x + dx, y: c.y + dy }, opts);
        } else {
          const o = edits.get().textos[cur.slideId]?.[cur.key];
          edits.set(cur.slideId, cur.key, { dx: (o?.dx ?? 0) + dx || undefined, dy: (o?.dy ?? 0) + dy || undefined }, opts);
        }
      }
    };

    // card criado pela faixa do topo: já entra em edição com o texto selecionado
    const onNewCard = (e: Event) => {
      const { slideId, id } = (e as CustomEvent<{ slideId: string; id: string }>).detail;
      requestAnimationFrame(() => {
        const el = document.querySelector<HTMLElement>(`[data-slide-root][data-slide-id="${slideId}"] [data-card-text="${id}"]`);
        const root = el?.closest<HTMLElement>('[data-slide-root]');
        if (el && root) select(makeSel('cardText', el, root), 'all');
      });
    };

    document.addEventListener('mousemove', onMove);
    document.addEventListener('click', onClick, true);
    document.addEventListener('pointerdown', onDown, true);
    window.addEventListener('keydown', onKey, true);
    window.addEventListener('editor:novo-card', onNewCard);
    return () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('click', onClick, true);
      document.removeEventListener('pointerdown', onDown, true);
      window.removeEventListener('keydown', onKey, true);
      window.removeEventListener('editor:novo-card', onNewCard);
    };
  }, [select, cancel, confirm, removeCard]);

  // seleção perdida quando o elemento sai da tela (troca de slide, desfazer um card novo…)
  useEffect(() => {
    if (!sel) return;
    const id = window.setInterval(() => {
      if (!sel.el.isConnected) select(null);
      else force((n) => n + 1); // reposiciona contornos durante animações
    }, 200);
    return () => window.clearInterval(id);
  }, [sel, select]);

  // ao sair do modo edição
  useEffect(() => () => { if (selRef.current) endInline(selRef.current); }, []);

  // ---- desenho ---------------------------------------------------------------------

  const cardTarget: CardTarget | null = (() => {
    if (!sel || !sel.el.isConnected) return null;
    if (sel.kind !== 'text') return moveTargetOf(sel);
    const c = findCard(sel.el); // texto dentro de um card: as alças são do card
    return c ? { el: c.el, root: sel.root, kind: 'box', slideId: sel.slideId, key: boxKeyOf(c.el, sel.root) } : null;
  })();
  const moveTarget = sel && sel.el.isConnected ? moveTargetOf(sel) : null;

  const cs = sel && isInline(sel.kind) ? getComputedStyle(sel.el) : null;
  const t = sel && isInline(sel.kind) ? curText(sel) : undefined;
  const card = sel && (sel.kind === 'card' || sel.kind === 'cardText') ? edits.card(sel.slideId, sel.key) : undefined;

  const outline = (el: HTMLElement, style: CSSProperties) => {
    const r = el.getBoundingClientRect();
    return <div data-editor-ui style={{ position: 'fixed', left: r.left - 4, top: r.top - 3, width: r.width + 8, height: r.height + 6, pointerEvents: 'none', zIndex: 60, borderRadius: 6, ...style }} />;
  };

  return (
    <>
      {hover && hover.el !== sel?.el && hover.el !== cardTarget?.el && hover.el.isConnected && outline(hover.el, hover.tone === 'text'
        ? { outline: '2px dashed rgba(18,134,79,0.9)', background: 'rgba(18,134,79,0.05)' }
        : { outline: '1.5px dashed rgba(29,78,216,0.6)', borderRadius: 10 })}
      {cardTarget && <CardFrame target={cardTarget} strong={sel?.kind === 'box' || sel?.kind === 'card'} />}
      {moveTarget?.el && <MovePill target={moveTarget} />}
      <Guides />
      {sel && isInline(sel.kind) && sel.el.isConnected && outline(sel.el, { outline: '2px solid #12864F', background: 'rgba(18,134,79,0.06)' })}

      {sel && sel.el.isConnected && (
        <EditToolbar
          kind={sel.kind}
          anchor={sel.el}
          size={t?.fontSize ?? (cs ? Math.round(parseFloat(cs.fontSize)) : 30)}
          weight={t?.fontWeight ?? (cs ? Number(cs.fontWeight) : 400)}
          color={t?.color ?? (cs ? rgbToHex(cs.color) : '#000000')}
          bgScope={hasParts ? 'trecho' : 'texto'}
          fill={card?.fill}
          dims={sel.kind === 'box' ? { w: sel.el.offsetWidth, h: sel.el.offsetHeight } : undefined}
          onStyle={styleText}
          onBg={applyBg}
          onFill={fillCard}
          onRestore={restore}
          onCancel={cancel}
          onConfirm={confirm}
          onDelete={removeCard}
        />
      )}
    </>
  );
}
