import type { LucideIcon } from 'lucide-react';
import { motion } from 'motion/react';
import { IconBadge } from '../ui/IconBadge';
import { Reveal } from '../ui/Reveal';
import { Title, Hl } from '../ui/Title';
import { useSlideState } from '../../hooks/useSlideState';

type Tone = 'info' | 'success' | 'alert' | 'green';
export interface StatusItem { name: string; icon: LucideIcon; tone: Tone; text: string; who: string }
export interface StatusData { eyebrow: string; title: [string, string]; items: StatusItem[] }

const colors: Record<Tone, string> = { info: 'var(--c-info)', success: 'var(--c-success)', alert: 'var(--c-alert)', green: 'var(--c-green-900)' };
const tints: Record<Tone, string> = { info: 'var(--c-info-tint)', success: 'var(--c-success-tint)', alert: 'var(--c-alert-tint)', green: 'var(--c-success-tint)' };
const text: Record<Tone, string> = { info: '#1f6b7e', success: 'var(--c-green-700)', alert: '#9a5a0c', green: 'var(--c-green-900)' };

/** Legenda de status como jornada: trilho com 4 estações (ref. 3 · fluxos), cada uma com badge tint. */
export function StatusLayout({ d }: { d: StatusData }) {
  const { print } = useSlideState();
  const n = d.items.length;
  return (
    <div style={{ position: 'absolute', inset: '170px 96px 130px', display: 'flex', flexDirection: 'column' }}>
      <Title eyebrow={d.eyebrow}>{d.title[0]} <Hl>{d.title[1]}</Hl></Title>

      <div style={{ position: 'relative', marginTop: 70, flex: 1 }}>
        <div style={{ position: 'absolute', left: `${50 / n}%`, right: `${50 / n}%`, top: 58, height: 6, background: 'var(--c-line)', borderRadius: 6 }}>
          <motion.div
            style={{ height: '100%', borderRadius: 6, background: 'linear-gradient(90deg, var(--c-info), var(--c-success), var(--c-alert), var(--c-green-900))', originX: 0 }}
            initial={print ? false : { scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1.6, ease: 'easeInOut', delay: 0.3 }}
          />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${n}, 1fr)`, gap: 32, height: '100%' }}>
          {d.items.map((s, i) => (
            <Reveal key={s.name} delay={0.35 + i * 0.25} from="up" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <IconBadge icon={s.icon} tone={s.tone === 'green' ? 'dark' : s.tone} size={122} radius={122} style={{ border: '6px solid var(--c-paper)', boxShadow: 'var(--shadow-card)' }} />
              <div style={{ marginTop: 34, width: '100%', flex: 1, background: '#fff', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-card)', padding: '30px 30px', borderTop: `8px solid ${colors[s.tone]}`, display: 'flex', flexDirection: 'column' }}>
                <span style={{ alignSelf: 'flex-start', padding: '8px 18px', borderRadius: 10, background: tints[s.tone], color: text[s.tone], fontSize: 30, fontWeight: 700 }}>{s.name}</span>
                <p style={{ margin: '22px 0 0', fontSize: 'var(--fs-body)', lineHeight: 1.3, color: 'var(--c-ink)' }}>{s.text}</p>
                <span style={{ flex: 1 }} />
                <span style={{ fontSize: 'var(--fs-caption)', color: 'var(--c-ink-soft)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.06em' }}>{s.who}</span>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  );
}
