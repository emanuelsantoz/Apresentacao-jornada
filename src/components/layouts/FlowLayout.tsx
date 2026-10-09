import type { LucideIcon } from 'lucide-react';
import { motion } from 'motion/react';
import { Database } from 'lucide-react';
import { Reveal } from '../ui/Reveal';
import { IconBadge } from '../ui/IconBadge';
import { Title, Hl } from '../ui/Title';
import { useSlideState } from '../../hooks/useSlideState';

export interface FlowNode { n: string; icon: LucideIcon; title: string; text: string }
export interface FlowData { eyebrow: string; title: [string, string]; nodes: FlowNode[]; band: { strong: string; text: string } }

const NODE_W = 470;
const GAP = (1728 - NODE_W * 3) / 2;

/** Processo horizontal: nós que acendem por passo, linha com dados “viajando”. */
export function FlowLayout({ d }: { d: FlowData }) {
  const { step, print } = useSlideState();
  const lit = print ? d.nodes.length - 1 : step;
  return (
    <div style={{ position: 'absolute', inset: '170px 96px 130px' }}>
      <Title eyebrow={d.eyebrow}>{d.title[0]} <Hl>{d.title[1]}</Hl></Title>

      <div style={{ position: 'relative', marginTop: 80, height: 470 }}>
        {/* trilho */}
        <div style={{ position: 'absolute', left: NODE_W / 2, right: NODE_W / 2, top: 87, height: 6, borderRadius: 6, background: 'var(--c-line)' }}>
          <motion.div
            style={{ height: '100%', borderRadius: 6, background: 'var(--ws-action)' }}
            initial={print ? false : { width: '0%' }}
            animate={{ width: `${(lit / (d.nodes.length - 1)) * 100}%` }}
            transition={{ duration: 0.8, ease: 'easeInOut' }}
          />
          {!print && [0, 1, 2].map((i) => (
            <motion.span
              key={i}
              style={{ position: 'absolute', top: -5, width: 16, height: 16, borderRadius: 16, background: 'var(--ws-action)', boxShadow: '0 0 0 5px rgba(18,134,79,0.2)' }}
              animate={{ left: ['0%', `${(lit / (d.nodes.length - 1)) * 100}%`], opacity: lit ? [0, 1, 1, 0] : 0 }}
              transition={{ duration: 2.4, repeat: Infinity, delay: i * 0.8, ease: 'linear' }}
            />
          ))}
        </div>

        {d.nodes.map((n, i) => (
          <Reveal key={n.n} at={i} from="up" delay={i === 0 ? 0.2 : 0} style={{ position: 'absolute', left: i * (NODE_W + GAP), top: 0, width: NODE_W }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
              <motion.div animate={{ scale: i === lit ? 1.06 : 1 }} transition={{ duration: 0.4 }}>
                <IconBadge icon={n.icon} tone={i <= lit ? 'dark' : 'white'} size={180} radius={180} style={{ border: '6px solid var(--c-paper)', boxShadow: i === lit ? '0 0 0 8px rgba(18,134,79,0.18)' : 'var(--shadow-card)' }} />
              </motion.div>
              <span className="num" style={{ marginTop: 26, fontSize: 'var(--fs-label)', fontWeight: 600, color: 'var(--c-green-600)', letterSpacing: '.1em' }}>PASSO {n.n}</span>
              <span style={{ marginTop: 8, fontSize: 46, fontWeight: 700, color: 'var(--ws-text)' }}>{n.title}</span>
              <span style={{ marginTop: 12, fontSize: 'var(--fs-body)', lineHeight: 1.3, color: 'var(--c-ink-soft)' }}>{n.text}</span>
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal at={d.nodes.length - 1} delay={0.4}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 26, padding: '28px 36px', borderRadius: 'var(--radius-md)', background: 'var(--c-green-900)', color: '#fff' }}>
          <IconBadge icon={Database} tone="lime" size={68} />
          <span style={{ fontSize: 40, fontWeight: 700, color: 'var(--c-lime)' }}>{d.band.strong}</span>
          <span style={{ fontSize: 'var(--fs-body)', color: 'rgba(255,255,255,0.85)' }}>{d.band.text}</span>
        </div>
      </Reveal>
    </div>
  );
}
