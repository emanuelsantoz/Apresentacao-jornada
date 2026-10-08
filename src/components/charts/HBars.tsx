import { scaleLinear } from 'd3-scale';
import { motion } from 'motion/react';
import { useState } from 'react';
import { useSlideState } from '../../hooks/useSlideState';

interface Props {
  data: { label: string; value: number }[];
  width: number;
  color: string;
  rowHeight?: number;
  labelWidth?: number;
  /** destaca a maior barra */
  highlightMax?: boolean;
  sort?: boolean;
}

/** Barras horizontais com rótulo à esquerda e valor direto na ponta (estilo painel BWS). */
export function HBars({ data, width, color, rowHeight = 48, labelWidth = 230, highlightMax = true, sort = true }: Props) {
  const { print } = useSlideState();
  const [hover, setHover] = useState<string | null>(null);
  const rows = sort ? [...data].sort((a, b) => b.value - a.value) : data;
  const max = Math.max(...rows.map((d) => d.value));
  const x = scaleLinear().domain([0, max]).range([0, width - labelWidth - 56]);
  return (
    <div>
      {rows.map((d, i) => {
        const top = highlightMax && d.value === max;
        const dim = hover !== null && hover !== d.label;
        return (
          <div
            key={d.label}
            onMouseEnter={() => setHover(d.label)}
            onMouseLeave={() => setHover(null)}
            style={{ height: rowHeight, display: 'flex', alignItems: 'center', gap: 14, opacity: dim ? 0.45 : 1, transition: 'opacity .2s' }}
          >
            <span style={{ width: labelWidth, flex: 'none', textAlign: 'right', fontSize: 21, color: 'var(--c-ink)', fontWeight: top ? 700 : 400, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{d.label}</span>
            <motion.span
              style={{ display: 'block', height: 20, borderRadius: '2px 4px 4px 2px', background: top ? 'var(--c-green-900)' : color }}
              initial={print ? false : { width: 0 }}
              animate={{ width: x(d.value) }}
              transition={{ duration: 0.9, delay: 0.3 + i * 0.06, ease: [0.22, 1, 0.36, 1] }}
            />
            <span className="num" style={{ fontSize: 21, fontWeight: 700, color: 'var(--c-green-900)' }}>{d.value}</span>
          </div>
        );
      })}
    </div>
  );
}
