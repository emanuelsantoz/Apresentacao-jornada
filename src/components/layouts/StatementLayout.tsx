import type { LucideIcon } from 'lucide-react';
import { ArrowRight } from 'lucide-react';
import { IconBadge } from '../ui/IconBadge';
import { Reveal } from '../ui/Reveal';

export interface StatementData {
  eyebrow: string;
  question: string;
  answer: [string, string];
  rule: { label: string; steps: { n: string; icon: LucideIcon; text: string }[] };
}

/** Pergunta de impacto → resposta (passo 1) → regra de ouro (passo 2). */
export function StatementLayout({ d }: { d: StatementData }) {
  return (
    <div style={{ position: 'absolute', inset: '200px 120px 140px', display: 'flex', flexDirection: 'column' }}>
      <Reveal>
        <div style={{ fontSize: 'var(--fs-label)', fontWeight: 600, letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--c-lime)' }}>{d.eyebrow}</div>
      </Reveal>
      <Reveal delay={0.1}>
        <h1 style={{ margin: '28px 0 0', fontSize: 100, lineHeight: 1.04, letterSpacing: '-0.035em', fontWeight: 700, maxWidth: 1500, textWrap: 'balance' }}>
          <span style={{ color: 'var(--c-lime)' }}>“</span>{d.question}<span style={{ color: 'var(--c-lime)' }}>”</span>
        </h1>
      </Reveal>
      <Reveal at={1}>
        <p style={{ margin: '44px 0 0', fontSize: 56, fontWeight: 600, color: 'rgba(255,255,255,0.92)' }}>
          {d.answer[0]} <span style={{ color: 'var(--c-lime)' }}>{d.answer[1]}</span>
        </p>
      </Reveal>
      <span style={{ flex: 1 }} />
      <Reveal at={2} from="up">
        <div style={{ display: 'flex', alignItems: 'center', gap: 28, padding: '28px 36px', borderRadius: 'var(--radius-lg)', background: 'rgba(255,255,255,0.07)', border: '1.5px solid rgba(175,191,48,0.4)' }}>
          <span style={{ fontSize: 'var(--fs-label)', fontWeight: 700, color: 'var(--c-green-900)', background: 'var(--c-lime)', padding: '10px 20px', borderRadius: 999, textTransform: 'uppercase', letterSpacing: '.08em' }}>{d.rule.label}</span>
          {d.rule.steps.map((s, i) => (
            <span key={s.n} style={{ display: 'inline-flex', alignItems: 'center', gap: 20 }}>
              {i > 0 && <ArrowRight size={40} color="var(--c-lime)" />}
              <IconBadge icon={s.icon} tone={i === 0 ? 'lime' : 'glass'} size={70} />
              <span style={{ fontSize: 34, fontWeight: 600 }}><span style={{ color: 'var(--c-lime)' }}>{s.n}</span> {s.text}</span>
            </span>
          ))}
        </div>
      </Reveal>
    </div>
  );
}
