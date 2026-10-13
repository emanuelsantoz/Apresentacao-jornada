import type { LucideIcon } from 'lucide-react';
import { Ban, FileSpreadsheet } from 'lucide-react';
import { motion } from 'motion/react';
import { IconBadge } from '../ui/IconBadge';
import { Reveal } from '../ui/Reveal';
import { Title, Hl } from '../ui/Title';
import { useRevealed, useSlideState } from '../../hooks/useSlideState';

export interface Rule { icon: LucideIcon; name: string; use: string; text: string; featured?: boolean }
/** `avoid`: aviso em vermelho ao lado do lema; vazio = não aparece. */
export interface RulesData { eyebrow: string; title: [string, string]; rules: Rule[]; avoid?: string; motto: string }

/** Três canais, cada um com seu papel; arquivo “pula” do chat para o SharePoint (passo 1). */
export function RulesLayout({ d }: { d: RulesData }) {
  const { print } = useSlideState();
  const moved = useRevealed(1);
  return (
    <div style={{ position: 'absolute', inset: '170px 96px 120px', display: 'flex', flexDirection: 'column' }}>
      <Title eyebrow={d.eyebrow}>{d.title[0]} <Hl>{d.title[1]}</Hl></Title>

      <div style={{ position: 'relative', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 36, marginTop: 48, flex: 1 }}>
        {d.rules.map((r, i) => (
          <Reveal key={r.name} delay={0.15 + i * 0.1} from="up">
            <div style={{
              position: 'relative', overflow: 'hidden', height: '100%', borderRadius: 'var(--radius-lg)', padding: '38px 40px', display: 'flex', flexDirection: 'column',
              background: r.featured ? 'var(--c-green-900)' : '#fff', color: r.featured ? '#fff' : 'var(--c-ink)', boxShadow: 'var(--shadow-card)',
            }}>
              <r.icon aria-hidden size={240} strokeWidth={1} style={{ position: 'absolute', right: -30, bottom: -40, color: r.featured ? 'var(--ws-selection)' : 'var(--ws-action)', opacity: r.featured ? 0.1 : 0.06 }} />
              <IconBadge icon={r.icon} tone={r.featured ? 'lime' : 'green'} size={84} />
              <span style={{ marginTop: 28, fontSize: 'var(--fs-caption)', fontWeight: 600, letterSpacing: '.1em', textTransform: 'uppercase', color: r.featured ? 'var(--c-lime)' : 'var(--c-green-600)' }}>{r.use}</span>
              <span style={{ marginTop: 6, fontSize: 52, fontWeight: 700, letterSpacing: '-0.02em', color: r.featured ? '#fff' : 'var(--ws-text)' }}>{r.name}</span>
              <p style={{ margin: '18px 0 0', fontSize: 34, lineHeight: 1.3, position: 'relative', color: r.featured ? 'rgba(255,255,255,0.88)' : 'var(--c-ink-soft)' }}>{r.text}</p>
            </div>
          </Reveal>
        ))}
        {/* arquivo pesado: sai do chat (coluna 2) e vai para o SharePoint (coluna 3) */}
        <motion.div
          aria-hidden
          style={{ position: 'absolute', top: 40, zIndex: 4 }}
          initial={print ? false : { left: '58%', opacity: 0 }}
          animate={moved ? { left: ['58%', '76%', '90%'], top: [40, -30, 40], opacity: 1 } : { left: '58%', top: 40, opacity: 1 }}
          transition={{ duration: 1.1, ease: 'easeInOut', delay: moved ? 0 : 0.8 }}
        >
          <span style={{ width: 76, height: 76, borderRadius: 10, background: 'var(--ws-primary)', color: '#fff', display: 'grid', placeItems: 'center', boxShadow: 'var(--shadow-card)' }}>
            <FileSpreadsheet size={40} />
          </span>
        </motion.div>
      </div>

      <div style={{ display: 'flex', gap: 24, marginTop: 30, alignItems: 'stretch' }}>
        {d.avoid && (
          <Reveal at={1} from="left" style={{ flex: 'none' }}>
            <div style={{ height: '100%', display: 'flex', alignItems: 'center', gap: 16, padding: '20px 28px', borderRadius: 'var(--radius-md)', background: 'var(--c-danger-tint)', color: '#9b2c26', fontSize: 'var(--fs-body)', fontWeight: 600 }}>
              <Ban size={32} /> {d.avoid}
            </div>
          </Reveal>
        )}
        <Reveal at={2} from="right" style={{ flex: 1 }}>
          <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px 28px', borderRadius: 'var(--radius-md)', background: 'var(--ws-action)', color: '#fff', fontSize: 32, fontWeight: 600 }}>
            {d.motto}
          </div>
        </Reveal>
      </div>
    </div>
  );
}
