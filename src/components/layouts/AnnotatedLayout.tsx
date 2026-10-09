import type { LucideIcon } from 'lucide-react';
import { motion } from 'motion/react';
import { useEffect, useRef } from 'react';
import { motionTokens } from '../../theme/tokens';
import { Laptop } from '../devices/Devices';
import { Screen, type ScreenSpec } from '../devices/Screen';
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
export interface AnnotatedData {
  eyebrow: string;
  title: [string, string?];
  screen: ScreenSpec;
  items: Annotation[];
  /** cursor de mouse que vai até o marcador do passo atual e “clica” (padrão: sim) */
  cursor?: boolean;
}

/** Ponta do cursor: um pouco abaixo/à direita do centro do marcador, para o número continuar visível. */
const TIP = 16;
const MOVE = 0.9;

/** Cursor de mouse que acompanha o passo: desliza até o marcador e clica (afunda + onda). */
function ClickCursor({ pin, step }: { pin: { x: number; y: number }; step: number }) {
  const first = useRef(true);
  useEffect(() => { first.current = false; }, []);
  // na entrada do slide espera notebook e marcadores aparecerem
  const arrive = (first.current ? 1.1 : 0.1) + MOVE;
  return (
    <motion.div
      data-no-edit
      aria-hidden
      style={{ position: 'absolute', width: 0, height: 0, zIndex: 6, pointerEvents: 'none' }}
      initial={{ left: '94%', top: '112%', opacity: 0 }}
      animate={{ left: `${pin.x}%`, top: `${pin.y}%`, opacity: 1 }}
      transition={{ duration: MOVE, ease: motionTokens.ease, delay: arrive - MOVE }}
    >
      <motion.span
        key={`onda-${step}`}
        style={{ position: 'absolute', left: TIP - 26, top: TIP - 26, width: 52, height: 52, borderRadius: 52, border: '3px solid #fff', boxShadow: '0 0 0 3px rgba(18,134,79,0.55)' }}
        initial={{ scale: 0.2, opacity: 0 }}
        animate={{ scale: [0.2, 1.5], opacity: [0.95, 0] }}
        transition={{ duration: 0.6, delay: arrive + 0.08, ease: 'easeOut' }}
      />
      <motion.svg
        key={`clique-${step}`}
        width={46} height={54} viewBox="0 0 24 28"
        style={{ position: 'absolute', left: TIP - 5.75, top: TIP - 3.85, overflow: 'visible', filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.35))', transformOrigin: '12% 7%' }}
        animate={{ scale: [1, 0.82, 1] }}
        transition={{ duration: 0.32, delay: arrive, times: [0, 0.4, 1] }}
      >
        <path d="M3 2 L3 22.5 L8.3 17.4 L11.8 25.6 L15.6 24 L12.1 15.9 L19.6 15.9 Z" fill="#fff" stroke="#0B2E1F" strokeWidth={1.6} strokeLinejoin="round" />
      </motion.svg>
    </motion.div>
  );
}

/**
 * Lista numerada (ref. 1 · “The Problem”) ligada a marcadores sobre a tela do notebook.
 * Cada passo destaca um item e o marcador correspondente; um cursor vai até ele e clica.
 */
export function AnnotatedLayout({ d }: { d: AnnotatedData }) {
  const { step, print } = useSlideState();
  const active = print ? -1 : step;
  const cursorAt = active >= 0 ? d.items[Math.min(active, d.items.length - 1)] : undefined;
  return (
    <>
      <div style={{ position: 'absolute', left: 820, top: 0, right: 0, bottom: 0, borderRadius: '16px 0 0 16px', overflow: 'hidden', background: 'var(--c-green-950)' }}>
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
                  <span className="num" style={{ width: 58, height: 58, borderRadius: 58, flex: 'none', display: 'grid', placeItems: 'center', fontSize: 26, fontWeight: 700, background: on ? 'var(--ws-action)' : 'transparent', color: on ? '#fff' : 'var(--ws-action)', border: '2px solid var(--ws-action)' }}>{it.n}</span>
                  <Icon size={36} strokeWidth={1.75} color="var(--c-green-700)" style={{ flex: 'none' }} />
                  <div>
                    <div style={{ fontSize: 34, fontWeight: 700, color: 'var(--ws-text)' }}>{it.title}</div>
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
                  background: on ? 'var(--ws-action)' : 'var(--ws-chrome)', color: '#fff', border: '3px solid #fff',
                  boxShadow: on ? '0 0 0 8px rgba(18,134,79,0.3)' : 'var(--shadow-pop)',
                }}
                initial={print ? false : { scale: 0 }}
                animate={{ scale: on && active === i ? 1.15 : 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 18, delay: print ? 0 : 0.5 + i * 0.1 }}
              >
                {it.n}
              </motion.span>
            );
          })}
          {d.cursor !== false && cursorAt && <ClickCursor pin={cursorAt.pin} step={active} />}
        </Laptop>
      </motion.div>
    </>
  );
}
