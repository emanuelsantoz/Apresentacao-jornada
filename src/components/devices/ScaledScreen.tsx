import { useLayoutEffect, useRef, useState, type ReactNode } from 'react';

/**
 * Renderiza uma tela numa resolução virtual fixa (ex.: 1200x900) e escala
 * para preencher o container. Assim as telas de exemplo ficam nítidas em qualquer mockup.
 */
export function ScaledScreen({ baseWidth, baseHeight, children }: { baseWidth: number; baseHeight: number; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () => setScale(el.clientWidth / baseWidth);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [baseWidth]);
  return (
    <div ref={ref} style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
      <div style={{ width: baseWidth, height: baseHeight, transform: `scale(${scale})`, transformOrigin: '0 0' }}>{children}</div>
    </div>
  );
}
