import { AlertTriangle, CheckCircle2, Stethoscope, ThumbsUp } from 'lucide-react';
import type { TabletDuoData } from '../components/layouts/TabletDuoLayout';
import type { SlideMeta } from '../types/slide';
import { prints } from './prints';
import { M1 } from './sections';

export const meta: SlideMeta = {
  id: 'slide-05', title: 'Como utilizar · Alerta e sucesso', section: M1, theme: 'light', steps: 1,
  notes: 'Laranja = alerta: clique para ver o diagnóstico e a recomendação. Verde = tudo certo, nenhuma ação necessária.',
};

export const data: TabletDuoData = {
  eyebrow: 'Como utilizar · 2 de 3',
  title: 'As cores revelam o que está acontecendo',
  screens: [
    {
      tag: 'Tela 3', name: 'Alerta', tone: 'alert', icon: AlertTriangle,
      bullets: ['Clique na sessão em laranja', 'Veja o diagnóstico e siga a recomendação'],
      screen: prints.jornadaAlerta,
      callout: { icon: Stethoscope, title: 'Diagnóstico + solução', text: 'O cenário é explicado, e o próximo passo recomendado' },
      spot: { x: 52, y: 35 },
    },
    {
      tag: 'Tela 4', name: 'Sucesso', tone: 'success', icon: CheckCircle2,
      bullets: ['Sessão em verde: tudo certo.', 'Nenhuma ação necessária'],
      screen: prints.jornadaSucesso,
      callout: { icon: ThumbsUp, title: 'Tudo certo', text: 'Siga o atendimento normalmente' },
      spot: { x: 22, y: 34 },
    },
  ],
};
