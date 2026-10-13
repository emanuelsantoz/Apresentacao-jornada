import { AlertTriangle, CheckCircle2, XCircle, Zap } from 'lucide-react';
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
  title: ['Chamado a um clique,', 'em qualquer cenário'],
  bullets: [],
  // cards em pilha, alinhados à esquerda do título, com o selo logo abaixo
  chip: { text: 'Erro · Alerta · Sucesso', icon: Zap, y: 800 },
  device: 'tablet',
  screen: prints.jornadaBotaoChamado,
  floats: [
    { icon: XCircle, title: 'Erro', text: 'Abrir Chamado disponível', tone: 'danger', x: 96, y: 400, w: 560 },
    { icon: AlertTriangle, title: 'Alerta', text: 'Abrir Chamado disponível', tone: 'alert', x: 96, y: 532, w: 560 },
    { icon: CheckCircle2, title: 'Sucesso', text: 'Abrir Chamado disponível', tone: 'success', x: 96, y: 664, w: 560 },
  ],
};
