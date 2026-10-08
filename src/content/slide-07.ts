import { Cpu, ScrollText, Smartphone } from 'lucide-react';
import type { FlowData } from '../components/layouts/FlowLayout';
import type { SlideMeta } from '../types/slide';
import { M1 } from './sections';

export const meta: SlideMeta = {
  id: 'slide-07', title: 'Como funciona por trás das telas', section: M1, theme: 'light', steps: 2,
  notes: 'A Jornada é 100% baseada em registros de logs. O processamento só acontece depois que o cooperado realiza alguma ação no app.',
};

export const data: FlowData = {
  eyebrow: 'Por trás das telas',
  title: ['A Jornada lê o que', 'o app registra'],
  nodes: [
    { n: '01', icon: Smartphone, title: 'Ação do cooperado', text: 'Ele usa o app Barracred.' },
    { n: '02', icon: ScrollText, title: 'Registro em log', text: 'Cada passo vira um registro.' },
    { n: '03', icon: Cpu, title: 'Diagnóstico', text: 'Os logs viram status na Jornada.' },
  ],
  band: { strong: '100% baseada em logs.', text: 'Sem ação do cooperado, não há dado.' },
};
