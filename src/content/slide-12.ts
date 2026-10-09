import { Headset, Timer } from 'lucide-react';
import type { ConceptsData } from '../components/layouts/ConceptsLayout';
import type { SlideMeta } from '../types/slide';
import { M2 } from './sections';

export const meta: SlideMeta = {
  id: 'slide-12', title: 'Conceitos base', section: M2, theme: 'light', steps: 1,
  notes: 'Help Desk: canal único de ajuda; todo pedido vira chamado. SLA: prazo combinado para resolver. OLA: acordo interno entre áreas para cumprir esse prazo.',
};

export const data: ConceptsData = {
  eyebrow: 'Conceitos base',
  title: ['Duas palavras que', 'você vai ouvir'],
  concepts: [
    {
      icon: Headset, kicker: 'O que é', name: 'Help Desk', visual: 'funnel',
      defs: [
        { term: 'Canal', text: 'Unificação de registros' },
        { term: 'Registro', text: 'Todo pedido vira um chamado' },
      ],
    },
    {
      icon: Timer, kicker: 'O que é', name: 'SLA e OLA', visual: 'timeline',
      defs: [
        { term: 'SLA', text: 'Prazo acordado para resolver o chamado' },
        { term: 'OLA', text: 'Acordo interno entre áreas para entregar o resultado' },
      ],
    },
  ],
};
