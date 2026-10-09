import { useRef } from 'react';
import type { SlideDef } from '../../types/slide';
import { SlideStateContext } from '../../hooks/useSlideState';
import { useApplyEdits } from '../../edit/useApplyEdits';
import { NewCardsLayer } from '../../edit/NewCards';
import { SlideFrame } from './SlideFrame';

interface Props { slide: SlideDef; index: number; total: number; step: number; print?: boolean; active?: boolean }

/** Um slide completo: estado (passo/impressão) + moldura + layout + edições da interface. */
export function SlideView({ slide, index, total, step, print = false, active = true }: Props) {
  const { Component } = slide;
  const root = useRef<HTMLDivElement>(null);
  useApplyEdits(root, slide.id, step);
  return (
    <SlideStateContext.Provider value={{ step, print, active }}>
      <div ref={root} data-slide-root data-slide-id={slide.id} style={{ position: 'absolute', inset: 0 }}>
        <SlideFrame theme={slide.theme} index={index} total={total} section={slide.section} bare={slide.bare} chromeOnDark={slide.chromeOnDark} shapes={slide.shapes ?? 'none'}>
          <Component />
        </SlideFrame>
        <NewCardsLayer slideId={slide.id} />
      </div>
    </SlideStateContext.Provider>
  );
}
