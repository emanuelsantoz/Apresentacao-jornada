import type { ReactNode } from 'react';
import type { Theme } from '../../types/slide';
import { BrandMark } from './BrandMark';
import { Aurora, Shapes } from './Shapes';

interface Props {
  theme: Theme;
  index: number;
  total: number;
  section: string;
  children: ReactNode;
  shapes?: 'a' | 'b' | 'c' | 'none';
  aurora?: number;
  /** Esconde o cabeçalho/rodapé (capas). */
  bare?: boolean;
  chromeOnDark?: boolean;
}

const bg: Record<Theme, string> = {
  light: 'radial-gradient(120% 120% at 30% 20%, #fbfdfb 0%, var(--c-paper) 45%, var(--c-paper-edge) 100%)',
  dark: 'linear-gradient(135deg, var(--c-green-950) 0%, #0e3320 100%)',
  aurora: 'var(--c-green-950)',
};

/** Moldura comum: fundo, formas, logo e rodapé com seção e número. */
export function SlideFrame({ theme, index, total, section, children, shapes = 'a', aurora, bare, chromeOnDark }: Props) {
  const dark = theme !== 'light';
  return (
    <div
      data-slide-frame
      style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: bg[theme], color: dark ? '#fff' : 'var(--c-ink)' }}
    >
      {theme === 'aurora' && <Aurora variant={aurora ?? index % 2} />}
      {shapes !== 'none' && <Shapes preset={shapes} dark={dark} />}
      {!bare && (
        <>
          <div style={{ position: 'absolute', left: 96, top: 64, zIndex: 5 }}>
            <BrandMark dark={dark || chromeOnDark} height={44} />
          </div>
          <footer
            style={{
              position: 'absolute', left: 96, right: 96, bottom: 48, zIndex: 5, display: 'flex', alignItems: 'center',
              gap: 24, fontSize: 'var(--fs-caption)', color: dark ? 'rgba(255,255,255,0.6)' : 'var(--c-ink-soft)',
            }}
          >
            <span style={chromeOnDark ? { color: 'rgba(255,255,255,0.65)' } : undefined}>{section}</span>
            <span style={{ flex: 1, height: 1.5, background: dark ? 'rgba(255,255,255,0.14)' : 'var(--c-line)' }} />
            <span className="num" style={{ fontWeight: 600, color: dark ? 'var(--c-lime)' : 'var(--c-green-600)' }}>
              {String(index + 1).padStart(2, '0')}
              <span style={{ opacity: 0.55, fontWeight: 400 }}> / {total}</span>
            </span>
          </footer>
        </>
      )}
      <div style={{ position: 'absolute', inset: 0, zIndex: 2 }}>{children}</div>
    </div>
  );
}
