import type { LucideIcon } from 'lucide-react';
import { motion } from 'motion/react';
import { IconBadge } from '../ui/IconBadge';
import { Reveal } from '../ui/Reveal';
import { Title, Hl } from '../ui/Title';
import { useSlideState } from '../../hooks/useSlideState';

type Tone = 'info' | 'success' | 'alert' | 'green' | 'returned';
export interface StatusItem { name: string; icon: LucideIcon; tone: Tone; text: string; who: string }
export interface StatusData { eyebrow: string; title: [string, string]; items: StatusItem[] }

const tints: Record<Tone, string> = { info: 'var(--c-info-tint)', success: 'var(--c-success-tint)', alert: 'var(--c-alert-tint)', green: 'var(--c-success-tint)', returned: 'var(--c-returned-tint)' };
const text: Record<Tone, string> = { info: 'var(--c-info)', success: 'var(--ws-primary)', alert: 'var(--c-alert)', green: 'var(--ws-chrome)', returned: 'var(--c-returned)' };

// Linha do tempo da animação (segundos)
const FILL_START = 0.4; // a linha começa a crescer
const FILL_DURATION = 2.4; // tempo até chegar à última estação

/**
 * Legenda de status como jornada: trilho com 4 estações (ref. 3 · fluxos), cada uma com badge tint.
 *
 * Camadas: trilho (z0, ATRÁS) → estações/ícones (z1, NA FRENTE).
 * Animação: a linha cresce da 1ª à última estação; cada estação aparece quando a linha chega nela
 * e ganha um anel; depois, pulsos percorrem o trilho em loop (fluxo contínuo).
 */
export function StatusLayout({ d }: { d: StatusData }) {
  const { print } = useSlideState();
  const n = d.items.length;
  const arrive = (i: number) => FILL_START + (FILL_DURATION * i) / Math.max(1, n - 1);

  return (
    <div style={{ position: 'absolute', inset: '170px 96px 130px', display: 'flex', flexDirection: 'column' }}>
      <Title eyebrow={d.eyebrow}>{d.title[0]} <Hl>{d.title[1]}</Hl></Title>

      <div style={{ position: 'relative', marginTop: 70, flex: 1 }}>
        {/* trilho: atrás dos ícones */}
        <div aria-hidden style={{ position: 'absolute', zIndex: 0, left: `${50 / n}%`, right: `${50 / n}%`, top: 58, height: 6, borderRadius: 6, background: 'var(--ws-border)' }}>
          <motion.div
            style={{ height: '100%', borderRadius: 6, background: 'var(--ws-action)' }}
            initial={print ? false : { width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ duration: FILL_DURATION, ease: 'linear', delay: FILL_START }}
          />
          {!print && [0, 1, 2].map((k) => (
            <motion.span
              key={k}
              style={{
                position: 'absolute', top: '50%', width: 18, height: 18, marginTop: -9, marginLeft: -9, borderRadius: 18,
                background: 'var(--ws-action)', boxShadow: '0 0 0 6px rgba(18,134,79,0.18)',
              }}
              initial={{ left: '0%', opacity: 0 }}
              animate={{ left: ['0%', '100%'], opacity: [0, 1, 1, 0] }}
              transition={{ duration: 3.2, ease: 'linear', repeat: Infinity, delay: FILL_START + FILL_DURATION + k * 1.07 }}
            />
          ))}
        </div>

        <div style={{ position: 'relative', zIndex: 1, display: 'grid', gridTemplateColumns: `repeat(${n}, 1fr)`, gap: 32, height: '100%' }}>
          {d.items.map((s, i) => (
            <div key={s.name} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              {/* estação: aparece quando a linha chega */}
              <motion.div
                style={{ position: 'relative', borderRadius: 122 }}
                initial={print ? false : { scale: 0.6, opacity: 0, boxShadow: '0 0 0 0px rgba(18,134,79,0)' }}
                animate={{ scale: 1, opacity: 1, boxShadow: '0 0 0 8px rgba(18,134,79,0.16)' }}
                transition={{ duration: 0.45, delay: Math.max(0, arrive(i) - 0.15), ease: [0.22, 1, 0.36, 1] }}
              >
                <IconBadge icon={s.icon} tone={s.tone === 'green' ? 'dark' : s.tone} size={122} radius={122} style={{ border: '6px solid var(--ws-canvas)' }} />
              </motion.div>
              <Reveal delay={arrive(i)} from="up" style={{ marginTop: 34, width: '100%', flex: 1, display: 'flex' }}>
                <div style={{ width: '100%', background: '#fff', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-card)', padding: '30px 30px', display: 'flex', flexDirection: 'column' }}>
                  <span style={{ alignSelf: 'flex-start', padding: '8px 18px', borderRadius: 6, background: tints[s.tone], color: text[s.tone], fontSize: 30, fontWeight: 700 }}>{s.name}</span>
                  <p style={{ margin: '22px 0 0', fontSize: 'var(--fs-body)', lineHeight: 1.3, color: 'var(--c-ink)' }}>{s.text}</p>
                  <span style={{ flex: 1 }} />
                  <span style={{ fontSize: 'var(--fs-caption)', color: 'var(--c-ink-soft)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.06em' }}>{s.who}</span>
                </div>
              </Reveal>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
