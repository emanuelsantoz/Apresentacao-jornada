import type { ReactNode } from 'react';
import type { Theme } from '../../types/slide';
import { BrandMark } from './BrandMark';
import { Shapes } from './Shapes';

interface Props {
  theme: Theme;
  index: number;
  total: number;
  section: string;
  children: ReactNode;
  shapes?: 'a' | 'b' | 'c' | 'none';
  /** Esconde o cabeçalho/rodapé (capas). */
  bare?: boolean;
  chromeOnDark?: boolean;
}

// WorkSpace: cores sólidas, sem gradientes.
const bg: Record<Theme, string> = {
  light: 'var(--ws-canvas)',
  dark: 'var(--ws-chrome)',
  aurora: 'var(--ws-chrome)',
};

/** Moldura comum: fundo, formas, logo e rodapé com seção e número. */
export function SlideFrame({ theme, index, total, section, children, shapes = 'none', bare, chromeOnDark }: Props) {
  const dark = theme !== 'light';
  return (
    <div
      data-slide-frame
      style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: bg[theme], color: dark ? '#fff' : 'var(--c-ink)', fontVariantNumeric: 'tabular-nums' }}
    >
      {shapes !== 'none' && <Shapes preset={shapes} dark={dark} />}
      {!bare && (
        <>
          <div style={{ position: 'absolute', left: 96, top: 64, zIndex: 5 }}>
            <BrandMark dark={dark || chromeOnDark} height={44} />
          </div>
          <footer
            style={{
              position: 'absolute', left: 96, right: 96, bottom: 48, zIndex: 5, display: 'flex', alignItems: 'center',
              gap: 24, fontSize: 'var(--fs-caption)', color: dark ? 'var(--ws-on-chrome-muted)' : 'var(--c-ink-soft)',
            }}
          >
            <span style={chromeOnDark ? { color: 'var(--ws-on-chrome-muted)' } : undefined}>{section}</span>
            <span style={{ flex: 1, height: 1.5, background: dark ? 'var(--ws-chrome-2)' : 'var(--c-line)' }} />
            <span className="num" style={{ fontWeight: 600, color: dark ? 'var(--ws-selection)' : 'var(--ws-primary)', background: dark ? 'var(--ws-chrome-2)' : '#fff', border: dark ? 'none' : '1px solid var(--ws-border)', padding: '4px 12px', borderRadius: 6 }}>
              {String(index + 1).padStart(2, '0')}
              <span style={{ color: dark ? 'var(--ws-on-chrome-muted)' : 'var(--ws-muted)', fontWeight: 400 }}> / {total}</span>
            </span>
          </footer>
        </>
      )}
      <div style={{ position: 'absolute', inset: 0, zIndex: 2 }}>{children}</div>
    </div>
  );
}
