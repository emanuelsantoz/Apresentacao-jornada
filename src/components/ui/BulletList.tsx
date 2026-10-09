import type { LucideIcon } from 'lucide-react';
import { Reveal } from './Reveal';
import { IconBadge } from './IconBadge';

export interface Bullet { icon: LucideIcon; text: string; strong?: string; at?: number }

/** Lista curta (máx. 4 itens) com ícone em bloco. `strong` aparece em negrito antes do texto. */
export function BulletList({ items, light, size = 64, gap = 26, delay = 0.2 }: { items: Bullet[]; light?: boolean; size?: number; gap?: number; delay?: number }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap }}>
      {items.map((b, i) => (
        <Reveal key={i} at={b.at ?? 0} delay={delay + i * 0.08} from="left">
          <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
            <IconBadge icon={b.icon} tone={light ? 'glass' : 'white'} size={size} />
            <span style={{ fontSize: 'var(--fs-body)', lineHeight: 1.3, color: light ? 'rgba(255,255,255,0.9)' : 'var(--c-ink)' }}>
              {b.strong && <strong style={{ fontWeight: 700, color: light ? '#fff' : 'var(--ws-text)' }}>{b.strong} </strong>}
              {b.text}
            </span>
          </div>
        </Reveal>
      ))}
    </div>
  );
}
