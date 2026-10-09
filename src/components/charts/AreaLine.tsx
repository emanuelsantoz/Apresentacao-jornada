import { scaleLinear, scalePoint } from 'd3-scale';
import { area, curveLinear, line } from 'd3-shape';
import { motion } from 'motion/react';
import { useState } from 'react';
import { useSlideState } from '../../hooks/useSlideState';

interface Props {
  data: { label: string; value: number }[];
  width: number;
  height: number;
  color: string;
  /** destaca o ponto máximo com rótulo direto */
  markMax?: boolean;
}

/** Linha com área suave (como no painel do BWS). Linha se desenha; hover com guia + valor. */
export function AreaLine({ data, width, height, color, markMax = true }: Props) {
  const { print } = useSlideState();
  const [hover, setHover] = useState<number | null>(null);
  const m = { t: 40, r: 24, b: 46, l: 50 };
  const iw = width - m.l - m.r;
  const ih = height - m.t - m.b;
  const x = scalePoint<string>().domain(data.map((d) => d.label)).range([0, iw]);
  const max = Math.max(...data.map((d) => d.value));
  const y = scaleLinear().domain([0, max]).nice(4).range([ih, 0]);
  const pts = data.map((d) => [x(d.label)!, y(d.value)] as [number, number]);
  const pathLine = line().curve(curveLinear)(pts)!;
  const pathArea = area().curve(curveLinear).y0(ih)(pts)!;
  const iMax = data.findIndex((d) => d.value === max);
  const step = x.step();

  return (
    <svg width={width} height={height} style={{ overflow: 'visible', fontFamily: 'var(--font-brand)' }}>
      <g transform={`translate(${m.l},${m.t})`}>
        {y.ticks(4).map((t) => (
          <g key={t} transform={`translate(0,${y(t)})`}>
            <line x2={iw} stroke="var(--c-line)" strokeDasharray="5 6" />
            <text x={-14} dy="0.35em" textAnchor="end" fontSize={19} fill="var(--c-ink-soft)" className="num">{t}</text>
          </g>
        ))}
        {data.map((d, i) => i % 2 === 0 && (
          <text key={d.label} x={x(d.label)} y={ih + 32} textAnchor="middle" fontSize={17} fill="var(--c-ink-soft)" className="num">{d.label}</text>
        ))}
        <motion.path d={pathArea} fill="var(--ws-selection)" initial={print ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 1 }} />
        <motion.path
          d={pathLine} fill="none" stroke={color} strokeWidth={3} strokeLinejoin="round" strokeLinecap="round"
          initial={print ? false : { pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.6, ease: 'easeInOut', delay: 0.3 }}
        />
        {markMax && (
          <motion.g initial={print ? false : { opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.8 }}>
            <circle cx={pts[iMax][0]} cy={pts[iMax][1]} r={9} fill={color} stroke="#fff" strokeWidth={3} />
            <rect x={pts[iMax][0] - 120} y={pts[iMax][1] - 18} width={100} height={36} rx={8} fill="var(--c-green-900)" />
            <text x={pts[iMax][0] - 70} y={pts[iMax][1] + 7} textAnchor="middle" fontSize={20} fontWeight={700} fill="#fff" className="num">pico {max}</text>
          </motion.g>
        )}
        {hover !== null && (
          <g>
            <line x1={pts[hover][0]} x2={pts[hover][0]} y1={0} y2={ih} stroke="var(--c-ink-soft)" strokeOpacity={0.4} />
            <circle cx={pts[hover][0]} cy={pts[hover][1]} r={8} fill={color} stroke="#fff" strokeWidth={3} />
            <g transform={`translate(${Math.min(Math.max(pts[hover][0], 60), iw - 60)},${pts[hover][1] - 26})`}>
              <rect x={-62} y={-38} width={124} height={40} rx={8} fill="#fff" stroke="var(--c-line)" />
              <text textAnchor="middle" y={-12} fontSize={19} fill="var(--c-ink)" className="num">
                <tspan fontWeight={400}>{data[hover].label} · </tspan><tspan fontWeight={700}>{data[hover].value}</tspan>
              </text>
            </g>
          </g>
        )}
        {data.map((d, i) => (
          <rect key={d.label} x={pts[i][0] - step / 2} y={0} width={step} height={ih} fill="transparent" onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)} />
        ))}
      </g>
    </svg>
  );
}
