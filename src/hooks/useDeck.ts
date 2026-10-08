import { useCallback, useEffect, useState } from 'react';
import type { SlideDef } from '../types/slide';

const readHash = (total: number) => {
  const n = parseInt(window.location.hash.replace('#/', ''), 10);
  return Number.isFinite(n) ? Math.min(Math.max(n - 1, 0), total - 1) : 0;
};

/** Estado do deck: slide atual + passo interno, sincronizado com a URL (#/N). */
export function useDeck(slides: SlideDef[]) {
  const total = slides.length;
  const [index, setIndex] = useState(() => readHash(total));
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);

  const stepsOf = useCallback((i: number) => slides[i]?.steps ?? 0, [slides]);

  const goTo = useCallback(
    (i: number, atEnd = false) => {
      const target = Math.min(Math.max(i, 0), total - 1);
      setDirection(target >= index ? 1 : -1);
      setIndex(target);
      setStep(atEnd ? stepsOf(target) : 0);
    },
    [index, total, stepsOf],
  );

  const next = useCallback(() => {
    if (step < stepsOf(index)) setStep((s) => s + 1);
    else if (index < total - 1) goTo(index + 1);
  }, [step, index, total, stepsOf, goTo]);

  const prev = useCallback(() => {
    if (step > 0) setStep((s) => s - 1);
    else if (index > 0) goTo(index - 1, true);
  }, [step, index, goTo]);

  useEffect(() => {
    const target = `#/${index + 1}`;
    if (window.location.hash !== target) window.history.replaceState(null, '', target);
    document.title = `${index + 1}/${total} · ${slides[index].title}`;
  }, [index, total, slides]);

  useEffect(() => {
    const onHash = () => goTo(readHash(total));
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, [goTo, total]);

  return { index, step, direction, total, next, prev, goTo };
}
