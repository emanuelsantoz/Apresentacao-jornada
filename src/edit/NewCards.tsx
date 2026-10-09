import { useLayoutEffect, useRef } from 'react';
import { useSlideCards, type NewCard } from './editsStore';
import { highlightItems, setHighlights } from './highlights';

/**
 * Cards de texto criados no modo edição. Fica por último na raiz do slide
 * (não desloca as chaves das edições dos textos originais).
 */
export function NewCardsLayer({ slideId }: { slideId: string }) {
  const cards = useSlideCards(slideId);
  if (!cards?.length) return null;
  return (
    <div data-new-cards style={{ position: 'absolute', inset: 0, zIndex: 30, pointerEvents: 'none' }}>
      {cards.map((c) => <NewCardView key={c.id} c={c} />)}
    </div>
  );
}

const isDark = (hex: string) => {
  const m = /^#?([0-9a-f]{6})/i.exec(hex);
  if (!m) return false;
  const n = parseInt(m[1], 16);
  return ((n >> 16) * 299 + ((n >> 8) & 255) * 587 + (n & 255) * 114) / 1000 < 140;
};

function NewCardView({ c }: { c: NewCard }) {
  const text = useRef<HTMLDivElement>(null);
  const content = c.t.texts?.[0] ?? '';

  // O texto é escrito fora do React: assim a digitação direta no card não perde o cursor.
  useLayoutEffect(() => {
    const el = text.current!;
    if (el.textContent !== content) el.textContent = content;
    const nodes = Array.from(el.childNodes).filter((n): n is Text => n.nodeType === Node.TEXT_NODE);
    setHighlights(el, highlightItems(nodes, c.t));
  }, [content, c.t]);
  useLayoutEffect(() => {
    const el = text.current!;
    return () => setHighlights(el, []);
  }, []);

  const transparent = c.fill === 'transparent';
  return (
    <div
      data-new-card={c.id}
      style={{
        position: 'absolute', left: c.x, top: c.y, width: c.w, height: c.h, pointerEvents: 'auto', overflow: 'hidden',
        display: 'flex', alignItems: 'center', padding: '24px 32px', borderRadius: 'var(--radius-md)',
        background: c.fill, boxShadow: transparent ? 'none' : 'var(--shadow-card)',
      }}
    >
      <div
        ref={text}
        data-card-text={c.id}
        style={{
          width: '100%', minHeight: '1.25em', lineHeight: 1.25, whiteSpace: 'pre-wrap', overflowWrap: 'anywhere',
          fontSize: c.t.fontSize ?? 36, fontWeight: c.t.fontWeight ?? 600,
          color: c.t.color ?? (isDark(c.fill) ? '#FFFFFF' : '#1F2937'),
        }}
      />
    </div>
  );
}
