import type { LucideIcon } from 'lucide-react';
import { motion } from 'motion/react';
import { IconBadge } from '../ui/IconBadge';
import { Reveal } from '../ui/Reveal';
import { Title, Hl } from '../ui/Title';
import { useRevealed, useSlideState } from '../../hooks/useSlideState';

export interface Definition { term: string; text: string }
export interface Concept { icon: LucideIcon; name: string; kicker: string; defs: Definition[]; visual: 'funnel' | 'timeline' }
export interface ConceptsData { eyebrow: string; title: [string, string]; concepts: [Concept, Concept] }

function Funnel() {
  // vários canais → um único ponto de entrada
  const { print } = useSlideState();
  const ins = ['E-mail', 'Teams', 'Telefone', 'Corredor'];
  return (
    <svg viewBox="0 0 640 170" width="100%" height={170} aria-hidden>
      {ins.map((t, i) => (
        <g key={t}>
          <text x={0} y={30 + i * 38} fontSize={22} fill="var(--c-ink-soft)" fontFamily="var(--font-brand)">{t}</text>
          <motion.path
            d={`M120 ${24 + i * 38} C 300 ${24 + i * 38}, 300 85, 440 85`}
            fill="none" stroke="var(--c-line)" strokeWidth={4} strokeDasharray="8 8"
            initial={print ? false : { pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1, delay: 0.3 + i * 0.1 }}
          />
        </g>
      ))}
      <rect x={440} y={55} width={200} height={60} rx={8} fill="var(--ws-action)" />
      <text x={540} y={94} textAnchor="middle" fontSize={24} fontWeight={700} fill="#fff" fontFamily="var(--font-brand)">1 chamado</text>
    </svg>
  );
}

function Timeline() {
  const { print } = useSlideState();
  return (
    <svg viewBox="0 0 640 170" width="100%" height={170} aria-hidden>
      <rect x={10} y={70} width={620} height={26} rx={6} fill="var(--ws-chrome-2)" />
      <motion.rect x={10} y={70} height={26} rx={6} fill="var(--ws-action)" initial={print ? false : { width: 0 }} animate={{ width: 400 }} transition={{ duration: 1.2, delay: 0.4 }} />
      <circle cx={18} cy={83} r={16} fill="#fff" />
      <text x={10} y={140} fontSize={22} fill="rgba(255,255,255,.75)" fontFamily="var(--font-brand)">Abertura</text>
      <line x1={600} y1={46} x2={600} y2={120} stroke="var(--ws-selection)" strokeWidth={4} strokeDasharray="6 6" />
      <text x={630} y={140} textAnchor="end" fontSize={22} fill="var(--ws-selection)" fontWeight={700} fontFamily="var(--font-brand)">Prazo</text>
      <text x={10} y={36} fontSize={22} fill="rgba(255,255,255,.75)" fontFamily="var(--font-brand)">Tempo combinado para resolver</text>
    </svg>
  );
}

function ConceptCard({ c, i }: { c: Concept; i: number }) {
  const shown = useRevealed(i);
  const dark = i === 1;
  return (
    <Reveal at={i} from="scale" delay={i === 0 ? 0.2 : 0} style={{ flex: 1, perspective: 1600 }}>
      <motion.div
        animate={{ opacity: shown ? 1 : 0 }}
        transition={{ duration: 0.6 }}
        style={{
          height: '100%', borderRadius: 'var(--radius-lg)', padding: '44px 48px', display: 'flex', flexDirection: 'column',
          background: dark ? 'var(--c-green-900)' : '#fff', color: dark ? '#fff' : 'var(--c-ink)', boxShadow: 'var(--shadow-card)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 22 }}>
          <IconBadge icon={c.icon} tone={dark ? 'lime' : 'green'} size={80} />
          <div>
            <div style={{ fontSize: 'var(--fs-caption)', letterSpacing: '.12em', textTransform: 'uppercase', fontWeight: 600, color: dark ? 'var(--ws-selection)' : 'var(--ws-action)' }}>{c.kicker}</div>
            <div style={{ fontSize: 56, fontWeight: 700, letterSpacing: '-0.02em', color: dark ? '#fff' : 'var(--ws-text)' }}>{c.name}</div>
          </div>
        </div>
        <div style={{ marginTop: 34, display: 'flex', flexDirection: 'column', gap: 22 }}>
          {c.defs.map((d) => (
            <div key={d.term} style={{ display: 'flex', gap: 18, alignItems: 'baseline' }}>
              <span style={{ flex: 'none', minWidth: 96, fontSize: 'var(--fs-label)', fontWeight: 700, padding: '6px 14px', borderRadius: 6, textAlign: 'center', background: dark ? 'var(--ws-chrome-2)' : 'var(--ws-selection)', color: dark ? 'var(--ws-selection)' : 'var(--ws-primary)' }}>{d.term}</span>
              <span style={{ fontSize: 'var(--fs-body)', lineHeight: 1.3 }}>{d.text}</span>
            </div>
          ))}
        </div>
        <div style={{ flex: 1 }} />
        {c.visual === 'funnel' ? <Funnel /> : <Timeline />}
      </motion.div>
    </Reveal>
  );
}

/** Dois conceitos lado a lado, cada um com um mini-diagrama explicativo. */
export function ConceptsLayout({ d }: { d: ConceptsData }) {
  return (
    <div style={{ position: 'absolute', inset: '170px 96px 130px', display: 'flex', flexDirection: 'column' }}>
      <Title eyebrow={d.eyebrow}>{d.title[0]} <Hl>{d.title[1]}</Hl></Title>
      <div style={{ display: 'flex', gap: 44, marginTop: 50, flex: 1 }}>
        {d.concepts.map((c, i) => <ConceptCard key={c.name} c={c} i={i} />)}
      </div>
    </div>
  );
}
