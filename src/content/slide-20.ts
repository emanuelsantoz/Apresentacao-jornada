import { MessageCircle, TicketPlus } from 'lucide-react';
import type { StatementData } from '../components/layouts/StatementLayout';
import type { SlideMeta } from '../types/slide';
import { M2 } from './sections';

export const meta: SlideMeta = {
  id: 'slide-20', title: 'E o Teams?', section: M2, theme: 'aurora', steps: 2,
  notes: 'Pergunta → pausa → resposta. Regra de ouro: primeiro o chamado. Teams só para casos prioritários; o resto segue a fila normal.',
};

export const data: StatementData = {
  eyebrow: 'Alinhamento de comunicação',
  question: 'E AI, Agora é só CHAMADO para falar com a TI?',
  answer: ['', 'Não, não...'],
  rule: {
    label: 'Regra de ouro',
    steps: [
      { n: '', icon: TicketPlus, text: 'Abra o chamado' },
      { n: '', icon: MessageCircle, text: 'Se necessário, utilize outros meios' },
    ],
  },
};
