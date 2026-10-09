import { useEffect, useState } from 'react';

/** Aviso curto no rodapé do modo edição (“Desfeito: texto”, “Salvo” …). */
const EVENT = 'editor:aviso';

export function notify(msg: string) {
  window.dispatchEvent(new CustomEvent(EVENT, { detail: msg }));
}

export function Toast() {
  const [msg, setMsg] = useState<{ text: string; n: number } | null>(null);
  useEffect(() => {
    let timer = 0;
    const on = (e: Event) => {
      setMsg((m) => ({ text: (e as CustomEvent<string>).detail, n: (m?.n ?? 0) + 1 }));
      window.clearTimeout(timer);
      timer = window.setTimeout(() => setMsg(null), 2200);
    };
    window.addEventListener(EVENT, on);
    return () => { window.removeEventListener(EVENT, on); window.clearTimeout(timer); };
  }, []);
  if (!msg) return null;
  return (
    <div
      key={msg.n}
      data-editor-ui
      role="status"
      style={{
        position: 'fixed', left: '50%', bottom: 24, transform: 'translateX(-50%)', zIndex: 80, padding: '9px 16px', borderRadius: 10,
        background: '#0B2E1F', color: '#E8F5E9', border: '1px solid #1F5A40', fontFamily: 'var(--font-brand)', fontSize: 14, fontWeight: 600,
        boxShadow: '0 4px 12px rgba(0,0,0,.25)', pointerEvents: 'none',
      }}
    >
      {msg.text}
    </div>
  );
}
