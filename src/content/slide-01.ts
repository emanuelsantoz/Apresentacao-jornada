import type { CoverData } from '../components/layouts/CoverLayout';
import type { SlideMeta } from '../types/slide';
import { prints } from './prints';
import { M1 } from './sections';

export const meta: SlideMeta = {
  id: 'slide-01', title: 'Capa', section: M1, theme: 'aurora', bare: true, 
  notes: 'Boas-vindas. Hoje: duas ferramentas novas para destravar o atendimento ao cooperado.',
};

export const data: CoverData = {
  eyebrow: 'Treinamento',
  titleA: 'Jornada do Cooperado',
  titleB: 'BWS_HELP',
  subtitle: 'Soluções práticas para desafios do dia a dia',
  meta: 'Outubro · 2026',
  tablet: prints.jornadaSessoes,
  laptop: prints.helpCaixa,
};
