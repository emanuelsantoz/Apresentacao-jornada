import { LayoutGrid, Paperclip, Plus, Send } from 'lucide-react';
import type { AnnotatedData } from '../components/layouts/AnnotatedLayout';
import type { SlideMeta } from '../types/slide';
import { prints } from './prints';
import { M2 } from './sections';

export const meta: SlideMeta = {
  id: 'slide-15', title: 'Abertura de chamados', section: M2, theme: 'light', steps: 3,
  notes: 'Vale para qualquer categoria. Confirme os rótulos dos botões com o sistema e reposicione os marcadores sobre o print real.',
};

export const data: AnnotatedData = {
  eyebrow: 'Abertura de chamados',
  title: ['Abra um chamado', 'em 4 passos'],
  screen: prints.helpNovo,
  items: [
    { n: '1', icon: Plus, title: 'Novo chamado', text: 'Clique em “+ Novo chamado”.', pin: { x: 14, y: 6 } },
    { n: '2', icon: LayoutGrid, title: 'Categoria', text: 'Escolha o assunto certo.', pin: { x: 12, y: 24 } },
    { n: '3', icon: Paperclip, title: 'Detalhe', text: 'Descreva e anexe prints.', pin: { x: 12, y: 47 } },
    { n: '4', icon: Send, title: 'Enviar', text: 'Confirme o envio.', pin: { x: 67, y: 84 } },
  ],
};
