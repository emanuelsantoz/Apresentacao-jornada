import type { LucideIcon } from 'lucide-react';
import { motion } from 'motion/react';
import { Chip } from '../ui/Chip';
import { Reveal } from '../ui/Reveal';
import { BrandMark } from '../stage/BrandMark';
import { useSlideState } from '../../hooks/useSlideState';

export interface ModuleCoverData { chip: string; number: string; title: string; line: string; icon: LucideIcon; topics: string[] }

/** Capa de módulo: numeral gigante vazado (ref. 1) + título display. */
export function ModuleCoverLayout({ d }: { d: ModuleCoverData }) {
  const { print } = useSlideState();
  const Icon = d.icon;
  return (
    <>
      <div style={{ position: 'absolute', left: 120, top: 110 }}><BrandMark dark height={52} /></div>
      <motion.div
        aria-hidden
        className="num"
        style={{ position: 'absolute', right: -110, top: 60, fontSize: 900, fontWeight: 700, lineHeight: 0.9, letterSpacing: '-0.06em', color: 'transparent', WebkitTextStroke: '3px rgba(232,245,233,0.16)' }}
        initial={print ? false : { opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
      >
        {d.number}
      </motion.div>
      <div style={{ position: 'absolute', left: 120, top: 330, width: 1100 }}>
        <Reveal><Chip tone="lime">{d.chip}</Chip></Reveal>
        <Reveal delay={0.1}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 40, marginTop: 40 }}>
            <span style={{ width: 150, height: 150, borderRadius: 12, background: 'var(--ws-action)', border: 'none', display: 'grid', placeItems: 'center', color: '#fff' }}><Icon size={84} strokeWidth={1.5} /></span>
            <h1 style={{ margin: 0, fontSize: 168, lineHeight: 1, letterSpacing: '-0.04em', fontWeight: 700 }}>{d.title}</h1>
          </div>
        </Reveal>
        <Reveal delay={0.22}><p style={{ margin: '44px 0 0', fontSize: 44, lineHeight: 1.25, color: 'rgba(255,255,255,0.85)' }}>{d.line}</p></Reveal>
        <Reveal delay={0.34}>
          <div style={{ display: 'flex', gap: 14, marginTop: 50, flexWrap: 'wrap' }}>
            {d.topics.map((t) => <Chip key={t} tone="glass">{t}</Chip>)}
          </div>
        </Reveal>
      </div>
    </>
  );
}
