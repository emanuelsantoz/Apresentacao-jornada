import type { CoverData } from '../components/layouts/CoverLayout';
import type { SlideMeta } from '../types/slide';
import { prints } from './prints';
import { M1 } from './sections';

export const meta: SlideMeta = {
  id: 'slide-01', title: 'Capa', section: M1, theme: 'aurora', bare: true, shapes: 'none', 
  notes: 'Boas-vindas. Hoje: duas ferramentas novas para destravar o atendimento ao cooperado.',
};

export const data: CoverData = {
  eyebrow: 'Treinamento · Consultoria e Atendimento',
  titleA: 'Jornada do Cooperado',
  titleB: 'BWS_HELP',
  subtitle: 'Soluções inteligentes para problemas comuns.',
  meta: 'Outubro · 2026',
  tablet: prints.jornadaSessoes,
  laptop: prints.helpCaixa,
};
