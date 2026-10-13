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
  screen: prints.helpDashboard,
  items: [
    { n: '1', icon: Gauge, title: 'Indicadores', text: 'Seus chamados por status.', pin: { x: 28, y: 20 } },
    { n: '2', icon: ListChecks, title: 'Lista de chamados', text: 'Com prioridade e status.', pin: { x: 12, y: 45 } },
    { n: '3', icon: Plus, title: 'Novo chamado', text: 'Abra um pedido em segundos.', pin: { x: 71, y: 7 } },
    { n: '4', icon: Search, title: 'Busca e filtros', text: 'Encontre qualquer chamado.', pin: { x: 86, y: 7 } },
  ],
};
