import type { LucideIcon } from 'lucide-react';
import { ArrowRight, ChevronRight, MapPin } from 'lucide-react';
import { Reveal } from '../ui/Reveal';
import { IconBadge } from '../ui/IconBadge';
import { Title, Hl } from '../ui/Title';

export interface CompareData {
  eyebrow: string;
  title: [string, string]; // [parte normal, parte em destaque]
  before: { label: string; icon: LucideIcon; items: string[] };
  after: { label: string; icon: LucideIcon; items: string[] };
  where: { label: string; path: string[] };
}

/** Antes × Depois + faixa “onde fica”. Passo 1 revela o “depois” e esmaece o “antes”. */
export function CompareLayout({ d }: { d: CompareData }) {
  return (
    <div style={{ position: 'absolute', inset: '170px 96px 130px', display: 'flex', flexDirection: 'column' }}>
      <Title eyebrow={d.eyebrow}>{d.title[0]} <Hl>{d.title[1]}</Hl></Title>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 120px 1fr', alignItems: 'stretch', marginTop: 56, flex: 1 }}>
        <Reveal from="left" delay={0.2} dimAfter={1}>
          <div style={{ position: 'relative', overflow: 'hidden', height: '100%', borderRadius: 'var(--radius-lg)', padding: 44, background: '#fff', border: '2px solid var(--c-line)' }}>
            <d.before.icon aria-hidden size={260} strokeWidth={1} style={{ position: 'absolute', right: -30, bottom: -40, color: 'var(--c-alert)', opacity: 0.1 }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 34 }}>
              <IconBadge icon={d.before.icon} tone="alert" size={70} />
              <span style={{ fontSize: 'var(--fs-subtitle)', fontWeight: 600, color: 'var(--c-ink-soft)' }}>{d.before.label}</span>
            </div>
            {d.before.items.map((t) => (
              <p key={t} style={{ margin: '0 0 22px', fontSize: 34, lineHeight: 1.3, display: 'flex', gap: 16, position: 'relative' }}>
                <span style={{ color: 'var(--c-alert)', fontWeight: 700 }}>✕</span>{t}
              </p>
            ))}
          </div>
        </Reveal>
        <Reveal at={1} from="scale" style={{ display: 'grid', placeItems: 'center' }}>
          <span style={{ width: 84, height: 84, borderRadius: 84, background: 'var(--c-lime)', display: 'grid', placeItems: 'center', color: 'var(--c-green-900)' }}><ArrowRight size={42} /></span>
        </Reveal>
        <Reveal at={1} from="right">
          <div style={{ position: 'relative', overflow: 'hidden', height: '100%', borderRadius: 'var(--radius-lg)', padding: 44, background: 'var(--c-green-900)', color: '#fff', boxShadow: 'var(--shadow-card)' }}>
            <d.after.icon aria-hidden size={260} strokeWidth={1} style={{ position: 'absolute', right: -30, bottom: -40, color: 'var(--c-lime)', opacity: 0.16 }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 34 }}>
              <IconBadge icon={d.after.icon} tone="lime" size={70} />
              <span style={{ fontSize: 'var(--fs-subtitle)', fontWeight: 600 }}>{d.after.label}</span>
            </div>
            {d.after.items.map((t) => (
              <p key={t} style={{ margin: '0 0 22px', fontSize: 34, lineHeight: 1.3, display: 'flex', gap: 16, position: 'relative' }}>
                <span style={{ color: 'var(--c-lime)', fontWeight: 700 }}>✓</span>{t}
              </p>
            ))}
          </div>
        </Reveal>
      </div>

      <Reveal at={2} from="up">
        <div style={{ marginTop: 36, display: 'flex', alignItems: 'center', gap: 22, padding: '22px 30px', borderRadius: 'var(--radius-md)', background: '#fff', boxShadow: 'var(--shadow-card)' }}>
          <IconBadge icon={MapPin} tone="green" size={60} />
          <span style={{ fontSize: 'var(--fs-body)', fontWeight: 600, color: 'var(--c-green-900)' }}>{d.where.label}</span>
          <span style={{ flex: 1 }} />
          {d.where.path.map((p, i) => (
            <span key={p} style={{ display: 'inline-flex', alignItems: 'center', gap: 12, fontSize: 'var(--fs-label)', fontWeight: 500, color: i === d.where.path.length - 1 ? 'var(--c-green-600)' : 'var(--c-ink-soft)' }}>
              {i > 0 && <ChevronRight size={22} />}
              {p}
            </span>
          ))}
        </div>
      </Reveal>
    </div>
  );
}
