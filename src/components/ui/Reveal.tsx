import { motion } from 'motion/react';
import type { CSSProperties, ReactNode } from 'react';
import { useSlideState } from '../../hooks/useSlideState';
import { motionTokens } from '../../theme/tokens';

interface Props {
  children: ReactNode;
  /** Passo em que o elemento aparece (0 = ao entrar no slide). */
  at?: number;
  /** Atraso extra em segundos (para stagger manual). */
  delay?: number;
  /** Direção de entrada. */
  from?: 'up' | 'down' | 'left' | 'right' | 'none' | 'scale';
  /** Quando já passou do passo, esmaece (útil em “antes × depois”). */
  dimAfter?: number;
  style?: CSSProperties;
  className?: string;
}

const offset = { up: { y: 36 }, down: { y: -36 }, left: { x: -48 }, right: { x: 48 }, none: {}, scale: { scale: 0.92 } };

/** Entrada animada controlada pelo passo do slide. No modo impressão, renderiza o estado final. */
export function Reveal({ children, at = 0, delay = 0, from = 'up', dimAfter, style, className }: Props) {
  const { step, print } = useSlideState();
  const shown = print || step >= at;
  const dimmed = !print && dimAfter !== undefined && step >= dimAfter;
  return (
    <motion.div
      className={className}
      style={style}
      initial={print ? false : { opacity: 0, ...offset[from] }}
      animate={shown ? { opacity: dimmed ? 0.35 : 1, x: 0, y: 0, scale: 1 } : { opacity: 0, ...offset[from] }}
      transition={{ duration: motionTokens.reveal, ease: motionTokens.ease, delay: shown ? delay : 0 }}
    >
      {children}
    </motion.div>
  );
}
