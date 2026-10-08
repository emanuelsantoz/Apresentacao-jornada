import type { LucideIcon } from 'lucide-react';
import type { CSSProperties } from 'react';

type Tone = 'green' | 'lime' | 'dark' | 'alert' | 'success' | 'danger' | 'info' | 'glass' | 'white';

const tones: Record<Tone, CSSProperties> = {
  green: { background: 'var(--c-green-600)', color: '#fff' },
  lime: { background: 'var(--c-lime)', color: 'var(--c-green-900)' },
  dark: { background: 'var(--c-green-900)', color: 'var(--c-lime)' },
  alert: { background: 'var(--c-alert-tint)', color: 'var(--c-alert)' },
  success: { background: 'var(--c-success-tint)', color: 'var(--c-success)' },
  danger: { background: 'var(--c-danger-tint)', color: 'var(--c-danger)' },
  info: { background: 'var(--c-info-tint)', color: 'var(--c-info)' },
  glass: { background: 'rgba(255,255,255,0.08)', color: 'var(--c-lime)', border: '1.5px solid rgba(175,191,48,0.45)' },
  white: { background: '#fff', color: 'var(--c-green-600)', boxShadow: 'var(--shadow-card)' },
};

interface Props { icon: LucideIcon; tone?: Tone; size?: number; radius?: number; style?: CSSProperties }

/** Ícone outline dentro de um bloco arredondado. */
export function IconBadge({ icon: Icon, tone = 'green', size = 76, radius, style }: Props) {
  return (
    <span
      style={{
        width: size, height: size, borderRadius: radius ?? size * 0.32, flex: 'none',
        display: 'inline-grid', placeItems: 'center', ...tones[tone], ...style,
      }}
    >
      <Icon size={size * 0.5} strokeWidth={1.75} />
    </span>
  );
}
