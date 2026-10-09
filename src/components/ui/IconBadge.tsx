import type { LucideIcon } from 'lucide-react';
import type { CSSProperties } from 'react';

type Tone = 'green' | 'lime' | 'dark' | 'alert' | 'success' | 'danger' | 'info' | 'glass' | 'white';

const tones: Record<Tone, CSSProperties> = {
  green: { background: 'var(--ws-action)', color: '#fff' },
  lime: { background: 'var(--ws-selection)', color: 'var(--ws-primary)' },
  dark: { background: 'var(--ws-chrome)', color: 'var(--ws-selection)' },
  alert: { background: 'var(--c-alert-tint)', color: 'var(--c-alert)' },
  success: { background: 'var(--c-success-tint)', color: 'var(--c-success)' },
  danger: { background: 'var(--c-danger-tint)', color: 'var(--c-danger)' },
  info: { background: 'var(--c-info-tint)', color: 'var(--c-info)' },
  glass: { background: 'var(--ws-chrome-2)', color: 'var(--ws-selection)' }, // superfície sólida sobre o chrome
  white: { background: '#fff', color: 'var(--ws-action)', border: '1px solid var(--ws-border)' },
};

interface Props { icon: LucideIcon; tone?: Tone; size?: number; radius?: number; style?: CSSProperties }

/** Ícone outline dentro de um bloco arredondado. */
export function IconBadge({ icon: Icon, tone = 'green', size = 76, radius, style }: Props) {
  return (
    <span
      style={{
        width: size, height: size, borderRadius: radius ?? Math.max(6, size * 0.16), flex: 'none',
        display: 'inline-grid', placeItems: 'center', ...tones[tone], ...style,
      }}
    >
      <Icon size={size * 0.5} strokeWidth={1.75} />
    </span>
  );
}
