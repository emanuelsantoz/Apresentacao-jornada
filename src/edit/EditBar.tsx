import { AlertTriangle, Check, Download, Eye, FolderDown, Loader2, Pencil, Plus, Redo2, Trash2, Undo2, Upload } from 'lucide-react';
import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { edits, useEditsMeta } from './editsStore';
import { CloudMenu } from './CloudMenu';
import { notify } from './notify';
import { ShareLink } from './ShareLink';

const time = (t?: number) => (t ? new Date(t).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) : '');

/** Faixa do topo no modo edição: status do salvamento, histórico e ações. */
export function EditBar({ slideId, slideNumber, onExit }: { slideId: string; slideNumber: number; onExit: () => void }) {
  const meta = useEditsMeta();
  const input = useRef<HTMLInputElement>(null);
  const [, tick] = useState(0);
  const here = edits.count(slideId);
  const total = edits.count();

  // atualiza o “salvo há …”
  useEffect(() => {
    const id = window.setInterval(() => tick((n) => n + 1), 30000);
    return () => window.clearInterval(id);
  }, []);

  const undo = () => { const l = edits.undo(); notify(l ? `Desfeito: ${l}` : 'Nada para desfazer'); };
  const redo = () => { const l = edits.redo(); notify(l ? `Refeito: ${l}` : 'Nada para refazer'); };
  const addCard = () => {
    const id = edits.addCard(slideId);
    window.dispatchEvent(new CustomEvent('editor:novo-card', { detail: { slideId, id } }));
  };
  const saveProject = async () => {
    try {
      await edits.flush();
      await edits.saveToProject();
      notify('✓ Salvo em public/edicoes.json');
    } catch {
      notify('Não foi possível gravar no projeto — use Exportar');
    }
  };

  return (
    <div data-editor-ui className="no-print" style={wrap}>
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontWeight: 700, color: '#0B5D3B', background: '#E8F5E9', padding: '5px 12px', borderRadius: 6 }}>
        <Pencil size={15} /> Modo edição
      </span>

      <div style={group}>
        <button style={iconBtn} onClick={undo} disabled={!meta.undoLabel} title={meta.undoLabel ? `Desfazer: ${meta.undoLabel} (Ctrl+Z)` : 'Nada para desfazer'}>
          <Undo2 size={16} />
        </button>
        <button style={iconBtn} onClick={redo} disabled={!meta.redoLabel} title={meta.redoLabel ? `Refazer: ${meta.redoLabel} (Ctrl+Y)` : 'Nada para refazer'}>
          <Redo2 size={16} />
        </button>
      </div>

      <button style={{ ...btn, background: '#1F5A40' }} onClick={addCard} title="Cria um card com texto no centro do slide">
        <Plus size={15} /> Card de texto
      </button>

      <SaveStatus status={meta.status} savedAt={meta.savedAt} />
      <CloudMenu />
      <ShareLink slideNumber={slideNumber} />
      <span style={{ opacity: 0.7 }}>
        <b>{here}</b> neste slide · <b>{total}</b> no total
      </span>

      <span style={{ flex: 1 }} />

      {import.meta.env.DEV && (
        <button
          style={{ ...btn, ...(meta.pendingProject ? { background: '#B45309' } : {}) }}
          onClick={() => void saveProject()}
          title="Grava public/edicoes.json no projeto (vale para todos e para o PDF)"
        >
          <FolderDown size={15} /> {meta.pendingProject ? 'Salvar no projeto' : 'Projeto em dia'}
        </button>
      )}
      <button style={btn} onClick={() => { edits.exportFile(); notify('edicoes.json baixado'); }} title="Baixa edicoes.json — salve em public/ para fixar no projeto">
        <Download size={15} /> Exportar
      </button>
      <button style={btn} onClick={() => input.current?.click()} title="Carrega um edicoes.json"><Upload size={15} /> Importar</button>
      <button style={btn} disabled={!here} onClick={() => { edits.resetSlide(slideId); notify('Slide restaurado · Ctrl+Z desfaz'); }} title="Remove todas as edições e cards novos deste slide">
        <Trash2 size={15} /> Restaurar slide
      </button>
      <button style={{ ...btn, background: '#12864F', color: '#fff' }} onClick={onExit} title="Voltar ao modo apresentação (E)">
        <Eye size={15} /> Apresentar
      </button>
      <input
        ref={input} type="file" accept="application/json,.json" hidden
        onChange={async (e) => {
          const f = e.target.files?.[0];
          e.target.value = '';
          if (!f) return;
          try { await edits.importFile(f); notify('Edições importadas · Ctrl+Z desfaz'); } catch { notify('Arquivo inválido'); }
        }}
      />
    </div>
  );
}

function SaveStatus({ status, savedAt }: { status: string; savedAt?: number }) {
  const map = {
    carregando: { icon: <Loader2 size={14} className="spin" />, text: 'Carregando…', color: '#E8F5E9' },
    salvando: { icon: <Loader2 size={14} className="spin" />, text: 'Salvando…', color: '#E8F5E9' },
    salvo: { icon: <Check size={14} />, text: savedAt ? `Navegador · ${time(savedAt)}` : 'Tudo salvo', color: '#86EFAC' },
    erro: { icon: <AlertTriangle size={14} />, text: 'Erro ao salvar — exporte o arquivo', color: '#FCA5A5' },
  } as const;
  const s = map[status as keyof typeof map] ?? map.salvo;
  return (
    <span role="status" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 10px', borderRadius: 99, background: 'rgba(255,255,255,0.06)', color: s.color, fontWeight: 600 }}>
      {s.icon} {s.text}
    </span>
  );
}

const wrap: CSSProperties = {
  position: 'fixed', left: 0, right: 0, top: 0, zIndex: 65, display: 'flex', alignItems: 'center', gap: 10, padding: '8px 14px', flexWrap: 'wrap',
  background: '#0B2E1F', color: '#fff', fontSize: 13, fontFamily: 'var(--font-brand)', borderBottom: '1px solid #0F3A28',
};
const btn: CSSProperties = {
  display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 11px', borderRadius: 8, border: 'none', cursor: 'pointer',
  background: '#0F3A28', color: '#fff', fontSize: 13, fontWeight: 600,
};
const group: CSSProperties = { display: 'inline-flex', gap: 2, padding: 2, borderRadius: 9, background: '#0F3A28' };
const iconBtn: CSSProperties = { ...btn, padding: '5px 8px', background: 'transparent' };
