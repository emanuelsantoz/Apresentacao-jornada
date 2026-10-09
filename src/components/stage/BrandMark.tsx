import { ImageUp, RotateCcw } from 'lucide-react';
import { useRef, useState, type CSSProperties, type DragEvent } from 'react';
import { usePrint } from '../../hooks/usePrint';
import { useSlideState } from '../../hooks/useSlideState';
import { useEditMode } from '../../edit/EditMode';

/**
 * Logotipo Barracred — clicável para trocar no MODO EDIÇÃO.
 *
 * Clique na logo (ou arraste uma imagem sobre ela) e escolha um PNG/SVG: a troca vale
 * para TODOS os slides com o mesmo tipo de fundo e fica salva neste navegador.
 * Há duas versões, porque o fundo muda:
 *   - escura  → usada sobre fundo escuro/verde (logo com texto branco)
 *   - clara   → usada sobre fundo claro (logo com texto verde #104726)
 * Se só uma versão for enviada, ela é usada nos dois fundos.
 *
 * Para fixar no projeto (vale para o build e o PDF), salve em public/brand/:
 *   logo-branco.png (ou .svg)  e  logo-verde.png (ou .svg)
 */
const variants = {
  dark: { id: 'logo-fundo-escuro', files: ['brand/logo-branco.svg', 'brand/logo-branco.png'], label: 'fundo escuro' },
  light: { id: 'logo-fundo-claro', files: ['brand/logo-verde.svg', 'brand/logo-verde.png'], label: 'fundo claro' },
};

export function BrandMark({ dark, height = 46 }: { dark?: boolean; height?: number }) {
  const { print } = useSlideState();
  const { editing } = useEditMode();
  const mine = dark ? variants.dark : variants.light;
  const other = dark ? variants.light : variants.dark;
  const own = usePrint(mine.id, mine.files);
  const alt = usePrint(other.id, other.files);
  const input = useRef<HTMLInputElement>(null);
  const [hover, setHover] = useState(false);
  const [drag, setDrag] = useState(false);

  // Prioridade: logo desta versão → logo da outra versão → wordmark provisório
  const src = own.src ?? alt.src;

  const mark = src ? (
    <img src={src} alt="Barracred" style={{ height, maxWidth: height * 7, objectFit: 'contain', display: 'block' }} />
  ) : (
    <Wordmark dark={dark} height={height} />
  );

  if (print || !editing) return <span data-no-edit style={card}>{mark}</span>;

  const onDrop = (e: DragEvent) => {
    e.preventDefault();
    setDrag(false);
    const f = e.dataTransfer.files?.[0];
    if (f && f.type.startsWith('image/')) void own.save(f);
  };

  const ring = hover || drag;
  return (
    <span
      data-no-edit
      style={{ ...card, position: 'relative' }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
      onDragLeave={() => setDrag(false)}
      onDrop={onDrop}
    >
      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); input.current?.click(); }}
        title={`Clique para trocar a logo (${mine.label}) — PNG ou SVG`}
        style={{
          all: 'unset', cursor: 'pointer', display: 'inline-flex', padding: 8, margin: -8, borderRadius: 12,
          outline: ring ? '2px dashed var(--ws-action)' : '2px dashed transparent',
          background: drag ? 'rgba(18,134,79,0.12)' : 'transparent', transition: 'outline-color .2s',
        }}
      >
        {mark}
      </button>

      {ring && (
        <span className="no-print" style={{ ...tip, color: '#fff', background: 'var(--ws-action)' }}>
          <ImageUp size={16} /> {drag ? 'Solte a imagem' : 'Trocar logo'}
          {own.source === 'upload' && (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); void own.remove(); }}
              title="Voltar para a logo padrão"
              style={{ all: 'unset', cursor: 'pointer', display: 'inline-flex', marginLeft: 6, opacity: 0.8 }}
            >
              <RotateCcw size={16} />
            </button>
          )}
        </span>
      )}

      <input
        ref={input}
        type="file"
        accept="image/png,image/svg+xml,image/webp,image/jpeg"
        hidden
        onClick={(e) => e.stopPropagation()}
        onChange={(e) => { const f = e.target.files?.[0]; if (f) void own.save(f); e.target.value = ''; }}
      />
    </span>
  );
}

/** Div da logo: fundo branco para a logo colorida funcionar em qualquer fundo de slide. */
const card: CSSProperties = {
  display: 'inline-flex', background: '#fff', padding: '10px 20px', margin: '-10px -20px', borderRadius: 14,
};

const tip: CSSProperties = {
  position: 'absolute', left: 0, top: '100%', marginTop: 12, display: 'inline-flex', alignItems: 'center', gap: 6,
  padding: '6px 12px', borderRadius: 8, fontSize: 16, fontWeight: 600, whiteSpace: 'nowrap', zIndex: 30,
  boxShadow: '0 8px 20px -8px rgba(0,0,0,.4)',
};

/** Wordmark provisório, usado enquanto não há logo enviada. */
function Wordmark({ dark, height }: { dark?: boolean; height: number }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 12, fontWeight: 700, fontSize: height * 0.6, letterSpacing: '-0.02em', color: dark ? '#fff' : 'var(--c-green-900)' }}>
      <svg width={height * 0.8} height={height * 0.8} viewBox="0 0 40 40" aria-hidden>
        <rect width="40" height="40" rx="11" fill={dark ? 'var(--c-green-600)' : 'var(--c-green-900)'} />
        <path d="M13 9 v22 M13 21 a7 7 0 1 0 14 0 a7 7 0 1 0 -14 0" stroke="var(--c-lime)" strokeWidth="4.5" fill="none" strokeLinecap="round" />
      </svg>
      barracred
    </span>
  );
}
