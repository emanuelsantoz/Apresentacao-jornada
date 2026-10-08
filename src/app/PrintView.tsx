import { MotionConfig } from 'motion/react';
import { useEffect } from 'react';
import type { SlideDef } from '../types/slide';
import { SlideView } from '../components/stage/SlideView';
import { stage } from '../theme/tokens';

/** Rota ?print=1 — todos os slides empilhados, 1920x1080, estado final, sem animação (para PDF). */
export function PrintView({ slides }: { slides: SlideDef[] }) {
  useEffect(() => {
    document.documentElement.classList.add('print-mode');
    document.body.classList.add('print-mode');
  }, []);
  return (
    <MotionConfig reducedMotion="always" transition={{ duration: 0 }}>
      {slides.map((s, i) => (
        <section key={s.id} data-print-page={i + 1} style={{ width: stage.width, height: stage.height, position: 'relative', overflow: 'hidden', breakAfter: 'page' }}>
          <SlideView slide={s} index={i} total={slides.length} step={s.steps ?? 0} print />
        </section>
      ))}
    </MotionConfig>
  );
}
