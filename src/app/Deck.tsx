import { AnimatePresence, motion, MotionConfig } from 'motion/react';
import { useEffect, useRef, useState, type TouchEvent } from 'react';
import type { SlideDef } from '../types/slide';
import { useDeck } from '../hooks/useDeck';
import { useIdle } from '../hooks/useIdle';
import { useKeyboardNav } from '../hooks/useKeyboardNav';
import { Stage } from '../components/stage/Stage';
import { SlideView } from '../components/stage/SlideView';
import { Overview } from '../components/stage/Overview';
import { Hud } from '../components/stage/Hud';
import { motionTokens } from '../theme/tokens';
import { useEditMode } from '../edit/EditMode';
import { EditBar } from '../edit/EditBar';
import { TextEditor } from '../edit/TextEditor';
import { Toast } from '../edit/notify';

/**
 * Deck: um slide por vez, navegação por teclado, clique, toque e URL.
 * Dois modos: apresentação (limpo) e edição (textos, prints e logo editáveis) — tecla E.
 */
export function Deck({ slides }: { slides: SlideDef[] }) {
  const { index, step, direction, total, next, prev, goTo } = useDeck(slides);
  const [overview, setOverview] = useState(false);
  const [notes, setNotes] = useState(false);
  const idle = useIdle(2000);
  const touchX = useRef<number | null>(null);
  const slide = slides[index];
  const { editing, toggle: toggleEdit, setEditing } = useEditMode();

  useKeyboardNav({
    next, prev, total, goTo: (i) => { goTo(i); setOverview(false); },
    toggleOverview: () => setOverview((o) => !o), toggleNotes: () => setNotes((n) => !n), toggleEdit,
    closeOverlays: () => { setOverview(false); setNotes(false); },
  });

  // Aviso de rolagem em desenvolvimento (regra: nenhum slide pode rolar).
  useEffect(() => {
    if (!import.meta.env.DEV) return;
    const t = window.setTimeout(() => {
      document.querySelectorAll<HTMLElement>('[data-slide-frame] *').forEach((el) => {
        const cs = getComputedStyle(el);
        if ((cs.overflowY === 'auto' || cs.overflowY === 'scroll') && el.scrollHeight > el.clientHeight) {
          console.warn(`[overflow] slide ${index + 1}: elemento com rolagem`, el);
        }
      });
    }, 1500);
    return () => window.clearTimeout(t);
  }, [index]);

  const onClickStage = (e: React.MouseEvent) => {
    if (editing) return; // no modo edição o clique seleciona, não navega
    if ((e.target as HTMLElement).closest('button, input, [data-print-slot]')) return;
    if (e.clientX < window.innerWidth * 0.25) prev();
    else if (e.clientX > window.innerWidth * 0.75) next();
  };
  const onTouchStart = (e: TouchEvent) => { touchX.current = e.touches[0].clientX; };
  const onTouchEnd = (e: TouchEvent) => {
    if (touchX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchX.current;
    if (Math.abs(dx) > 50) (dx < 0 ? next : prev)();
    touchX.current = null;
  };

  return (
    <MotionConfig reducedMotion="user">
      <div onClick={onClickStage} onTouchStart={onTouchStart} onTouchEnd={onTouchEnd} style={{ cursor: idle && !editing ? 'none' : 'default' }}>
        <Stage>
          <AnimatePresence initial={false} custom={direction} mode="popLayout">
            <motion.div
              key={slide.id}
              custom={direction}
              style={{ position: 'absolute', inset: 0 }}
              initial={{ opacity: 0, x: 60 * direction }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -60 * direction }}
              transition={{ duration: motionTokens.slide, ease: motionTokens.ease }}
            >
              <SlideView slide={slide} index={index} total={total} step={step} />
            </motion.div>
          </AnimatePresence>
        </Stage>
      </div>

      <Hud
        index={index} total={total} step={step} steps={slide.steps ?? 0} idle={idle}
        prev={prev} next={next} overview={() => setOverview(true)} notes={() => setNotes((n) => !n)}
        editing={editing} toggleEdit={toggleEdit}
      />

      {editing && !overview && (
        <>
          <EditBar slideId={slide.id} onExit={() => setEditing(false)} />
          <TextEditor />
          <Toast />
        </>
      )}

      {notes && slide.notes && (
        <div className="no-print" style={{ position: 'fixed', left: 20, bottom: 20, maxWidth: 560, zIndex: 45, background: 'var(--ws-chrome)', color: '#fff', padding: '16px 20px', borderRadius: 8, fontSize: 16, lineHeight: 1.45, border: '1px solid var(--ws-chrome-2)' }}>
          <b style={{ color: 'var(--ws-selection)' }}>Notas · slide {index + 1}</b>
          <div style={{ marginTop: 6 }}>{slide.notes}</div>
        </div>
      )}

      {overview && <Overview slides={slides} current={index} onPick={(i) => { goTo(i); setOverview(false); }} />}
    </MotionConfig>
  );
}
