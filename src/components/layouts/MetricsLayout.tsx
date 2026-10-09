import type { LucideIcon } from 'lucide-react';
import { CalendarDays, FlaskConical } from 'lucide-react';
import { AreaLine } from '../charts/AreaLine';
import { HBars } from '../charts/HBars';
import { Chip } from '../ui/Chip';
import { CountUp } from '../ui/CountUp';
import { IconBadge } from '../ui/IconBadge';
import { Reveal } from '../ui/Reveal';
import { Title, Hl } from '../ui/Title';

export interface MetricsData {
  eyebrow: string;
  title: [string, string];
  referencia: string;
  placeholder: boolean;
  kpis: { label: string; value: number | null; suffix?: string; hint: string; icon: LucideIcon }[];
  evolucao: { title: string; data: { label: string; value: number }[] };
  tipos: { title: string; data: { label: string; value: number }[] };
  insight: string;
}

const card = { background: '#fff', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-card)', padding: '26px 30px' } as const;
const cardTitle = { fontSize: 22, fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase', color: 'var(--c-ink-soft)' } as const;

/** Faixa de KPIs + evolução (linha) + tipos (barras): recria o painel “Evolução e Tipos” do BWS. */
export function MetricsLayout({ d }: { d: MetricsData }) {
  return (
    <div style={{ position: 'absolute', inset: '160px 96px 112px', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
        <Title eyebrow={d.eyebrow}>{d.title[0]} <Hl>{d.title[1]}</Hl></Title>
        <Reveal delay={0.1}>
          <div style={{ display: 'flex', gap: 12 }}>
            {d.placeholder && <Chip tone="alert"><FlaskConical size={22} /> Dados de exemplo</Chip>}
            <Chip tone="outline"><CalendarDays size={22} /> {d.referencia}</Chip>
          </div>
        </Reveal>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24, marginTop: 30 }}>
        {d.kpis.map((k, i) => (
          <Reveal key={k.label} delay={0.12 + i * 0.08} from="up">
            <div style={{ ...card, padding: '18px 26px', position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', gap: 22 }}>
              <span style={{ position: 'absolute', left: 0, top: 0, right: 0, height: 4, background: 'var(--ws-action)' }} />
              <IconBadge icon={k.icon} tone="dark" size={58} />
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: 20, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.06em', color: 'var(--c-ink-soft)' }}>{k.label}</span>
                <span style={{ display: 'flex', alignItems: 'baseline', gap: 14 }}>
                  <span style={{ fontSize: 58, fontWeight: 700, color: 'var(--ws-text)', lineHeight: 1.05 }}><CountUp value={k.value} suffix={k.suffix} /></span>
                  <span style={{ fontSize: 'var(--fs-caption)', color: 'var(--c-ink-soft)' }}>{k.hint}</span>
                </span>
              </div>
            </div>
          </Reveal>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.45fr 1fr', gap: 24, marginTop: 24, flex: 1, minHeight: 0 }}>
        <Reveal delay={0.25} from="up">
          <div style={{ ...card, height: '100%', overflow: 'hidden' }}>
            <span style={cardTitle}>{d.evolucao.title}</span>
            <div style={{ marginTop: 6 }}>
              <AreaLine data={d.evolucao.data} width={940} height={350} color="var(--c-green-700)" />
            </div>
          </div>
        </Reveal>
        <Reveal delay={0.35} from="right">
          <div style={{ ...card, height: '100%', overflow: 'hidden' }}>
            <span style={cardTitle}>{d.tipos.title}</span>
            <div style={{ marginTop: 14 }}>
              <HBars data={d.tipos.data} width={630} color="var(--c-green-600)" rowHeight={35} labelWidth={240} />
            </div>
          </div>
        </Reveal>
      </div>

      {d.insight && <Reveal at={1}>
        <div style={{ marginTop: 18, display: 'flex', alignItems: 'center', gap: 16, fontSize: 28, color: 'var(--ws-text)', fontWeight: 600 }}>
          <span style={{ width: 12, height: 12, borderRadius: 3, background: 'var(--ws-action)' }} />
          {d.insight}
        </div>
      </Reveal>}
    </div>
  );
}
