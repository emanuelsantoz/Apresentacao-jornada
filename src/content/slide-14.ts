import { Gauge, ListChecks, Plus, Search } from 'lucide-react';
import type { AnnotatedData } from '../components/layouts/AnnotatedLayout';
import type { SlideMeta } from '../types/slide';
import { prints } from './prints';
import { M2 } from './sections';

export const meta: SlideMeta = {
  id: 'slide-14', title: 'Interface do BWS_HELP', section: M2, theme: 'light', steps: 3,
  notes: 'Apresente cada área da Caixa do Help. Ajuste os nomes e as posições dos marcadores após inserir o print real.',
};

export const data: AnnotatedData = {
  eyebrow: 'Interface',
  title: ['Conheça a', 'Caixa do Help'],
  screen: prints.helpCaixa,
  items: [
    { n: '1', icon: Gauge, title: 'Indicadores', text: 'Seus chamados por status.', pin: { x: 16, y: 26 } },
    { n: '2', icon: ListChecks, title: 'Lista de chamados', text: 'Com prioridade e status.', pin: { x: 13, y: 52 } },
    { n: '3', icon: Plus, title: 'Novo chamado', text: 'Abra um pedido em segundos.', pin: { x: 92, y: 14 } },
    { n: '4', icon: Search, title: 'Busca e filtros', text: 'Encontre qualquer chamado.', pin: { x: 79, y: 14 } },
  ],
};
