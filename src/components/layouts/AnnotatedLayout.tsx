import type { LucideIcon } from 'lucide-react';
import { motion } from 'motion/react';
import { Laptop } from '../devices/Devices';
import { Screen, type ScreenSpec } from '../devices/Screen';
import { Aurora } from '../stage/Shapes';
import { Reveal } from '../ui/Reveal';
import { Title, Hl } from '../ui/Title';
import { useSlideState } from '../../hooks/useSlideState';

export interface Annotation {
  n: string;
  icon: LucideIcon;
  title: string;
  text: string;
  /** posição do marcador sobre a tela, em % da área da tela */
  pin: { x: number; y: number };
}
export interface AnnotatedData { eyebrow: string; title: [string, string?]; screen: ScreenSpec; items: Annotation[] }

/**
 * Lista numerada (ref. 1 · “The Problem”) ligada a marcadores sobre a tela do notebook.
 * Cada passo destaca um item e o marcador correspondente.
 */
export function AnnotatedLayout({ d }: { d: AnnotatedData }) {
  const { step, print } = useSlideState();
  const active = print ? -1 : step;
  return (
    <>
      <div style={{ position: 'absolute', left: 820, top: 0, right: 0, bottom: 0, borderRadius: '56px 0 0 56px', overflow: 'hidden', background: 'var(--c-green-950)' }}>
        <Aurora variant={1} />
      </div>

      <div style={{ position: 'absolute', left: 96, top: 170, width: 660 }}>
        <Title eyebrow={d.eyebrow} size={66}>{d.title[0]}{d.title[1] && <> <Hl>{d.title[1]}</Hl></>}</Title>
        <div style={{ marginTop: 40, display: 'flex', flexDirection: 'column' }}>
          {d.items.map((it, i) => {
            const on = active === -1 || active === i;
            const Icon = it.icon;
            return (
              <Reveal key={it.n} delay={0.15 + i * 0.07} from="left">
                <motion.div
                  animate={{ opacity: on ? 1 : 0.42 }}
                  style={{ display: 'flex', gap: 24, alignItems: 'center', padding: '20px 0', borderTop: i ? '1.5px solid var(--c-line)' : 'none' }}
                >
                  <span className="num" style={{ width: 58, height: 58, borderRadius: 58, flex: 'none', display: 'grid', placeItems: 'center', fontSize: 26, fontWeight: 700, background: on ? 'var(--c-green-600)' : 'transparent', color: on ? '#fff' : 'var(--c-green-600)', border: '2.5px solid var(--c-green-600)' }}>{it.n}</span>
                  <Icon size={36} strokeWidth={1.75} color="var(--c-green-700)" style={{ flex: 'none' }} />
                  <div>
                    <div style={{ fontSize: 34, fontWeight: 700, color: 'var(--c-green-900)' }}>{it.title}</div>
                    <div style={{ fontSize: 26, color: 'var(--c-ink-soft)', marginTop: 4, lineHeight: 1.3 }}>{it.text}</div>
                  </div>
                </motion.div>
              </Reveal>
            );
          })}
        </div>
      </div>

      <motion.div
        style={{ position: 'absolute', left: 870, top: 250 }}
        initial={print ? false : { opacity: 0, x: 90 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      >
        <Laptop width={1000}>
          <Screen spec={d.screen} />
          {d.items.map((it, i) => {
            const on = active === -1 || active === i;
            return (
              <motion.span
                key={it.n}
                className="num"
                style={{
                  position: 'absolute', left: `${it.pin.x}%`, top: `${it.pin.y}%`, width: 54, height: 54, marginLeft: -27, marginTop: -27, zIndex: 5,
                  borderRadius: 54, display: 'grid', placeItems: 'center', fontSize: 24, fontWeight: 700,
                  background: on ? 'var(--c-lime)' : 'rgba(16,71,38,0.85)', color: on ? 'var(--c-green-900)' : '#fff',
                  boxShadow: on ? '0 0 0 10px rgba(175,191,48,0.35), 0 10px 24px -6px rgba(0,0,0,0.5)' : '0 6px 14px -4px rgba(0,0,0,0.4)',
                }}
                initial={print ? false : { scale: 0 }}
                animate={{ scale: on && active === i ? 1.15 : 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 18, delay: print ? 0 : 0.5 + i * 0.1 }}
              >
                {it.n}
              </motion.span>
            );
          })}
        </Laptop>
      </motion.div>
    </>
  );
}
