import { AlertTriangle, Check, Cloud, CloudDownload, CloudOff, CloudUpload, KeyRound, Loader2 } from 'lucide-react';
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { API_URL } from '../lib/cloud';
import { edits, useEditsMeta, type CloudStatus } from './editsStore';
import { notify } from './notify';

const time = (t?: number) => (t ? new Date(t).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) : '');

const LOOK: Record<CloudStatus, { icon: ReactNode; text: (at?: number) => string; color: string }> = {
  desligada: { icon: <CloudOff size={14} />, text: () => 'Nuvem desligada', color: '#9CA3AF' },
  carregando: { icon: <Loader2 size={14} className="spin" />, text: () => 'Nuvem…', color: '#E8F5E9' },
  ok: { icon: <Cloud size={14} />, text: (at) => (at ? `Nuvem · ${time(at)}` : 'Nuvem em dia'), color: '#86EFAC' },
  enviando: { icon: <Loader2 size={14} className="spin" />, text: () => 'Enviando…', color: '#E8F5E9' },
  pendente: { icon: <CloudUpload size={14} />, text: () => 'Envio pendente', color: '#FCD34D' },
  'sem-token': { icon: <KeyRound size={14} />, text: () => 'Informar token', color: '#FCD34D' },
  offline: { icon: <CloudOff size={14} />, text: () => 'Sem conexão', color: '#FCA5A5' },
  erro: { icon: <AlertTriangle size={14} />, text: () => 'Erro na nuvem', color: '#FCA5A5' },
  conflito: { icon: <AlertTriangle size={14} />, text: () => 'Conflito com a nuvem', color: '#FCD34D' },
};

/**
 * Indicador da nuvem na faixa do topo + painel: token de escrita, enviar agora, carregar da nuvem
 * e resolução de conflito. O envio é automático (1,5 s depois de editar) quando há token.
 */
export function CloudMenu() {
  const meta = useEditsMeta();
  const [open, setOpen] = useState(false);
  const [token, setToken] = useState('');
  const [busy, setBusy] = useState(false);
  const wrap = useRef<HTMLDivElement>(null);
  const chip = useRef<HTMLButtonElement>(null);
  const [left, setLeft] = useState(0);

  // conflito pede decisão: abre o painel sozinho
  useEffect(() => { if (meta.cloud === 'conflito') setOpen(true); }, [meta.cloud]);

  useEffect(() => {
    if (!open) return;
    const r = chip.current?.getBoundingClientRect();
    if (r) setLeft(Math.max(8, Math.min(r.left, window.innerWidth - 400)));
    const onDown = (e: PointerEvent) => { if (!wrap.current?.contains(e.target as Node)) setOpen(false); };
    document.addEventListener('pointerdown', onDown);
    return () => document.removeEventListener('pointerdown', onDown);
  }, [open]);

  if (meta.cloud === 'desligada') return null;
  const look = LOOK[meta.cloud];
  const hasToken = edits.hasToken();

  const run = async (fn: () => Promise<unknown>, done?: string) => {
    setBusy(true);
    try { await fn(); if (done) notify(done); } finally { setBusy(false); }
  };

  return (
    <div ref={wrap} data-editor-ui style={{ display: 'inline-flex' }}>
      <button
        ref={chip}
        onClick={() => setOpen((o) => !o)}
        title={meta.cloudMsg ?? 'Sincronização com a nuvem'}
        style={{ ...chipBtn, color: look.color }}
      >
        {look.icon} {look.text(meta.cloudAt)}
      </button>

      {open && (
        <div role="dialog" aria-label="Nuvem" style={{ ...panel, left }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 700, fontSize: 14 }}>
            <Cloud size={16} /> Nuvem
            <span style={{ flex: 1 }} />
            <span style={{ color: look.color, fontWeight: 600, fontSize: 12 }}>{look.text(meta.cloudAt)}</span>
          </div>
          <div style={{ fontSize: 11, opacity: 0.6, marginTop: 4, wordBreak: 'break-all' }}>{API_URL}</div>
          {meta.cloudMsg && <div style={{ fontSize: 12, marginTop: 8, color: meta.cloud === 'erro' || meta.cloud === 'offline' ? '#FCA5A5' : '#FCD34D' }}>{meta.cloudMsg}</div>}

          {meta.cloud === 'conflito' && (
            <div style={box}>
              <div style={{ fontSize: 12, lineHeight: 1.4 }}>
                Este navegador tem alterações que a nuvem não tem, e a nuvem também mudou. Escolha qual versão vale:
              </div>
              <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                <button style={btn} disabled={busy} onClick={() => void run(() => edits.resolveConflict('nuvem'), 'Versão da nuvem aplicada · Ctrl+Z desfaz')}>
                  <CloudDownload size={14} /> Usar a da nuvem
                </button>
                <button style={{ ...btn, background: '#B45309' }} disabled={busy || !hasToken} title={hasToken ? 'Substitui a nuvem pela versão deste navegador' : 'Informe o token primeiro'} onClick={() => void run(() => edits.resolveConflict('local'), '✓ Nuvem atualizada com a sua versão')}>
                  <CloudUpload size={14} /> Enviar a minha
                </button>
              </div>
            </div>
          )}

          <div style={box}>
            <label style={{ fontSize: 12, opacity: 0.8 }}>
              Token de edição {hasToken ? <span style={{ color: '#86EFAC' }}>· salvo neste navegador</span> : <span style={{ color: '#FCD34D' }}>· necessário para enviar</span>}
            </label>
            <div style={{ display: 'flex', gap: 8, marginTop: 6 }}>
              <input
                type="password" autoComplete="off" spellCheck={false} value={token} placeholder={hasToken ? '••••••••  (digite para trocar)' : 'Cole o token (API_TOKEN)'}
                onChange={(e) => setToken(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter' && token.trim()) { edits.setToken(token); setToken(''); notify('Token salvo neste navegador'); } }}
                style={input}
              />
              <button style={btn} disabled={!token.trim()} onClick={() => { edits.setToken(token); setToken(''); notify('Token salvo neste navegador'); }}>
                <Check size={14} /> Salvar
              </button>
            </div>
            {hasToken && <button style={{ ...link }} onClick={() => { edits.setToken(''); notify('Token removido deste navegador'); }}>Remover token deste navegador</button>}
            <div style={{ fontSize: 11, opacity: 0.6, marginTop: 6 }}>O token não vai para o código nem para o PDF; só quem edita precisa dele. Ver a apresentação não exige token.</div>
          </div>

          <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
            <button style={btn} disabled={busy || !hasToken || meta.cloud === 'conflito'} onClick={() => void run(async () => { const ok = await edits.syncNow(); notify(ok ? '✓ Enviado para a nuvem' : 'Não foi possível enviar'); })}>
              <CloudUpload size={14} /> Enviar agora
            </button>
            <button style={btn} disabled={busy} onClick={() => void run(async () => {
              const r = await edits.pullCloud();
              notify(r === 'ok' ? 'Carregado da nuvem · Ctrl+Z desfaz' : r === 'vazia' ? 'A nuvem ainda está vazia' : 'Não foi possível carregar');
            })}>
              <CloudDownload size={14} /> Carregar da nuvem
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const chipBtn: CSSProperties = {
  all: 'unset', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 10px', borderRadius: 99,
  background: 'rgba(255,255,255,0.06)', fontWeight: 600, fontSize: 13, fontFamily: 'var(--font-brand)',
};
const panel: CSSProperties = {
  position: 'fixed', top: 52, zIndex: 75, width: 390, padding: 14, borderRadius: 12, background: '#0B2E1F', color: '#fff',
  border: '1px solid #1F5A40', boxShadow: '0 8px 24px rgba(0,0,0,.35)', fontFamily: 'var(--font-brand)',
};
const box: CSSProperties = { marginTop: 12, padding: 10, borderRadius: 10, background: 'rgba(255,255,255,0.05)' };
const btn: CSSProperties = {
  all: 'unset', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6, height: 28, padding: '0 10px', borderRadius: 7,
  background: '#12864F', color: '#fff', fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap',
};
const input: CSSProperties = {
  flex: 1, minWidth: 0, height: 28, padding: '0 8px', borderRadius: 7, border: '1px solid rgba(255,255,255,0.25)', background: 'rgba(0,0,0,0.25)',
  color: '#fff', fontSize: 13, fontFamily: 'inherit',
};
const link: CSSProperties = { all: 'unset', cursor: 'pointer', fontSize: 11, marginTop: 6, textDecoration: 'underline', opacity: 0.75, display: 'block' };
