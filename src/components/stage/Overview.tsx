import type { SlideDef } from '../../types/slide';
import { stage } from '../../theme/tokens';
import { SlideView } from './SlideView';

const THUMB = 340;

/** Visão geral (tecla O): grade de miniaturas no estado final de cada slide. */
export function Overview({ slides, current, onPick }: { slides: SlideDef[]; current: number; onPick: (i: number) => void }) {
  const s = THUMB / stage.width;
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 50, background: 'var(--ws-chrome)', overflow: 'auto', padding: 40 }}>
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(auto-fill, ${THUMB}px)`, gap: 24, justifyContent: 'center' }}>
        {slides.map((sl, i) => (
          <button
            key={sl.id}
            onClick={() => onPick(i)}
            style={{ all: 'unset', cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: 8 }}
          >
            <div style={{ width: THUMB, height: stage.height * s, overflow: 'hidden', borderRadius: 6, position: 'relative', outline: i === current ? '3px solid var(--ws-action)' : '1px solid var(--ws-chrome-2)' }}>
              <div style={{ width: stage.width, height: stage.height, transform: `scale(${s})`, transformOrigin: '0 0', pointerEvents: 'none', position: 'absolute' }}>
                <SlideView slide={sl} index={i} total={slides.length} step={sl.steps ?? 0} print active={false} />
              </div>
            </div>
            <span style={{ color: '#fff', fontSize: 14 }}>
              <b style={{ color: 'var(--ws-selection)' }}>{i + 1}</b> · {sl.title}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
