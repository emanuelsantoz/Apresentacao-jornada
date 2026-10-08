import { BellRing, Hash, MailCheck, Save } from 'lucide-react';
import type { DeviceFocusData } from '../components/layouts/DeviceFocusLayout';
import type { SlideMeta } from '../types/slide';
import { prints } from './prints';
import { M1 } from './sections';

export const meta: SlideMeta = {
  id: 'slide-10', title: 'Validação do chamado', section: M1, theme: 'light',
  notes: 'Como saber que deu certo: o e‑mail de confirmação chega logo após a criação do chamado. Guarde o número.',
};

export const data: DeviceFocusData = {
  eyebrow: 'Validação do chamado',
  title: ['Chegou o e‑mail?', 'Chamado aberto.'],
  bullets: [
    { icon: MailCheck, text: 'Confirmação chega logo após a criação.' },
    { icon: Save, strong: 'Guarde', text: 'o número do chamado.' },
  ],
  device: 'laptop',
  screen: prints.jornadaEmail,
  floats: [
    { icon: BellRing, title: 'Novo e‑mail', text: 'Chamado aberto via Jornada', tone: 'green', x: 1290, y: 150, w: 500, drop: true },
    { icon: Hash, title: 'Nº do chamado', text: 'Use para acompanhar', tone: 'lime', x: 790, y: 700, w: 400, at: 0 },
  ],
};
