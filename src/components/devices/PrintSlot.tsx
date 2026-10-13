import { ImageUp, Trash2 } from 'lucide-react';
import { useRef, useState, type DragEvent, type ReactNode } from 'react';
import { usePrint } from '../../hooks/usePrint';
import { useSlideState } from '../../hooks/useSlideState';
import { useEditMode } from '../../edit/EditMode';
import { ExpandButton } from '../ui/ExpandImage';

interface Props {
  /** Identificador do print = nome do arquivo em public/prints/<id>.png */
  id: string;
  /** Descrição curta mostrada no botão de envio. */
  label: string;
  /** Tela de exemplo recriada em código, exibida enquanto não há print. */
  children: ReactNode;
  fit?: 'cover' | 'contain';
  /** Ponto de foco do print quando fit = cover (ex.: 'top', 'center'). */
  position?: string;
  /** Cor de fundo atrás do print (faixas livres no modo contain). */
  bg?: string;
  /** Canto do botão “expandir”: padrão embaixo à esquerda (o canto de cima costuma ter conteúdo da tela). */
  expandAt?: 'bottom-left' | 'top-right' | 'none';
}

/**
 * Área editável de print (somente no MODO EDIÇÃO). Arraste uma imagem por cima (ou use o botão que aparece ao
 * passar o mouse) para substituir a tela de exemplo. Para fixar no projeto, salve o
 * arquivo como public/prints/<id>.png.
 */
export function PrintSlot({ id, label, children, fit = 'cover', position = 'top', bg, expandAt = 'bottom-left' }: Props) {
  const { src, source, save, remove } = usePrint(id);
  const { print } = useSlideState();
  const { editing } = useEditMode();
  const canEdit = editing && !print;
  const [hover, setHover] = useState(false);
  const [drag, setDrag] = useState(false);
  const input = useRef<HTMLInputElement>(null);

  const onDrop = (e: DragEvent) => {
    e.preventDefault();
    setDrag(false);
    const f = e.dataTransfer.files?.[0];
    if (f && f.type.startsWith('image/')) void save(f);
  };

  return (
    <div
      data-print-slot={id}
      style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: bg }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onDragOver={(e) => { if (!canEdit) return; e.preventDefault(); setDrag(true); }}
      onDragLeave={() => setDrag(false)}
      onDrop={onDrop}
    >
      {src ? (
        <img src={src} alt={label} style={{ width: '100%', height: '100%', objectFit: fit, objectPosition: position, display: 'block', background: bg ?? '#fff' }} />
      ) : (
        children
      )}

      {src && !print && expandAt !== 'none' && <ExpandButton src={src} alt={label} style={expandAt === 'top-right' ? { top: 14, right: 14, left: 'auto', bottom: 'auto' } : { top: 'auto', right: 'auto', left: 14, bottom: 14 }} />}

      {canEdit && (
        <div
          className="no-print"
          style={{
            position: 'absolute', inset: 0, pointerEvents: drag || hover ? 'auto' : 'none',
            display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-end', padding: 18, gap: 10,
            background: drag ? 'rgba(11,46,31,0.6)' : 'transparent',
            outline: drag ? '4px dashed var(--ws-selection)' : 'none', outlineOffset: -10,
            opacity: drag || hover ? 1 : 0, transition: 'opacity .2s',
          }}
        >
          {drag ? (
            <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', color: '#fff', fontSize: 30, fontWeight: 600 }}>
              Solte o print aqui
            </div>
          ) : (
            <>
              {source === 'upload' && (
                <button onClick={() => void remove()} style={btn(false)} title="Remover print enviado">
                  <Trash2 size={20} />
                </button>
              )}
              <button onClick={() => input.current?.click()} style={btn(true)} title={`public/prints/${id}.png`}>
                <ImageUp size={20} /> {src ? 'Trocar print' : 'Enviar print'} · {label}
              </button>
            </>
          )}
          <input
            ref={input}
            type="file"
            accept="image/*"
            hidden
            onChange={(e) => { const f = e.target.files?.[0]; if (f) void save(f); e.target.value = ''; }}
          />
        </div>
      )}
    </div>
  );
}

const btn = (primary: boolean) => ({
  display: 'inline-flex', alignItems: 'center', gap: 10, padding: '10px 16px', borderRadius: 12, border: 'none',
  cursor: 'pointer', fontSize: 18, fontWeight: 600,
  background: primary ? 'var(--c-green-900)' : '#fff', color: primary ? '#fff' : 'var(--c-danger)',
  boxShadow: '0 8px 24px -8px rgba(0,0,0,.4)',
});
