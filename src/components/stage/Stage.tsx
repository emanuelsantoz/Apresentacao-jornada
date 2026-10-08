import type { ReactNode } from 'react';
import { useStageScale } from '../../hooks/useStageScale';
import { stage } from '../../theme/tokens';

/** Palco lógico 1920x1080 escalado para a janela, com letterbox. Nunca rola. */
export function Stage({ children }: { children: ReactNode }) {
  const scale = useStageScale();
  return (
    <div style={{ position: 'fixed', inset: 0, display: 'grid', placeItems: 'center', overflow: 'hidden', background: 'var(--c-green-950)' }}>
      <div style={{ width: stage.width * scale, height: stage.height * scale, position: 'relative', overflow: 'hidden' }}>
        <div data-stage style={{ width: stage.width, height: stage.height, transform: `scale(${scale})`, transformOrigin: '0 0', position: 'absolute', left: 0, top: 0 }}>
          {children}
        </div>
      </div>
    </div>
  );
}
