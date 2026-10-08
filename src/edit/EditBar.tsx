import { Download, Eye, Pencil, Trash2, Upload } from 'lucide-react';
import { useRef, useState, type CSSProperties } from 'react';
import { edits, useAllEdits } from './editsStore';

/** Faixa do topo no modo edição: status e ações (exportar/importar/desfazer). */
export function EditBar({ slideId, onExit }: { slideId: string; onExit: () => void }) {
  useAllEdits();
  const input = useRef<HTMLInputElement>(null);
  const [msg, setMsg] = useState('');
  const total = edits.count();
  const here = edits.count(slideId);
  const flash = (m: string) => { setMsg(m); window.setTimeout(() => setMsg(''), 2500); };

  return (
    <div data-editor-ui className="no-print" style={wrap}>
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontWeight: 700, color: '#0a2416', background: '#AFBF30', padding: '5px 12px', borderRadius: 999 }}>
        <Pencil size={15} /> Modo edição
      </span>
      <span style={{ opacity: 0.8 }}>
        Passe o mouse e clique num texto · prints e logo também · <b>{here}</b> edição(ões) neste slide, <b>{total}</b> no total
        {edits.source() === 'local' ? ' (salvas neste navegador)' : edits.source() === 'arquivo' ? ' (de edicoes.json)' : ''}
      </span>
      <span style={{ flex: 1 }} />
      {msg && <span style={{ color: '#AFBF30' }}>{msg}</span>}
      <button style={btn} onClick={() => { edits.exportFile(); flash('edicoes.json baixado'); }} title="Baixa edicoes.json — salve em public/ para fixar no projeto">
        <Download size={15} /> Exportar
      </button>
      <button style={btn} onClick={() => input.current?.click()} title="Carrega um edicoes.json"><Upload size={15} /> Importar</button>
      <button style={btn} disabled={!here} onClick={() => { edits.resetSlide(slideId); flash('Slide restaurado'); }} title="Desfaz todas as edições deste slide">
        <Trash2 size={15} /> Desfazer slide
      </button>
      <button style={{ ...btn, background: '#fff', color: '#0a2416' }} onClick={onExit} title="Voltar ao modo apresentação (E)">
        <Eye size={15} /> Apresentar
      </button>
      <input
        ref={input} type="file" accept="application/json,.json" hidden
        onChange={async (e) => {
          const f = e.target.files?.[0];
          e.target.value = '';
          if (!f) return;
          try { await edits.importFile(f); flash('Edições importadas'); } catch { flash('Arquivo inválido'); }
        }}
      />
    </div>
  );
}

const wrap: CSSProperties = {
  position: 'fixed', left: 0, right: 0, top: 0, zIndex: 65, display: 'flex', alignItems: 'center', gap: 12, padding: '8px 14px',
  background: 'rgba(8,30,18,0.94)', color: '#fff', fontSize: 13, fontFamily: 'var(--font-brand)', borderBottom: '1px solid rgba(175,191,48,0.35)',
};
const btn: CSSProperties = {
  display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 11px', borderRadius: 8, border: 'none', cursor: 'pointer',
  background: 'rgba(255,255,255,0.1)', color: '#fff', fontSize: 13, fontWeight: 600,
};
