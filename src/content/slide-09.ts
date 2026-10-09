import { Lightbulb, MousePointerClick, PencilLine, Send } from 'lucide-react';
import type { StepsData } from '../components/layouts/StepsLayout';
import type { SlideMeta } from '../types/slide';
import { prints } from './prints';
import { M1 } from './sections';

export const meta: SlideMeta = {
  id: 'slide-09', title: 'Abrir chamado via Jornada · Passo a passo', section: M1, theme: 'light', steps: 2,
  notes: '1. Clique em Abrir Chamado. 2. Preencha a observação com detalhes. 3. Enviar. Quanto mais detalhe, mais rápida a solução.',
};

export const data: StepsData = {
  eyebrow: 'Passo a passo',
  title: ['3 passos para', 'abrir o chamado'],
  steps: [
    { n: '01', icon: MousePointerClick, verb: 'Clique', text: 'em “Abrir Chamado”', screen: prints.jornadaBotaoChamado },
    { n: '02', icon: PencilLine, verb: 'Descreva', text: 'Se necessário, inclua uma observação', screen: prints.jornadaFormChamado },
    { n: '03', icon: Send, verb: 'Envie', text: 'Pronto: Chamado aberto', screen: prints.jornadaEnviar },
  ],
  tip: { icon: Lightbulb, text: 'Mais detalhes = Solução mais ágil' },
};
