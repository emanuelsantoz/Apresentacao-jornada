import { useLayoutEffect, type RefObject } from 'react';
import { applySlideEdits } from './domText';
import { useSlideEdits } from './editsStore';

/** Mantém as edições aplicadas no slide, inclusive quando partes dele remontam. */
export function useApplyEdits(root: RefObject<HTMLElement>, slideId: string, step: number) {
  const slideEdits = useSlideEdits(slideId);
  useLayoutEffect(() => {
    const el = root.current;
    if (!el) return;
    applySlideEdits(el, slideEdits);
    let raf = 0;
    const mo = new MutationObserver(() => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => applySlideEdits(el, slideEdits));
    });
    mo.observe(el, { childList: true, subtree: true });
    return () => { mo.disconnect(); cancelAnimationFrame(raf); };
  }, [root, slideEdits, step]);
}
