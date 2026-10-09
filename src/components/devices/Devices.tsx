import type { CSSProperties, ReactNode } from 'react';

interface DeviceProps { width: number; children: ReactNode; style?: CSSProperties }

/** Tablet em paisagem (proporção 4:3), moldura escura arredondada. */
export function Tablet({ width, children, style }: DeviceProps) {
  const bezel = width * 0.035;
  return (
    <div style={{
      width, height: width * 0.75, padding: bezel, borderRadius: width * 0.06, background: '#1b2420',
      boxShadow: 'var(--shadow-device)', position: 'relative', ...style,
    }}>
      <span style={{ position: 'absolute', left: bezel * 0.42, top: '50%', width: 9, height: 9, borderRadius: 9, background: '#3a4a44', transform: 'translateY(-50%)' }} />
      <div style={{ position: 'relative', width: '100%', height: '100%', borderRadius: width * 0.022, overflow: 'hidden', background: 'var(--bws-canvas)' }}>
        {children}
      </div>
    </div>
  );
}

/** Notebook: tela 16:10 + base. Inspirado no mockup da referência 2. */
export function Laptop({ width, children, style }: DeviceProps) {
  const screenW = width * 0.82;
  const bezel = screenW * 0.022;
  return (
    <div style={{ width, display: 'flex', flexDirection: 'column', alignItems: 'center', ...style }}>
      <div style={{
        width: screenW, height: screenW * 0.625 + bezel * 2, padding: bezel, paddingBottom: bezel * 1.4,
        borderRadius: `${screenW * 0.03}px ${screenW * 0.03}px 6px 6px`, background: '#1b2420',
        boxShadow: 'inset 0 0 0 2px rgba(255,255,255,0.07)', position: 'relative',
      }}>
        <div style={{ position: 'relative', width: '100%', height: '100%', borderRadius: 6, overflow: 'hidden', background: 'var(--bws-canvas)' }}>
          {children}
        </div>
      </div>
      <div style={{
        width, height: width * 0.03, borderRadius: `4px 4px ${width * 0.03}px ${width * 0.03}px`,
        background: '#b8c1bd', boxShadow: 'var(--shadow-device)', position: 'relative',
      }}>
        <span style={{ position: 'absolute', left: '50%', top: 0, width: width * 0.14, height: width * 0.01, transform: 'translateX(-50%)', background: '#7d8783', borderRadius: '0 0 10px 10px' }} />
      </div>
    </div>
  );
}

/** Celular em retrato (9:19.5). */
export function Phone({ width, children, style }: DeviceProps) {
  const bezel = width * 0.04;
  return (
    <div style={{
      width, height: width * 2.05, padding: bezel, borderRadius: width * 0.16, background: '#1b2420',
      boxShadow: 'var(--shadow-device)', position: 'relative', ...style,
    }}>
      <div style={{ position: 'relative', width: '100%', height: '100%', borderRadius: width * 0.12, overflow: 'hidden', background: '#fff' }}>
        {children}
        <span style={{ position: 'absolute', top: width * 0.03, left: '50%', transform: 'translateX(-50%)', width: width * 0.3, height: width * 0.08, borderRadius: 99, background: '#0f1412', zIndex: 3 }} />
      </div>
    </div>
  );
}
