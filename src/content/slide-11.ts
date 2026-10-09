import { LifeBuoy } from 'lucide-react';
import type { ModuleCoverData } from '../components/layouts/ModuleCoverLayout';
import type { SlideMeta } from '../types/slide';
import { M2 } from './sections';

export const meta: SlideMeta = {
  id: 'slide-11', title: 'BWS_HELP', section: M2, theme: 'aurora', bare: true, 
  notes: 'Fase 2. Agora o canal oficial para pedir ajuda à TI.',
};

export const data: ModuleCoverData = {
  chip: 'Fase 2',
  number: '02',
  title: 'BWS_HELP',
  line: 'Nossa ferramenta de Help Desk',
  icon: LifeBuoy,
  topics: ['Conceitos', 'Métricas', 'Abertura', 'Status', 'Avaliação'],
};
