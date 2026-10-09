import type { LucideIcon } from 'lucide-react';
import { motion } from 'motion/react';
import { Tablet } from '../devices/Devices';
import { Screen, type ScreenSpec } from '../devices/Screen';
import { Reveal } from '../ui/Reveal';
import { IconBadge } from '../ui/IconBadge';
import { Title } from '../ui/Title';
import { useSlideState } from '../../hooks/useSlideState';
import { motionTokens } from '../../theme/tokens';

type Tone = 'green' | 'alert' | 'success' | 'info' | 'danger';

export interface DuoScreen {
  tag: string; // "Tela 1"
  name: string; // "Início"
  tone: Tone;
  icon: LucideIcon;
  bullets: string[];
  screen: ScreenSpec;
  /** Caixa flutuante (z-20) que destaca a informação principal desta tela. Sem título e texto, não aparece. */
  callout?: { icon: LucideIcon; title: string; text: string };
  /** Ponto pulsante sobre a tela, em % da área da tela do tablet. */
  spot?: { x: number; y: number };
}

export interface TabletDuoData { eyebrow: string; title: string; screens: [DuoScreen, DuoScreen] }

const toneColor: Record<Tone, string> = {
  green: 'var(--c-green-600)', success: 'var(--c-success)', alert: 'var(--c-alert)', info: 'var(--c-info)', danger: 'var(--c-danger)',
};
const toneBadge: Record<Tone, 'green' | 'alert' | 'success' | 'info' | 'danger'> = {
  green: 'green', success: 'success', alert: 'alert', info: 'info', danger: 'danger',
};

// Posições no palco: tablet da frente e de trás (sobreposição por z-index).
const W = 800;
const FRONT = { x: 850, y: 300, scale: 1, opacity: 1 };
const BACK = { x: 1225, y: 140, scale: 0.78, opacity: 0.55 };
const SCREEN_INSET = W * 0.035; // espessura da moldura do tablet

/**
 * Duas telas em tablets sobrepostos. Passo 0 = Tela A na frente; passo 1 = Tela B vem para frente.
 * Camadas: painel (z0) → tablet de trás (z1) → tablet da frente (z2) → ponto de foco (z3) → caixa de destaque (z20).
 */
export function TabletDuoLayout({ d }: { d: TabletDuoData }) {
  const { step, print } = useSlideState();
  const active = print ? 1 : Math.min(step, 1);
  const cur = d.screens[active];

  return (
    <>
      {/* painel escuro dos dispositivos (ref. 2) */}
      <div style={{ position: 'absolute', left: 780, top: 0, right: 0, bottom: 0, borderRadius: '16px 0 0 16px', overflow: 'hidden', background: 'var(--c-green-950)', zIndex: 0 }}>
      </div>

      <div style={{ position: 'absolute', left: 96, top: 170, width: 620 }}>
        <Title eyebrow={d.eyebrow} size={64}>{d.title}</Title>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 22, marginTop: 44 }}>
          {d.screens.map((s, i) => {
            const on = i === active;
            return (
              <Reveal key={s.tag} at={i} delay={0.15} from="left">
                <motion.div
                  animate={{ opacity: on ? 1 : 0.5 }}
                  style={{
                    position: 'relative', padding: '28px 30px 26px 36px', borderRadius: 'var(--radius-md)', overflow: 'hidden',
                    background: on ? '#fff' : 'transparent', border: '1px solid var(--ws-border)',
                    boxShadow: on ? 'var(--shadow-card)' : 'none',
                  }}
                >
                  <span style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 4, background: on ? 'var(--ws-action)' : 'transparent' }} />
                  <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginBottom: 14 }}>
                    <IconBadge icon={s.icon} tone={toneBadge[s.tone]} size={56} />
                    <span style={{ fontSize: 'var(--fs-label)', fontWeight: 600, color: toneColor[s.tone], textTransform: 'uppercase', letterSpacing: '.08em' }}>{s.tag}</span>
                    <span style={{ fontSize: 36, fontWeight: 700, color: 'var(--ws-text)' }}>{s.name}</span>
                  </div>
                  {s.bullets.map((b) => (
                    <p key={b} style={{ margin: '8px 0 0 74px', fontSize: 27, lineHeight: 1.3, color: 'var(--c-ink)' }}>{b}</p>
                  ))}
                </motion.div>
              </Reveal>
            );
          })}
        </div>
      </div>

      {d.screens.map((s, i) => {
        const front = i === active;
        const pos = front ? FRONT : BACK;
        return (
          <motion.div
            key={s.tag}
            style={{ position: 'absolute', left: 0, top: 0, transformOrigin: '0 0', zIndex: front ? 2 : 1 }}
            initial={print ? false : { x: pos.x + 120, y: pos.y, scale: pos.scale, opacity: 0 }}
            animate={{ x: pos.x, y: pos.y, scale: pos.scale, opacity: pos.opacity }}
            transition={{ duration: 0.7, ease: motionTokens.ease }}
          >
            <Tablet width={W}>
              <Screen spec={s.screen} />
              {front && s.spot && (
                <motion.span
                  key={`spot-${active}`}
                  aria-hidden
                  style={{
                    position: 'absolute', left: `${s.spot.x}%`, top: `${s.spot.y}%`, width: 70, height: 70, marginLeft: -35, marginTop: -35,
                    borderRadius: 70, border: `5px solid ${toneColor[s.tone]}`, zIndex: 3, pointerEvents: 'none',
                  }}
                  initial={print ? false : { scale: 0.4, opacity: 0 }}
                  animate={print ? { scale: 1, opacity: 1 } : { scale: [0.6, 1.25, 1], opacity: [0, 1, 0.9] }}
                  transition={{ duration: 1.2, delay: 0.5, repeat: print ? 0 : Infinity, repeatDelay: 1.6 }}
                />
              )}
            </Tablet>
          </motion.div>
        );
      })}

      {/* caixa de destaque sobreposta (z-20), cruzando painel e tablet */}
      {cur.callout && (cur.callout.title || cur.callout.text) && <motion.div
        key={`callout-${active}`}
        style={{
          position: 'absolute', left: 740, top: 790 - SCREEN_INSET, width: 470, zIndex: 20, background: '#fff', borderRadius: 'var(--radius-md)',
          padding: '26px 28px', boxShadow: 'var(--shadow-pop)', border: '1px solid var(--ws-border)',
        }}
        initial={print ? false : { opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.35, ease: motionTokens.ease }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: cur.callout.text ? 10 : 0 }}>
          <IconBadge icon={cur.callout.icon} tone={toneBadge[cur.tone]} size={52} />
          <span style={{ fontSize: 30, fontWeight: 700, color: 'var(--ws-text)' }}>{cur.callout.title}</span>
        </div>
        {cur.callout.text && <p style={{ margin: 0, fontSize: 25, lineHeight: 1.3, color: 'var(--c-ink-soft)' }}>{cur.callout.text}</p>}
      </motion.div>}
    </>
  );
}
