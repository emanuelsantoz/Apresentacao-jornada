import { ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import { Laptop, Tablet } from '../devices/Devices';
import { Screen, type ScreenSpec } from '../devices/Screen';
import { BrandMark } from '../stage/BrandMark';
import { Reveal } from '../ui/Reveal';
import { useSlideState } from '../../hooks/useSlideState';

export interface CoverData {
  eyebrow: string;
  titleA: string;
  titleB: string;
  subtitle: string;
  meta: string;
  tablet: ScreenSpec;
  laptop: ScreenSpec;
}

/** Capa: título display à esquerda, notebook + tablet sobrepostos à direita. */
export function CoverLayout({ d }: { d: CoverData }) {
  const { print } = useSlideState();
  return (
    <>
      <div style={{ position: 'absolute', left: 120, top: 110 }}>
        <Reveal><BrandMark dark height={56} /></Reveal>
      </div>
      <div style={{ position: 'absolute', left: 120, top: 300, width: 880 }}>
        <Reveal>
          <div style={{ fontSize: 'var(--fs-label)', fontWeight: 600, letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--c-lime)', marginBottom: 34 }}>{d.eyebrow}</div>
        </Reveal>
        <Reveal delay={0.08}>
          <h1 style={{ margin: 0, fontSize: 124, lineHeight: 0.98, fontWeight: 700, letterSpacing: '-0.035em' }}>
            {d.titleA}
            <br />
            <span style={{ color: 'var(--c-lime)' }}>&amp;</span> {d.titleB}
          </h1>
        </Reveal>
        <Reveal delay={0.18}>
          <p style={{ margin: '40px 0 0', fontSize: 38, lineHeight: 1.3, color: 'rgba(255,255,255,0.82)', fontWeight: 400 }}>{d.subtitle}</p>
        </Reveal>
        <Reveal delay={0.3}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 22, marginTop: 64 }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 14, padding: '16px 18px 16px 30px', borderRadius: 8, border: '1.5px solid var(--ws-chrome-2)', background: 'var(--ws-chrome-2)', fontSize: 'var(--fs-label)', fontWeight: 500 }}>
              Iniciar treinamento
              <span style={{ width: 44, height: 44, borderRadius: 6, background: 'var(--ws-action)', color: '#fff', display: 'grid', placeItems: 'center' }}><ArrowRight size={24} /></span>
            </span>
            <span style={{ fontSize: 'var(--fs-caption)', color: 'rgba(255,255,255,0.6)' }}>{d.meta}</span>
          </div>
        </Reveal>
      </div>

      <motion.div
        style={{ position: 'absolute', left: 1020, top: 170 }}
        initial={print ? false : { opacity: 0, x: 80 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
      >
        <Laptop width={860}><Screen spec={d.laptop} /></Laptop>
      </motion.div>
      <motion.div
        style={{ position: 'absolute', left: 1180, top: 560, zIndex: 3 }}
        initial={print ? false : { opacity: 0, y: 80 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.45 }}
      >
        <Tablet width={600} ><Screen spec={d.tablet} /></Tablet>
      </motion.div>
    </>
  );
}
