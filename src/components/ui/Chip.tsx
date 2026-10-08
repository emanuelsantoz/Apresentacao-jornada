import type { CSSProperties, ReactNode } from 'react';

type Tone = 'lime' | 'green' | 'outline' | 'alert' | 'success' | 'danger' | 'info' | 'glass';
const tones: Record<Tone, CSSProperties> = {
  lime: { background: 'var(--c-lime)', color: 'var(--c-green-900)' },
  green: { background: 'var(--c-green-600)', color: '#fff' },
  outline: { border: '2px solid var(--c-line)', color: 'var(--c-green-900)' },
  alert: { background: 'var(--c-alert-tint)', color: '#9a5a0c' },
  success: { background: 'var(--c-success-tint)', color: 'var(--c-green-700)' },
  danger: { background: 'var(--c-danger-tint)', color: '#9b2c26' },
  info: { background: 'var(--c-info-tint)', color: '#1f6b7e' },
  glass: { background: 'rgba(255,255,255,0.1)', color: '#fff', border: '1.5px solid rgba(255,255,255,0.2)' },
};

export function Chip({ children, tone = 'lime', style }: { children: ReactNode; tone?: Tone; style?: CSSProperties }) {
  return (
    <span
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 12, padding: '10px 22px', borderRadius: 999,
        fontSize: 'var(--fs-label)', fontWeight: 500, lineHeight: 1.2, whiteSpace: 'nowrap', ...tones[tone], ...style,
      }}
    >
      {children}
    </span>
  );
}
