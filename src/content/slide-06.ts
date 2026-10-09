import { FileQuestion, TicketPlus, UserPlus, UserX } from 'lucide-react';
import type { TabletDuoData } from '../components/layouts/TabletDuoLayout';
import type { SlideMeta } from '../types/slide';
import { prints } from './prints';
import { M1 } from './sections';

export const meta: SlideMeta = {
  id: 'slide-06', title: 'Como utilizar · Sem acesso e sem informação', section: M1, theme: 'light', steps: 1,
  notes: 'Tela 5: o cooperado nunca acessou o app — oriente o primeiro acesso. Tela 6: sem dados suficientes — a recomendação é abrir chamado.',
};

export const data: TabletDuoData = {
  eyebrow: 'Como utilizar · 3 de 3',
  title: 'Jornada do Cooperado sem registros',
  screens: [
    {
      tag: 'Tela 5', name: 'Nunca acessou', tone: 'info', icon: UserX,
      bullets: ['Cooperado ainda não usou o app.', 'Oriente o uso do Aplicativo'],
      screen: prints.jornadaSemAcesso,
      callout: { icon: UserPlus, title: '', text: '' },
      spot: { x: 50, y: 66 },
    },
    {
      tag: 'Tela 6', name: 'Sem informações', tone: 'alert', icon: FileQuestion,
      bullets: ['Dados insuficientes para diagnóstico'],
      screen: prints.jornadaSemInfo,
      callout: { icon: TicketPlus, title: 'Abrir Chamado', text: '' },
      spot: { x: 54, y: 66 },
    },
  ],
};
