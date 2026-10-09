import { LifeBuoy, Route } from 'lucide-react';
import type { AgendaData } from '../components/layouts/AgendaLayout';
import type { SlideMeta } from '../types/slide';
import { M1 } from './sections';

export const meta: SlideMeta = {
  id: 'slide-02', title: 'Agenda', section: M1, theme: 'light', steps: 1, chromeOnDark: true,
  notes: 'Duas fases: primeiro a Jornada do Cooperado; na sequência, o BWS_HELP.',
};

export const data: AgendaData = {
  eyebrow: 'Agenda',
  title: 'Qual a nossa Programação de hoje?',
  side: '',
  items: [
    { n: '01', icon: Route, title: 'Jornada do Cooperado', text: 'Diagnóstico rápido dentro do atendimento', topics: ['Módulos', 'Diagnóstico', 'Chamados'] },
    { n: '02', icon: LifeBuoy, title: 'BWS_HELP', text: 'Chamados de TI com acompanhamento', topics: ['Aplicação', 'Conceitos', 'Usabilidade', 'Métricas'] },
  ],
};
