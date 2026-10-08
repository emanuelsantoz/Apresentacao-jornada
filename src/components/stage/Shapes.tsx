import { motion } from 'motion/react';
import { useSlideState } from '../../hooks/useSlideState';

/** Triângulo de cantos arredondados (linguagem de formas do bg_login). */
export function RoundedTriangle({ size, fill, stroke, strokeWidth = 6 }: { size: number; fill?: string; stroke?: string; strokeWidth?: number }) {
  const s = 100;
  return (
    <svg width={size} height={size} viewBox={`-10 -10 ${s + 20} ${s + 20}`} aria-hidden>
      <path
        d={`M${s / 2} 6 L${s - 4} ${s - 10} L4 ${s - 10} Z`}
        fill={fill ?? 'none'}
        stroke={stroke ?? fill}
        strokeWidth={fill && !stroke ? 14 : strokeWidth}
        strokeLinejoin="round"
      />
    </svg>
  );
}

interface ShapeSpec { x: number; y: number; size: number; rot: number; kind: 'outline' | 'fill' | 'outlineLime'; drift: number }

const presets: Record<string, ShapeSpec[]> = {
  a: [
    { x: 1580, y: -60, size: 360, rot: 18, kind: 'outline', drift: 18 },
    { x: 1760, y: 720, size: 220, rot: -12, kind: 'fill', drift: 14 },
    { x: -80, y: 820, size: 260, rot: 40, kind: 'outlineLime', drift: 20 },
  ],
  b: [
    { x: 1700, y: 60, size: 200, rot: -20, kind: 'fill', drift: 16 },
    { x: 1480, y: 820, size: 300, rot: 10, kind: 'outline', drift: 22 },
  ],
  c: [
    { x: -100, y: -80, size: 300, rot: 200, kind: 'outline', drift: 18 },
    { x: 1740, y: 820, size: 240, rot: 30, kind: 'outlineLime', drift: 16 },
  ],
};

/** Formas decorativas flutuando devagar. Nunca competem com o conteúdo (opacidade baixa). */
export function Shapes({ preset = 'a', dark }: { preset?: keyof typeof presets; dark?: boolean }) {
  const { print } = useSlideState();
  const colors = {
    outline: dark ? 'rgba(255,255,255,0.14)' : 'rgba(40,151,46,0.22)',
    fill: dark ? 'rgba(40,151,46,0.35)' : 'rgba(40,151,46,0.12)',
    outlineLime: dark ? 'rgba(175,191,48,0.4)' : 'rgba(175,191,48,0.5)',
  };
  return (
    <div aria-hidden style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
      {presets[preset].map((s, i) => (
        <motion.div
          key={i}
          style={{ position: 'absolute', left: s.x, top: s.y, rotate: s.rot }}
          animate={print ? undefined : { y: [0, -s.drift, 0], rotate: [s.rot, s.rot + 6, s.rot] }}
          transition={{ duration: 12 + i * 3, repeat: Infinity, ease: 'easeInOut' }}
        >
          {s.kind === 'fill' ? (
            <RoundedTriangle size={s.size} fill={colors.fill} />
          ) : (
            <RoundedTriangle size={s.size} stroke={s.kind === 'outline' ? colors.outline : colors.outlineLime} strokeWidth={5} />
          )}
        </motion.div>
      ))}
    </div>
  );
}

/** Fundo “aurora”: manchas verdes desfocadas em movimento lento sobre verde profundo. */
export function Aurora({ variant = 0 }: { variant?: number }) {
  const { print } = useSlideState();
  const blobs = [
    { x: variant ? 1100 : -200, y: variant ? -300 : 400, w: 1100, c: 'rgba(40,151,46,0.55)' },
    { x: variant ? -300 : 1200, y: variant ? 500 : -250, w: 900, c: 'rgba(175,191,48,0.28)' },
    { x: 700, y: 700, w: 800, c: 'rgba(35,119,91,0.45)' },
  ];
  return (
    <div aria-hidden style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
      {blobs.map((b, i) => (
        <motion.div
          key={i}
          style={{
            position: 'absolute', left: b.x, top: b.y, width: b.w, height: b.w, borderRadius: '50%',
            background: `radial-gradient(circle, ${b.c} 0%, transparent 65%)`, filter: 'blur(30px)',
          }}
          animate={print ? undefined : { x: [0, 60 - i * 40, 0], y: [0, 40 + i * 10, 0], scale: [1, 1.08, 1] }}
          transition={{ duration: 16 + i * 4, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(rgba(255,255,255,0.06) 1.5px, transparent 1.5px)', backgroundSize: '36px 36px', maskImage: 'linear-gradient(90deg, #000 0%, transparent 60%)' }} />
    </div>
  );
}
