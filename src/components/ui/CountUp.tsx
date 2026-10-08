import { animate } from 'motion/react';
import { useEffect, useState } from 'react';
import { useSlideState } from '../../hooks/useSlideState';

interface Props { value: number | null; decimals?: number; suffix?: string; prefix?: string }

/** Número que conta ao entrar no slide. `null` mostra “—” (dado ainda não informado). */
export function CountUp({ value, decimals = 0, suffix = '', prefix = '' }: Props) {
  const { print, active } = useSlideState();
  const [n, setN] = useState(print || value === null ? value ?? 0 : 0);
  useEffect(() => {
    if (value === null) return;
    if (print) { setN(value); return; }
    if (!active) return;
    const c = animate(0, value, { duration: 1.4, ease: [0.22, 1, 0.36, 1], onUpdate: setN });
    return () => c.stop();
  }, [value, print, active]);
  if (value === null) return <span className="num">—</span>;
  return (
    <span className="num">
      {prefix}
      {n.toLocaleString('pt-BR', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}
      {suffix}
    </span>
  );
}
