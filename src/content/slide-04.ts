import { History, MousePointerClick, PlayCircle, Smartphone } from 'lucide-react';
import type { TabletDuoData } from '../components/layouts/TabletDuoLayout';
import type { SlideMeta } from '../types/slide';
import { prints } from './prints';
import { M1 } from './sections';

export const meta: SlideMeta = {
  id: 'slide-04', title: 'Como utilizar · Início e histórico', section: M1, theme: 'light', steps: 1,
  notes: 'Tela 1: inicie o atendimento e clique no card Jornada do Cooperado. Tela 2: para quem já acessou o app, aparecem as 3 últimas sessões de uso.',
};

export const data: TabletDuoData = {
  eyebrow: 'Como utilizar · 1 de 3',
  title: 'Do atendimento à Jornada em 1 clique',
  screens: [
    {
      tag: 'Tela 1', name: 'Início', tone: 'green', icon: PlayCircle,
      bullets: ['Inicie o atendimento.', 'Clique no card “Jornada do Cooperado”.'],
      screen: prints.jornadaInicio,
      callout: { icon: MousePointerClick, title: '1 clique', text: 'O card aparece logo após iniciar o atendimento.' },
      spot: { x: 18, y: 62 },
    },
    {
      tag: 'Tela 2', name: 'Já acessou o app', tone: 'info', icon: History,
      bullets: ['Veja as 3 últimas sessões no app Barracred.', 'Cada sessão mostra o que aconteceu.'],
      screen: prints.jornadaSessoes,
      callout: { icon: Smartphone, title: 'Últimas 3 sessões', text: 'Histórico recente de uso do app pelo cooperado.' },
      spot: { x: 80, y: 30 },
    },
  ],
};
