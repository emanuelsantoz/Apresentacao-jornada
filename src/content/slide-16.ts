import { BellRing, Hash, MailCheck, Tags } from 'lucide-react';
import type { DeviceFocusData } from '../components/layouts/DeviceFocusLayout';
import type { SlideMeta } from '../types/slide';
import { prints } from './prints';
import { M2 } from './sections';

export const meta: SlideMeta = {
  id: 'slide-16', title: 'Notificação BWS', section: M2, theme: 'light',
  notes: 'Ao abrir o chamado, chega um e‑mail automático com número e categoria.',
};

export const data: DeviceFocusData = {
  eyebrow: 'Notificação BWS',
  title: ['Aberto?', 'O e‑mail confirma.'],
  bullets: [
    { icon: MailCheck, text: 'E‑mail automático na abertura.' },
    { icon: Tags, text: 'Traz número e categoria do chamado.' },
  ],
  device: 'laptop',
  screen: prints.helpEmail,
  floats: [
    { icon: BellRing, title: 'Novo e‑mail', text: 'BWS_HELP · Chamado aberto', tone: 'green', x: 1290, y: 150, w: 500, drop: true },
    { icon: Hash, title: 'Nº + categoria', tone: 'lime', x: 790, y: 720, w: 380 },
  ],
};
