import { FolderOpen, Headset, MessageCircle } from 'lucide-react';
import type { RulesData } from '../components/layouts/RulesLayout';
import type { SlideMeta } from '../types/slide';
import { M2 } from './sections';

export const meta: SlideMeta = {
  id: 'slide-21', title: 'Combinado de comunicação', section: M2, theme: 'light', steps: 2,
  notes: 'Cada coisa no seu lugar. Arquivos e planilhas pesadas vão para o SharePoint, não para o chat. Encerramento com a frase-mãe.',
};

export const data: RulesData = {
  eyebrow: 'Combinado',
  title: ['Cada coisa', 'no seu lugar'],
  rules: [
    { icon: Headset, use: 'BWS_HELP', name: 'Chamado', text: 'Toda solicitação começa aqui', featured: true },
    { icon: MessageCircle, use: 'Comunicação', name: 'Meios', text: 'Casos prioritários. Os demais seguem o fluxo normal' },
    { icon: FolderOpen, use: 'Arquivos', name: 'SharePoint', text: 'Arquivos e planilhas' },
  ],
  motto: 'Cooperar para transformar vidas',
};
