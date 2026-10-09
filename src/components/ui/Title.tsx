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
            letterSpacing: '0.12em', textTransform: 'uppercase', color: light ? 'var(--ws-selection)' : 'var(--ws-action)', marginBottom: 22,
          }}>
            {eyebrow}
          </div>
        </Reveal>
      )}
      <Reveal delay={0.06}>
        <h1 style={{
          margin: 0, fontSize: size ?? 'var(--fs-title)', lineHeight: 1.04, fontWeight: 700, letterSpacing: '-0.02em',
          color: light ? '#fff' : 'var(--ws-text)', textWrap: 'balance',
        }}>
          {children}
        </h1>
      </Reveal>
    </div>
  );
}

/** Realce verde dentro de um título. */
export const Hl = ({ children, tone = 'green' }: { children: ReactNode; tone?: 'green' | 'lime' }) => (
  <span style={{ color: tone === 'lime' ? 'var(--ws-selection)' : 'var(--ws-primary)' }}>{children}</span>
);
