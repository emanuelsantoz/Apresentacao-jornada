import { Activity, MessagesSquare, Timer } from 'lucide-react';
import type { DeviceFocusData } from '../components/layouts/DeviceFocusLayout';
import type { SlideMeta } from '../types/slide';
import { prints } from './prints';
import { M2 } from './sections';

export const meta: SlideMeta = {
  id: 'slide-17', title: 'Acompanhamento', section: M2, theme: 'light',
  notes: 'Onde: Caixa do Help → Meus chamados (confirmar nome do menu). Lá você vê status, histórico de respostas e prazo do SLA.',
};

export const data: DeviceFocusData = {
  eyebrow: 'Acompanhamento',
  title: ['Acompanhe sem', 'precisar perguntar'],
  where: ['BWS_HELP', 'Caixa do Help', 'Meus chamados'],
  bullets: [
    { icon: Activity, strong: 'Status', text: 'atual do chamado.' },
    { icon: MessagesSquare, strong: 'Histórico', text: 'de respostas.' },
    { icon: Timer, strong: 'Prazo', text: 'do SLA.' },
  ],
  device: 'laptop',
  screen: prints.helpAcompanhamento,
};
