import { Bold, Minus, Plus, RotateCcw, Type, X } from 'lucide-react';
import { useCallback, useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from 'react';
import { directTextNodes, findEditable, keyOf, originalsOf } from './domText';
import { edits, useAllEdits } from './editsStore';

/** Paleta rápida (marca Barracred + texto + semânticos). */
const SWATCHES = [
  { c: '#104726', n: 'Verde institucional' }, { c: '#28972E', n: 'Verde principal' }, { c: '#1E6D2F', n: 'Verde apoio' },
  { c: '#AFBF30', n: 'Lima' }, { c: '#23775B', n: 'Verde complementar' }, { c: '#39A3BE', n: 'Azul' },
  { c: '#DCA349', n: 'Dourado' }, { c: '#F2EB80', n: 'Amarelo' }, { c: '#0F2A1A', n: 'Texto' },
  { c: '#46604F', n: 'Texto suave' }, { c: '#FFFFFF', n: 'Branco' }, { c: '#E08A1E', n: 'Alerta' }, { c: '#C8423B', n: 'Erro' },
];

interface Selection { el: HTMLElement; root: HTMLElement; slideId: string; key: string }

const rgbToHex = (rgb: string) => {
  const m = rgb.match(/\d+/g);
  if (!m) return '#000000';
  return `#${m.slice(0, 3).map((x) => Number(x).toString(16).padStart(2, '0')).join('')}`;
};

/**
 * Editor de textos do modo edição:
 *  - passar o mouse destaca o texto editável;
 *  - clicar abre a barra: conteúdo, cor, tamanho e peso.
 * As mudanças aparecem na hora e ficam salvas neste navegador.
 */
export function TextEditor() {
  useAllEdits(); // re-renderiza a barra quando as edições mudam
  const [hover, setHover] = useState<HTMLElement | null>(null);
  const [sel, setSel] = useState<Selection | null>(null);
  const [tick, force] = useState(0);
  const bar = useRef<HTMLDivElement>(null);

  // hover
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const t = e.target as Element;
      if (t.closest('[data-editor-ui]')) return;
      setHover(findEditable(t)?.el ?? null);
    };
    document.addEventListener('mousemove', onMove);
    return () => document.removeEventListener('mousemove', onMove);
  }, []);

  // clique seleciona (fase de captura: impede navegação e ações do slide)
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const t = e.target as Element;
      if (t.closest('[data-editor-ui]')) return;
      const hit = findEditable(t);
      if (hit) {
        e.preventDefault();
        e.stopPropagation();
        const slideId = hit.root.dataset.slideId!;
        setSel({ el: hit.el, root: hit.root, slideId, key: keyOf(hit.el, hit.root) });
      } else if (t.closest('[data-slide-root]')) {
        setSel(null);
      }
    };
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setSel(null); };
    document.addEventListener('click', onClick, true);
    window.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('click', onClick, true); window.removeEventListener('keydown', onKey); };
  }, []);

  // seleção perdida quando o elemento sai da tela (troca de slide)
  useEffect(() => {
    if (!sel) return;
    const id = window.setInterval(() => {
      if (!sel.el.isConnected) setSel(null);
      else force((n) => n + 1); // reposiciona caixas durante animações
    }, 200);
    return () => window.clearInterval(id);
  }, [sel]);

  const update = useCallback((patch: Parameters<typeof edits.set>[2]) => {
    if (sel) edits.set(sel.slideId, sel.key, patch);
  }, [sel]);

  const o = sel ? edits.get()[sel.slideId]?.[sel.key] : undefined;
  const originals = sel ? originalsOf(sel.el) : [];
  const nodes = sel ? directTextNodes(sel.el) : [];
  const cs = sel ? getComputedStyle(sel.el) : null;
  const size = o?.fontSize ?? (cs ? Math.round(parseFloat(cs.fontSize)) : 30);
  const color = o?.color ?? (cs ? rgbToHex(cs.color) : '#000000');
  const weight = o?.fontWeight ?? (cs ? Number(cs.fontWeight) : 400);

  // posição da barra (fora do palco, em coordenadas da janela)
  const [pos, setPos] = useState<{ left: number; top: number }>({ left: 0, top: 0 });
  useLayoutEffect(() => {
    if (!sel || !bar.current) return;
    const r = sel.el.getBoundingClientRect();
    const b = bar.current.getBoundingClientRect();
    let top = r.bottom + 12;
    if (top + b.height > window.innerHeight - 8) top = Math.max(8, r.top - b.height - 12);
    const left = Math.min(Math.max(8, r.left), window.innerWidth - b.width - 8);
    setPos((p) => (p.left === left && p.top === top ? p : { left, top }));
  }, [sel, tick, o]);

  const box = (el: HTMLElement, tone: 'hover' | 'sel'): CSSProperties => {
    const r = el.getBoundingClientRect();
    return {
      position: 'fixed', left: r.left - 4, top: r.top - 3, width: r.width + 8, height: r.height + 6, pointerEvents: 'none', zIndex: 60,
      borderRadius: 6, outline: tone === 'sel' ? '2.5px solid #AFBF30' : '2px dashed rgba(175,191,48,0.9)',
      background: tone === 'sel' ? 'rgba(175,191,48,0.10)' : 'rgba(175,191,48,0.06)',
    };
  };

  return (
    <>
      {hover && hover !== sel?.el && <div data-editor-ui style={box(hover, 'hover')} />}
      {sel && <div data-editor-ui style={box(sel.el, 'sel')} />}

      {sel && (
        <div ref={bar} data-editor-ui style={{ ...panel, left: pos.left, top: pos.top }} onClick={(e) => e.stopPropagation()}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
            <Type size={16} color="#AFBF30" />
            <b style={{ fontSize: 13, letterSpacing: '.06em', textTransform: 'uppercase', color: '#AFBF30' }}>Editar texto</b>
            <span style={{ flex: 1 }} />
            <button style={iconBtn} title="Restaurar original" onClick={() => edits.reset(sel.slideId, sel.key)}><RotateCcw size={16} /></button>
            <button style={iconBtn} title="Fechar (Esc)" onClick={() => setSel(null)}><X size={16} /></button>
          </div>

          {nodes.map((_, i) => (
            <textarea
              key={i}
              autoFocus={i === 0}
              rows={Math.min(4, Math.max(1, Math.ceil((o?.texts?.[i] ?? originals[i]).length / 38)))}
              value={o?.texts?.[i] ?? originals[i]}
              onChange={(e) => {
                const texts = originals.map((orig, j) => (j === i ? e.target.value : o?.texts?.[j] ?? orig));
                update({ texts: texts.every((t, j) => t === originals[j]) ? undefined : texts });
              }}
              style={textarea}
            />
          ))}

          <div style={row}>
            <span style={label}>Cor</span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, flex: 1 }}>
              {SWATCHES.map((s) => (
                <button
                  key={s.c}
                  title={s.n}
                  onClick={() => update({ color: s.c })}
                  style={{ all: 'unset', cursor: 'pointer', width: 20, height: 20, borderRadius: 6, background: s.c, boxShadow: color.toLowerCase() === s.c.toLowerCase() ? '0 0 0 2px #0a2416, 0 0 0 4px #AFBF30' : 'inset 0 0 0 1px rgba(255,255,255,.25)' }}
                />
              ))}
              <label title="Outra cor" style={{ position: 'relative', width: 20, height: 20, borderRadius: 6, overflow: 'hidden', cursor: 'pointer', background: 'conic-gradient(red, yellow, lime, cyan, blue, magenta, red)' }}>
                <input type="color" value={color} onChange={(e) => update({ color: e.target.value })} style={{ opacity: 0, position: 'absolute', inset: 0, cursor: 'pointer' }} />
              </label>
            </div>
          </div>

          <div style={row}>
            <span style={label}>Tamanho</span>
            <button style={iconBtn} onClick={() => update({ fontSize: Math.max(12, size - 2) })}><Minus size={14} /></button>
            <input type="range" min={12} max={220} value={size} onChange={(e) => update({ fontSize: Number(e.target.value) })} style={{ flex: 1, accentColor: '#AFBF30' }} />
            <button style={iconBtn} onClick={() => update({ fontSize: Math.min(220, size + 2) })}><Plus size={14} /></button>
            <input type="number" min={12} max={220} value={size} onChange={(e) => update({ fontSize: Number(e.target.value) || undefined })} style={num} />
            <span style={{ fontSize: 12, opacity: 0.6 }}>px</span>
          </div>

          <div style={row}>
            <span style={label}>Peso</span>
            {[400, 500, 600, 700].map((w) => (
              <button
                key={w}
                onClick={() => update({ fontWeight: w })}
                style={{ ...chip, fontWeight: w, background: weight === w ? '#AFBF30' : 'rgba(255,255,255,0.08)', color: weight === w ? '#0a2416' : '#fff' }}
              >
                {w === 700 ? <Bold size={13} /> : { 400: 'Regular', 500: 'Medium', 600: 'SemiBold' }[w]}
              </button>
            ))}
          </div>
          {size < 24 && <div style={{ fontSize: 12, color: '#F2EB80', marginTop: 8 }}>Abaixo de 24 px fica difícil de ler no telão.</div>}
        </div>
      )}
    </>
  );
}

const panel: CSSProperties = {
  position: 'fixed', zIndex: 70, width: 380, padding: 14, borderRadius: 14, background: 'rgba(8,30,18,0.97)', color: '#fff',
  boxShadow: '0 20px 50px -12px rgba(0,0,0,.6)', border: '1px solid rgba(175,191,48,0.35)', fontFamily: 'var(--font-brand)', fontSize: 14,
};
const row: CSSProperties = { display: 'flex', alignItems: 'center', gap: 8, marginTop: 10 };
const label: CSSProperties = { width: 62, fontSize: 12, opacity: 0.7, flex: 'none' };
const iconBtn: CSSProperties = { all: 'unset', cursor: 'pointer', width: 26, height: 26, display: 'grid', placeItems: 'center', borderRadius: 7, background: 'rgba(255,255,255,0.08)' };
const chip: CSSProperties = { all: 'unset', cursor: 'pointer', padding: '4px 9px', borderRadius: 7, fontSize: 12, display: 'inline-flex', alignItems: 'center' };
const num: CSSProperties = { width: 52, padding: '4px 6px', borderRadius: 7, border: '1px solid rgba(255,255,255,0.2)', background: 'transparent', color: '#fff', fontSize: 13 };
const textarea: CSSProperties = {
  width: '100%', boxSizing: 'border-box', resize: 'vertical', padding: '8px 10px', borderRadius: 8, border: '1px solid rgba(175,191,48,0.45)',
  background: 'rgba(255,255,255,0.06)', color: '#fff', fontFamily: 'inherit', fontSize: 15, lineHeight: 1.35, marginBottom: 6,
};
