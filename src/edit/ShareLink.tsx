import { Check, Copy, ExternalLink, Link2 } from 'lucide-react';
import { useState, type CSSProperties } from 'react';
import { buildViewLink } from './EditMode';

/** Botão "Link de apresentação": gera e copia a URL que abre a apresentação sem permitir edição. */
export function ShareLink({ slideNumber, dark = true, up = false }: { slideNumber: number; dark?: boolean; up?: boolean }) {
  const [open, setOpen] = useState(false);
  const [fromHere, setFromHere] = useState(false);
  const [copied, setCopied] = useState(false);
  const link = buildViewLink(fromHere ? slideNumber : undefined);

  const copy = async () => {
    try { await navigator.clipboard.writeText(link); }
    catch {
      const t = document.createElement('textarea');
      t.value = link; document.body.appendChild(t); t.select(); document.execCommand('copy'); t.remove();
    }
    setCopied(true); window.setTimeout(() => setCopied(false), 2000);
  };

  return (
    <span data-editor-ui style={{ position: 'relative', display: 'inline-flex' }}>
      <button
        onClick={() => setOpen((o) => !o)} title="Gerar link só de apresentação"
        style={{ ...btn, background: dark ? '#0F3A28' : 'var(--ws-action)', color: '#fff' }}
      >
        <Link2 size={15} /> Link de apresentação
      </button>
      {open && (
        <div style={{ ...pop, ...(up ? { bottom: 'calc(100% + 8px)' } : { top: 'calc(100% + 8px)' }) }}>
          <b style={{ fontSize: 14 }}>Link somente para apresentar</b>
          <span style={{ fontSize: 12, color: '#6B7280', lineHeight: 1.4 }}>
            Quem abrir este link vê a apresentação sem botão, atalho ou ferramenta de edição.
          </span>
          <input readOnly value={link} onFocus={(e) => e.currentTarget.select()} style={field} />
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}>
            <input type="checkbox" checked={fromHere} onChange={(e) => setFromHere(e.target.checked)} />
            Abrir já no slide {slideNumber}
          </label>
          <div style={{ display: 'flex', gap: 8 }}>
            <button style={{ ...btn, background: '#12864F', color: '#fff', flex: 1, justifyContent: 'center' }} onClick={copy}>
              {copied ? <><Check size={15} /> Copiado</> : <><Copy size={15} /> Copiar link</>}
            </button>
            <a href={link} target="_blank" rel="noreferrer" style={{ ...btn, background: '#E8F5E9', color: '#0B5D3B', textDecoration: 'none' }}>
              <ExternalLink size={15} /> Testar
            </a>
          </div>
        </div>
      )}
    </span>
  );
}

const btn: CSSProperties = {
  display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 11px', borderRadius: 8, border: 'none', cursor: 'pointer',
  fontSize: 13, fontWeight: 600, fontFamily: 'var(--font-brand)',
};
const pop: CSSProperties = {
  position: 'absolute', right: 0, zIndex: 80, width: 340, display: 'flex', flexDirection: 'column', gap: 10, padding: 14,
  background: '#fff', color: '#1F2937', border: '1px solid #E5E7EB', borderRadius: 12, boxShadow: '0 8px 24px rgba(0,0,0,.18)',
  fontFamily: 'var(--font-brand)',
};
const field: CSSProperties = { padding: '8px 10px', border: '1px solid #E5E7EB', borderRadius: 8, fontSize: 12, width: '100%', boxSizing: 'border-box' };
