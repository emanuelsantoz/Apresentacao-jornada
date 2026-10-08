import { Hourglass, Zap } from 'lucide-react';
import type { CompareData } from '../components/layouts/CompareLayout';
import type { SlideMeta } from '../types/slide';
import { M1 } from './sections';

export const meta: SlideMeta = {
  id: 'slide-03', title: 'O problema e a solução', section: M1, theme: 'light', steps: 2,
  notes: 'Objetivo: dar respostas rápidas aos consultores sobre problemas comuns que travam o atendimento. Fica num novo módulo da área de atendimento do BWS_365.',
};

export const data: CompareData = {
  eyebrow: 'O problema e a solução',
  title: ['Qual dor a Jornada', 'do Cooperado resolve?'],
  before: { label: 'Antes', icon: Hourglass, items: ['Erro sem explicação trava o atendimento.', 'Consultor depende da TI para entender o problema.'] },
  after: { label: 'Com a Jornada', icon: Zap, items: ['Resposta rápida para problemas comuns.', 'Diagnóstico e recomendação na tela.'] },
  where: { label: 'Onde fica: novo módulo do BWS_365', path: ['BWS_365', 'Atendimento', 'Jornada do Cooperado'] },
};
