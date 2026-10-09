import { Check, Highlighter, Minus, Plus, RotateCcw, Square, Trash2, Type, X } from 'lucide-react';
import { useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import type { TextOverride } from './editsStore';

/** Paleta rápida: tokens do WorkSpace + cores de status (use status só em destaques pontuais). */
const TEXT_COLORS = [
  { c: '#1F2937', n: 'Texto' }, { c: '#6B7280', n: 'Texto secundário' }, { c: '#0B2E1F', n: 'Chrome' },
  { c: '#0B5D3B', n: 'Primária' }, { c: '#12864F', n: 'Ação' }, { c: '#E8F5E9', n: 'Seleção' }, { c: '#FFFFFF', n: 'Branco' },
  { c: '#B45309', n: 'Status · alerta' }, { c: '#B91C1C', n: 'Status · erro' }, { c: '#1D4ED8', n: 'Status · info' },
];
/** Fundos de palavra (marca-texto). */
const BG_COLORS = [
  { c: '#FEF08A', n: 'Marca-texto amarelo' }, { c: '#BBF7D0', n: 'Verde claro' }, { c: '#E8F5E9', n: 'Seleção' },
  { c: '#FDE68A', n: 'Âmbar' }, { c: '#FECACA', n: 'Vermelho claro' }, { c: '#BFDBFE', n: 'Azul claro' },
  { c: '#12864F', n: 'Ação' }, { c: '#0B2E1F', n: 'Chrome' }, { c: '#FFFFFF', n: 'Branco' },
];
const CARD_FILLS = [
  { c: '#FFFFFF', n: 'Branco' }, { c: '#E8F5E9', n: 'Seleção' }, { c: '#F3F4F6', n: 'Cinza' }, { c: '#0B2E1F', n: 'Chrome' },
  { c: '#0B5D3B', n: 'Primária' }, { c: '#12864F', n: 'Ação' }, { c: '#FEF3C7', n: 'Alerta claro' }, { c: 'transparent', n: 'Sem fundo' },
];

export type ToolbarKind = 'text' | 'cardText' | 'box' | 'card';
type Pop = 'color' | 'bg' | 'fill' | null;

interface Props {
  kind: ToolbarKind;
  anchor: HTMLElement;
  /** estilo atual do texto (text/cardText) */
  size: number;
  weight: number;
  color: string;
  /** fundo vai para o trecho selecionado ou para o texto todo */
  bgScope: 'trecho' | 'texto';
  fill?: string;
  dims?: { w: number; h: number };
  onStyle: (patch: Partial<TextOverride>, label: string) => void;
  onBg: (color: string | null) => void;
  onFill: (color: string) => void;
  onRestore: () => void;
  onCancel: () => void;
  onConfirm: () => void;
  onDelete?: () => void;
}

/** Mantém o foco/seleção no texto ao clicar nos botões da barra. */
const keep = (e: React.MouseEvent) => e.preventDefault();

export function EditToolbar(p: Props) {
  const bar = useRef<HTMLDivElement>(null);
  const [pop, setPop] = useState<Pop>(null);
  const [pos, setPos] = useState({ left: -9999, top: -9999 });
  const isText = p.kind === 'text' || p.kind === 'cardText';
  const isNewCard = p.kind === 'card' || p.kind === 'cardText';

  // acima do elemento; se não couber (faixa do topo), abaixo do botão Mover. Roda a cada render (o editor
  // re-renderiza durante animações); setPos só muda o estado quando a posição muda.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useLayoutEffect(() => {
    if (!bar.current) return;
    const r = p.anchor.getBoundingClientRect();
    const b = bar.current.getBoundingClientRect();
    let top = r.top - b.height - 12;
    if (top < 60) top = Math.min(r.bottom + 42, window.innerHeight - b.height - 8);
    const left = Math.min(Math.max(8, r.left), window.innerWidth - b.width - 8);
    setPos((cur) => (cur.left === left && cur.top === top ? cur : { left, top }));
  });

  const swatches = (list: { c: string; n: string }[], current: string | undefined, pick: (c: string) => void, custom: boolean) => (
    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 6 }}>
      {list.map((s) => (
        <button
          key={s.c} title={s.n} onMouseDown={keep} onClick={() => pick(s.c)}
          style={{
            ...swatch,
            background: s.c === 'transparent' ? 'repeating-conic-gradient(#9CA3AF 0 25%, #fff 0 50%) 0 0/8px 8px' : s.c,
            boxShadow: current?.toLowerCase() === s.c.toLowerCase() ? '0 0 0 2px #0B2E1F, 0 0 0 4px #12864F' : 'inset 0 0 0 1px rgba(255,255,255,.3)',
          }}
        />
      ))}
      {custom && (
        <label title="Outra cor" style={{ ...swatch, position: 'relative', overflow: 'hidden', background: 'conic-gradient(red, yellow, lime, cyan, blue, magenta, red)' }}>
          <input
            type="color" value={/^#[0-9a-f]{6}$/i.test(current ?? '') ? current : '#ffffff'} onChange={(e) => pick(e.target.value)}
            style={{ opacity: 0, position: 'absolute', inset: 0, cursor: 'pointer' }}
          />
        </label>
      )}
    </div>
  );

  return (
    <div ref={bar} data-editor-ui style={{ ...panel, left: pos.left, top: pos.top }} onClick={(e) => e.stopPropagation()}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
        <span style={tag}>{isText ? <><Type size={14} /> Texto</> : <><Square size={14} /> Card</>}</span>

        {isText && (
          <>
            <Sep />
            <button style={iconBtn} title="Diminuir fonte" onMouseDown={keep} onClick={() => p.onStyle({ fontSize: Math.max(12, p.size - 2) }, 'tamanho')}><Minus size={14} /></button>
            <SizeInput value={p.size} onChange={(n) => p.onStyle({ fontSize: n }, 'tamanho')} />
            <button style={iconBtn} title="Aumentar fonte" onMouseDown={keep} onClick={() => p.onStyle({ fontSize: Math.min(220, p.size + 2) }, 'tamanho')}><Plus size={14} /></button>
            <Sep />
            {[400, 500, 600, 700].map((w) => (
              <button
                key={w} onMouseDown={keep} onClick={() => p.onStyle({ fontWeight: w }, 'peso')}
                title={{ 400: 'Regular', 500: 'Medium', 600: 'SemiBold', 700: 'Bold' }[w]}
                style={{ ...iconBtn, width: 26, fontWeight: w, fontSize: 13, background: p.weight === w ? '#12864F' : btnBg }}
              >
                {{ 400: 'R', 500: 'M', 600: 'S', 700: 'B' }[w]}
              </button>
            ))}
            <Sep />
            <ToggleBtn on={pop === 'color'} title="Cor do texto" onClick={() => setPop(pop === 'color' ? null : 'color')}>
              <span style={{ fontWeight: 700, fontSize: 14, lineHeight: 1, borderBottom: `3px solid ${p.color}`, padding: '0 2px' }}>A</span>
            </ToggleBtn>
            <ToggleBtn on={pop === 'bg'} title="Fundo da palavra (selecione um trecho para aplicar só nele)" onClick={() => setPop(pop === 'bg' ? null : 'bg')}>
              <Highlighter size={15} />
            </ToggleBtn>
          </>
        )}

        {p.kind === 'box' && p.dims && <span style={{ fontSize: 12, opacity: 0.75, padding: '0 4px' }}>{p.dims.w} × {p.dims.h} px · arraste o card para mover, as alças para o tamanho</span>}

        {isNewCard && (
          <>
            <Sep />
            <ToggleBtn on={pop === 'fill'} title="Fundo do card" onClick={() => setPop(pop === 'fill' ? null : 'fill')}>
              <span style={{ width: 14, height: 14, borderRadius: 4, background: p.fill === 'transparent' ? 'transparent' : p.fill, border: '1.5px solid #E8F5E9' }} />
            </ToggleBtn>
            <button style={iconBtn} title="Excluir card (Delete)" onMouseDown={keep} onClick={p.onDelete}><Trash2 size={14} /></button>
          </>
        )}

        <Sep />
        <button style={iconBtn} title={isText ? 'Restaurar texto, estilo e posição originais' : 'Restaurar tamanho e posição originais'} onMouseDown={keep} onClick={p.onRestore}><RotateCcw size={14} /></button>
        <button style={{ ...textBtn, background: btnBg }} title="Cancelar as alterações deste item (Esc)" onMouseDown={keep} onClick={p.onCancel}>
          <X size={14} /> Cancelar
        </button>
        <button style={{ ...textBtn, background: '#12864F' }} title="Confirmar e salvar (Enter)" onMouseDown={keep} onClick={p.onConfirm}>
          <Check size={14} /> Confirmar
        </button>
      </div>

      {pop === 'color' && <PopRow label="Cor do texto">{swatches(TEXT_COLORS, p.color, (c) => p.onStyle({ color: c }, 'cor'), true)}</PopRow>}
      {pop === 'bg' && (
        <PopRow label={p.bgScope === 'trecho' ? 'Fundo · trecho selecionado' : 'Fundo · texto inteiro'}>
          {swatches(BG_COLORS, undefined, (c) => p.onBg(c), true)}
          <button onMouseDown={keep} onClick={() => p.onBg(null)} style={{ ...textBtn, background: btnBg, marginTop: 8 }}>Sem fundo</button>
          {p.bgScope === 'texto' && <div style={hint}>Dica: selecione palavras no slide para colorir só elas.</div>}
        </PopRow>
      )}
      {pop === 'fill' && <PopRow label="Fundo do card">{swatches(CARD_FILLS, p.fill, p.onFill, true)}</PopRow>}
      {isText && p.size < 24 && <div style={{ ...hint, color: '#FCD34D' }}>Abaixo de 24 px fica difícil de ler no telão.</div>}
    </div>
  );
}

/** Campo de tamanho: aceita digitação livre e só aplica valores válidos (12–220). */
function SizeInput({ value, onChange }: { value: number; onChange: (n: number) => void }) {
  const [draft, setDraft] = useState<string | null>(null);
  return (
    <input
      type="number" min={12} max={220} title="Tamanho em px (palco 1920×1080)" style={num}
      value={draft ?? value}
      onChange={(e) => {
        setDraft(e.target.value);
        const n = Number(e.target.value);
        if (n >= 12 && n <= 220) onChange(n);
      }}
      onBlur={() => setDraft(null)}
      onKeyDown={(e) => { if (e.key === 'Enter') (e.target as HTMLInputElement).blur(); }}
    />
  );
}

function ToggleBtn({ on, title, onClick, children }: { on: boolean; title: string; onClick: () => void; children: ReactNode }) {
  return (
    <button style={{ ...iconBtn, background: on ? '#1F5A40' : btnBg, boxShadow: on ? 'inset 0 0 0 1px #12864F' : 'none' }} title={title} onMouseDown={keep} onClick={onClick}>
      {children}
    </button>
  );
}

function PopRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div style={{ marginTop: 10, paddingTop: 10, borderTop: '1px solid #1F5A40' }}>
      <div style={{ fontSize: 11, letterSpacing: '.06em', textTransform: 'uppercase', opacity: 0.7, marginBottom: 7 }}>{label}</div>
      {children}
    </div>
  );
}

const Sep = () => <span style={{ width: 1, height: 20, background: '#1F5A40', margin: '0 2px' }} />;

const btnBg = 'rgba(255,255,255,0.08)';
const panel: CSSProperties = {
  position: 'fixed', zIndex: 70, maxWidth: 'min(780px, calc(100vw - 16px))', padding: 8, borderRadius: 12, background: '#0B2E1F', color: '#fff',
  boxShadow: '0 4px 12px rgba(0,0,0,.25)', border: '1px solid #0F3A28', fontFamily: 'var(--font-brand)', fontSize: 13,
};
const tag: CSSProperties = { display: 'inline-flex', alignItems: 'center', gap: 5, padding: '0 6px', fontSize: 12, fontWeight: 700, letterSpacing: '.05em', textTransform: 'uppercase', color: '#E8F5E9' };
const iconBtn: CSSProperties = { all: 'unset', cursor: 'pointer', width: 28, height: 28, display: 'grid', placeItems: 'center', borderRadius: 7, background: btnBg, color: '#fff' };
const textBtn: CSSProperties = { all: 'unset', cursor: 'pointer', height: 28, display: 'inline-flex', alignItems: 'center', gap: 5, padding: '0 10px', borderRadius: 7, color: '#fff', fontSize: 13, fontWeight: 600 };
const num: CSSProperties = { width: 48, height: 26, padding: '0 6px', borderRadius: 7, border: '1px solid rgba(255,255,255,0.2)', background: 'transparent', color: '#fff', fontSize: 13, textAlign: 'center' };
const swatch: CSSProperties = { all: 'unset', cursor: 'pointer', width: 22, height: 22, borderRadius: 6, display: 'inline-block', flex: 'none' };
const hint: CSSProperties = { fontSize: 12, opacity: 0.75, marginTop: 8 };
