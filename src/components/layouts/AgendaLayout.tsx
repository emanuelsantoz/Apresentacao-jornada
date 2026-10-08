import type { LucideIcon } from 'lucide-react';
import { motion } from 'motion/react';
import { Aurora } from '../stage/Shapes';
import { Reveal } from '../ui/Reveal';
import { IconBadge } from '../ui/IconBadge';
import { Chip } from '../ui/Chip';
import { useRevealed, useSlideState } from '../../hooks/useSlideState';

export interface AgendaItem { n: string; icon: LucideIcon; title: string; text: string; topics: string[] }
export interface AgendaData { eyebrow: string; title: string; side: string; items: AgendaItem[] }

/** Agenda: painel escuro à esquerda (ref. 1 · Executive Summary) + fases numeradas à direita. */
export function AgendaLayout({ d }: { d: AgendaData }) {
  const { print } = useSlideState();
  const second = useRevealed(1);
  return (
    <>
      <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 760, background: 'var(--c-green-950)', overflow: 'hidden', color: '#fff' }}>
        <Aurora variant={1} />
        <div style={{ position: 'absolute', left: 96, top: 250, right: 80 }}>
          <Reveal><div style={{ fontSize: 'var(--fs-label)', letterSpacing: '.14em', textTransform: 'uppercase', fontWeight: 600, color: 'var(--c-lime)', marginBottom: 26 }}>{d.eyebrow}</div></Reveal>
          <Reveal delay={0.06}><h1 style={{ margin: 0, fontSize: 92, lineHeight: 1, letterSpacing: '-0.03em', fontWeight: 700 }}>{d.title}</h1></Reveal>
          <Reveal delay={0.14}><p style={{ margin: '36px 0 0', fontSize: 'var(--fs-body)', lineHeight: 1.35, color: 'rgba(255,255,255,0.78)' }}>{d.side}</p></Reveal>
        </div>
        <div aria-hidden style={{ position: 'absolute', left: 330, top: 560, fontSize: 380, fontWeight: 700, lineHeight: 1, color: 'transparent', WebkitTextStroke: '3px rgba(175,191,48,0.35)', letterSpacing: '-0.05em' }}>2×</div>
      </div>

      <div style={{ position: 'absolute', left: 860, right: 110, top: 170, bottom: 140, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 44 }}>
        {d.items.map((it, i) => (
          <Reveal key={it.n} at={i} from="right" delay={i === 0 ? 0.2 : 0}>
            <div style={{
              position: 'relative', display: 'flex', gap: 36, alignItems: 'flex-start', padding: '40px 44px', borderRadius: 'var(--radius-lg)',
              background: i === 0 || second ? '#fff' : 'transparent', boxShadow: 'var(--shadow-card)', overflow: 'hidden',
            }}>
              <span style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 10, background: i === 0 ? 'var(--c-green-600)' : 'var(--c-lime)' }} />
              <div style={{ fontSize: 110, fontWeight: 700, lineHeight: 0.85, color: 'transparent', WebkitTextStroke: '2.5px var(--c-green-600)', width: 150, flex: 'none' }} className="num">{it.n}</div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                  <IconBadge icon={it.icon} tone={i === 0 ? 'green' : 'dark'} size={64} />
                  <span style={{ fontSize: 48, fontWeight: 700, color: 'var(--c-green-900)', letterSpacing: '-0.02em' }}>{it.title}</span>
                </div>
                <p style={{ margin: '20px 0 22px', fontSize: 'var(--fs-body)', color: 'var(--c-ink-soft)', lineHeight: 1.3 }}>{it.text}</p>
                <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                  {it.topics.map((t) => <Chip key={t} tone="outline">{t}</Chip>)}
                </div>
              </div>
            </div>
          </Reveal>
        ))}
        <motion.span
          aria-hidden
          style={{ position: 'absolute', left: 120, top: '50%', width: 4, height: 44, marginTop: -22, background: 'var(--c-lime)', borderRadius: 4, originY: 0 }}
          initial={print ? false : { scaleY: 0 }}
          animate={{ scaleY: second ? 1 : 0 }}
          transition={{ duration: 0.5 }}
        />
      </div>
    </>
  );
}
