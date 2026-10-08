import { useEffect, useState } from 'react';
import { stage } from '../theme/tokens';

/** Escala o palco lógico 1920x1080 para caber na janela (letterbox). */
export function useStageScale() {
  const calc = () => Math.min(window.innerWidth / stage.width, window.innerHeight / stage.height);
  const [scale, setScale] = useState(calc);
  useEffect(() => {
    const onResize = () => setScale(calc());
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);
  return scale;
}
