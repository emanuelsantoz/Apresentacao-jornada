import { FolderOpen, MessageCircle, Ticket } from 'lucide-react';
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
    { icon: Ticket, use: 'Sempre primeiro', name: 'Chamado', text: 'Todo pedido começa aqui.', featured: true },
    { icon: MessageCircle, use: 'Só prioridade', name: 'Teams', text: 'Casos prioritários. O resto segue a fila.' },
    { icon: FolderOpen, use: 'Arquivos', name: 'SharePoint', text: 'Arquivos e planilhas pesadas.' },
  ],
  avoid: 'Anexo pesado no chat',
  motto: 'Cooperar para transformar vidas do nosso cooperado.',
};
