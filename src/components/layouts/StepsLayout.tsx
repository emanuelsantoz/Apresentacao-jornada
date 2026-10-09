import type { LucideIcon } from 'lucide-react';
import { ArrowRight } from 'lucide-react';
import { Screen, type ScreenSpec } from '../devices/Screen';
import { Chip } from '../ui/Chip';
import { IconBadge } from '../ui/IconBadge';
import { Reveal } from '../ui/Reveal';
import { Title, Hl } from '../ui/Title';
import { useRevealed } from '../../hooks/useSlideState';

export interface StepCard { n: string; icon: LucideIcon; verb: string; text: string; screen: ScreenSpec }
export interface StepsData { eyebrow: string; title: [string, string]; steps: StepCard[]; tip?: { icon: LucideIcon; text: string } }

function Card({ s, i, total }: { s: StepCard; i: number; total: number }) {
  const on = useRevealed(i);
  return (
    <Reveal at={i} from="up" delay={i === 0 ? 0.2 : 0} style={{ flex: 1, position: 'relative' }}>
      <div style={{ height: '100%', borderRadius: 'var(--radius-lg)', background: '#fff', boxShadow: 'var(--shadow-card)', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <div style={{ position: 'relative', height: 390, margin: 18, marginBottom: 0, borderRadius: 8, overflow: 'hidden', background: 'var(--ws-chrome)', border: '6px solid var(--ws-chrome)' }}>
          <Screen spec={s.screen} />
        </div>
        <div style={{ padding: '26px 34px 34px', display: 'flex', gap: 22, alignItems: 'flex-start' }}>
          <span className="num" style={{ fontSize: 92, fontWeight: 700, lineHeight: 0.85, color: on ? 'var(--ws-primary)' : 'transparent', WebkitTextStroke: '2.5px var(--ws-primary)', transition: 'color .4s' }}>{s.n}</span>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <IconBadge icon={s.icon} tone="dark" size={50} />
              <span style={{ fontSize: 40, fontWeight: 700, color: 'var(--ws-text)' }}>{s.verb}</span>
            </div>
            <p style={{ margin: '14px 0 0', fontSize: 'var(--fs-body)', lineHeight: 1.3, color: 'var(--c-ink-soft)' }}>{s.text}</p>
          </div>
        </div>
      </div>
      {i < total - 1 && (
        <span style={{ position: 'absolute', right: -44, top: 200, zIndex: 3, width: 60, height: 60, borderRadius: 8, background: 'var(--ws-action)', display: 'grid', placeItems: 'center', color: '#fff', boxShadow: 'var(--shadow-card)' }}>
          <ArrowRight size={30} />
        </span>
      )}
    </Reveal>
  );
}

/** Passo a passo em cards com mini-tela (ref. 1 · cards numerados). */
export function StepsLayout({ d }: { d: StepsData }) {
  return (
    <div style={{ position: 'absolute', inset: '170px 96px 130px', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
        <Title eyebrow={d.eyebrow}>{d.title[0]} <Hl>{d.title[1]}</Hl></Title>
        {d.tip && (
          <Reveal at={d.steps.length - 1} delay={0.3}>
            <Chip tone="lime"><d.tip.icon size={24} /> {d.tip.text}</Chip>
          </Reveal>
        )}
      </div>
      <div style={{ display: 'flex', gap: 56, marginTop: 50, flex: 1 }}>
        {d.steps.map((s, i) => <Card key={s.n} s={s} i={i} total={d.steps.length} />)}
      </div>
    </div>
  );
}
