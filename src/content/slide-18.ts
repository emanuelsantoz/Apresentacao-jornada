import { CheckCircle2, CircleDot, Loader, UserRoundCheck } from 'lucide-react';
import type { StatusData } from '../components/layouts/StatusLayout';
import type { SlideMeta } from '../types/slide';
import { M2 } from './sections';

export const meta: SlideMeta = {
  id: 'slide-18', title: 'Status dos chamados', section: M2, theme: 'light',
  notes: 'ATENÇÃO: lista sugerida. Ajuste nomes e quantidade aos status reais do BWS_HELP (máx. 4 por slide).',
};

export const data: StatusData = {
  eyebrow: 'Status dos chamados',
  title: ['O que cada', 'status significa'],
  items: [
    { name: 'Aberto', icon: CircleDot, tone: 'info', text: 'Registrado, aguardando triagem.', who: 'Com a TI' },
    { name: 'Em atendimento', icon: Loader, tone: 'success', text: 'A TI já está trabalhando.', who: 'Com a TI' },
    { name: 'Aguardando você', icon: UserRoundCheck, tone: 'returned', text: 'Falta uma informação sua.', who: 'Com você' },
    { name: 'Resolvido', icon: CheckCircle2, tone: 'green', text: 'Solução entregue. Avalie!', who: 'Concluído' },
  ],
};
