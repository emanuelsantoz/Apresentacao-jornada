import { AlertTriangle, CheckCircle2, MousePointerClick, TicketPlus, XCircle, Zap } from 'lucide-react';
import type { DeviceFocusData } from '../components/layouts/DeviceFocusLayout';
import type { SlideMeta } from '../types/slide';
import { prints } from './prints';
import { M1 } from './sections';

export const meta: SlideMeta = {
  id: 'slide-08', title: 'Abrir chamado via Jornada · Onde', section: M1, theme: 'light',
  notes: 'O botão Abrir Chamado está disponível em todas as seções: erro, alerta e sucesso.',
};

export const data: DeviceFocusData = {
  eyebrow: 'Chamados via Jornada',
  title: ['Chamado a um clique,', 'em qualquer sessão'],
  bullets: [
    { icon: TicketPlus, strong: 'Abrir Chamado', text: 'em toda sessão.' },
    { icon: MousePointerClick, text: 'Viu algo estranho? Registre na hora.' },
  ],
  chip: { text: 'Erro · Alerta · Sucesso', icon: Zap },
  device: 'tablet',
  screen: prints.jornadaBotaoChamado,
  floats: [
    { icon: XCircle, title: 'Erro', text: 'Abrir Chamado disponível', tone: 'danger', x: 1440, y: 300, w: 420 },
    { icon: AlertTriangle, title: 'Alerta', text: 'Abrir Chamado disponível', tone: 'alert', x: 1440, y: 470, w: 420 },
    { icon: CheckCircle2, title: 'Sucesso', text: 'Abrir Chamado disponível', tone: 'success', x: 1440, y: 640, w: 420 },
  ],
};
