import { Sparkles, Star, Timer } from 'lucide-react';
import type { DeviceFocusData } from '../components/layouts/DeviceFocusLayout';
import type { SlideMeta } from '../types/slide';
import { prints } from './prints';
import { M2 } from './sections';

export const meta: SlideMeta = {
  id: 'slide-19', title: 'Avaliação', section: M2, theme: 'light',
  notes: 'Ao final de cada chamado aparece a avaliação de satisfação. Leva segundos e orienta melhorias.',
};

export const data: DeviceFocusData = {
  eyebrow: 'Avaliação',
  title: ['Sua nota melhora', 'o atendimento'],
  bullets: [
    { icon: Star, text: 'Ao fechar o chamado, avalie.' },
    { icon: Timer, text: 'Leva segundos.' },
    { icon: Sparkles, text: 'Sua nota orienta melhorias.' },
  ],
  device: 'laptop',
  screen: prints.helpAvaliacao,
  floats: [{ icon: Star, title: 'Avalie sempre', text: 'Toda nota conta', tone: 'lime', x: 790, y: 700, w: 380 }],
};
