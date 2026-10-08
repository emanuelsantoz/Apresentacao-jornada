import { useEffect, useState } from 'react';

/** true após `ms` sem movimento do mouse (esconde controles discretos). */
export function useIdle(ms = 2000) {
  const [idle, setIdle] = useState(false);
  useEffect(() => {
    let t = window.setTimeout(() => setIdle(true), ms);
    const wake = () => {
      setIdle(false);
      window.clearTimeout(t);
      t = window.setTimeout(() => setIdle(true), ms);
    };
    window.addEventListener('mousemove', wake);
    return () => { window.removeEventListener('mousemove', wake); window.clearTimeout(t); };
  }, [ms]);
  return idle;
}
