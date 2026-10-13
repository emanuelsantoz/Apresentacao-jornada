import { Maximize2, X } from 'lucide-react';
import { useEffect, useState, type CSSProperties } from 'react';
import { createPortal } from 'react-dom';

/**
 * Botão “expandir” no canto da tela de um mockup: abre a imagem inteira, maior, sobre o slide.
 * Fecha com Esc, com o X ou clicando fora. Não aparece no PDF nem nas miniaturas (quem usa
 * só renderiza fora do modo de impressão).
 */
export function ExpandButton({ src, alt, size = 44, style }: { src: string; alt: string; size?: number; style?: CSSProperties }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        data-editor-ui
        className="no-print"
        aria-label="Expandir imagem"
        title="Expandir imagem"
        onClick={(e) => { e.stopPropagation(); setOpen(true); }}
        style={{
          all: 'unset', cursor: 'pointer', position: 'absolute', top: 14, right: 14, zIndex: 6, width: size, height: size, boxSizing: 'border-box',
          display: 'grid', placeItems: 'center', borderRadius: 10, color: '#fff', background: 'rgba(11,46,31,0.78)',
          boxShadow: '0 2px 8px rgba(0,0,0,.3)', ...style,
        }}
      >
        <Maximize2 size={size * 0.46} />
      </button>
      {open && createPortal(<Lightbox src={src} alt={alt} onClose={() => setOpen(false)} />, document.body)}
    </>
  );
}

function Lightbox({ src, alt, onClose }: { src: string; alt: string; onClose: () => void }) {
  // enquanto aberto, Esc e setas só valem aqui (não trocam o slide por trás)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      e.stopPropagation();
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey, true);
    return () => window.removeEventListener('keydown', onKey, true);
  }, [onClose]);

  return (
    <div
      data-editor-ui
      role="dialog"
      aria-label={alt}
      onClick={(e) => { e.stopPropagation(); onClose(); }}
      style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'grid', placeItems: 'center', padding: 28, background: 'rgba(5,20,13,0.93)', cursor: 'zoom-out' }}
    >
      <img
        src={src}
        alt={alt}
        style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', display: 'block', borderRadius: 8, background: '#fff', boxShadow: '0 12px 48px rgba(0,0,0,.5)' }}
      />
      <button
        aria-label="Fechar"
        title="Fechar (Esc)"
        onClick={(e) => { e.stopPropagation(); onClose(); }}
        style={{ all: 'unset', cursor: 'pointer', position: 'absolute', top: 16, right: 16, width: 44, height: 44, display: 'grid', placeItems: 'center', borderRadius: 10, color: '#fff', background: 'rgba(255,255,255,0.14)' }}
      >
        <X size={24} />
      </button>
    </div>
  );
}
