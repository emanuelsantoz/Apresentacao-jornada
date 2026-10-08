import { ChevronLeft, ChevronRight, Eye, LayoutGrid, Maximize, Pencil, StickyNote } from 'lucide-react';
import { motion } from 'motion/react';

interface Props {
  index: number; total: number; step: number; steps: number; idle: boolean;
  prev: () => void; next: () => void; overview: () => void; notes: () => void;
  editing: boolean; toggleEdit: () => void;
}

/** Barra de progresso lima + controles discretos (somem após 2 s sem mouse). */
export function Hud({ index, total, step, steps, idle, prev, next, overview, notes, editing, toggleEdit }: Props) {
  const progress = (index + (steps ? step / (steps + 1) : 0) + 1) / total;
  const btn = { all: 'unset', cursor: 'pointer', width: 40, height: 40, display: 'grid', placeItems: 'center', borderRadius: 10, color: '#fff' } as const;
  return (
    <div className="no-print" data-editor-ui>
      <div style={{ position: 'fixed', left: 0, right: 0, bottom: 0, height: 4, background: 'rgba(255,255,255,0.08)', zIndex: 40 }}>
        <motion.div style={{ height: '100%', background: 'var(--c-lime)', originX: 0 }} animate={{ scaleX: progress }} transition={{ duration: 0.4 }} />
      </div>
      <div style={{
        position: 'fixed', right: 18, top: editing ? 'auto' : 16, bottom: editing ? 16 : 'auto', zIndex: 66, display: 'flex', gap: 4, padding: 4, borderRadius: 14,
        background: 'rgba(6,24,14,0.7)', backdropFilter: 'blur(6px)', opacity: idle && !editing ? 0 : 1, transition: 'opacity .4s',
      }}>
        <button
          style={{ ...btn, width: 'auto', padding: '0 12px', gap: 6, display: 'inline-flex', alignItems: 'center', fontSize: 13, fontWeight: 600, background: editing ? 'var(--c-lime)' : 'rgba(255,255,255,0.1)', color: editing ? 'var(--c-green-900)' : '#fff' }}
          onClick={toggleEdit}
          title="Alternar modo edição / apresentação (E)"
        >
          {editing ? <><Eye size={16} /> Apresentar</> : <><Pencil size={16} /> Editar</>}
        </button>
        <button style={btn} onClick={prev} title="Anterior (←)"><ChevronLeft size={20} /></button>
        <span style={{ color: '#fff', fontSize: 14, alignSelf: 'center', padding: '0 6px', fontVariantNumeric: 'tabular-nums' }}>{index + 1}/{total}</span>
        <button style={btn} onClick={next} title="Próximo (→)"><ChevronRight size={20} /></button>
        <button style={btn} onClick={overview} title="Visão geral (O)"><LayoutGrid size={18} /></button>
        <button style={btn} onClick={notes} title="Notas do apresentador (N)"><StickyNote size={18} /></button>
        <button style={btn} onClick={() => document.documentElement.requestFullscreen?.()} title="Tela cheia (F)"><Maximize size={18} /></button>
      </div>
    </div>
  );
}
