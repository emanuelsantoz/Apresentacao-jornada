import type { CSSProperties, ReactNode } from 'react';

type Tone = 'lime' | 'green' | 'outline' | 'alert' | 'success' | 'danger' | 'info' | 'glass';
const tones: Record<Tone, CSSProperties> = {
  lime: { background: 'var(--ws-selection)', color: 'var(--ws-primary)' },
  green: { background: 'var(--ws-action)', color: '#fff' },
  outline: { border: '1.5px solid var(--ws-border)', background: '#fff', color: 'var(--ws-text)' },
  alert: { background: 'var(--c-alert-tint)', color: 'var(--c-alert)' },
  success: { background: 'var(--c-success-tint)', color: 'var(--ws-primary)' },
  danger: { background: 'var(--c-danger-tint)', color: 'var(--c-danger)' },
  info: { background: 'var(--c-info-tint)', color: 'var(--c-info)' },
  glass: { background: 'var(--ws-chrome-2)', color: '#fff' },
};

export function Chip({ children, tone = 'lime', style }: { children: ReactNode; tone?: Tone; style?: CSSProperties }) {
  return (
    <span
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 12, padding: '8px 18px', borderRadius: 6,
        fontSize: 'var(--fs-label)', fontWeight: 500, lineHeight: 1.2, whiteSpace: 'nowrap', ...tones[tone], ...style,
      }}
    >
      {children}
    </span>
  );
}
