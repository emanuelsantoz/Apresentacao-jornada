import type { CSSProperties, ReactNode } from 'react';
import { Reveal } from './Reveal';

interface Props { eyebrow?: string; children: ReactNode; light?: boolean; size?: number; style?: CSSProperties }

/** Título de slide: rótulo pequeno (eyebrow) + título forte. */
export function Title({ eyebrow, children, light, size, style }: Props) {
  return (
    <div style={style}>
      {eyebrow && (
        <Reveal>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 14, fontSize: 'var(--fs-label)', fontWeight: 600,
            letterSpacing: '0.12em', textTransform: 'uppercase', color: light ? 'var(--c-lime)' : 'var(--c-green-600)', marginBottom: 22,
          }}>
            <span style={{ width: 40, height: 4, borderRadius: 4, background: 'currentColor' }} />
            {eyebrow}
          </div>
        </Reveal>
      )}
      <Reveal delay={0.06}>
        <h1 style={{
          margin: 0, fontSize: size ?? 'var(--fs-title)', lineHeight: 1.04, fontWeight: 700, letterSpacing: '-0.025em',
          color: light ? '#fff' : 'var(--c-green-900)', textWrap: 'balance',
        }}>
          {children}
        </h1>
      </Reveal>
    </div>
  );
}

/** Realce verde dentro de um título. */
export const Hl = ({ children, tone = 'green' }: { children: ReactNode; tone?: 'green' | 'lime' }) => (
  <span style={{ color: tone === 'lime' ? 'var(--c-lime)' : 'var(--c-green-600)' }}>{children}</span>
);
