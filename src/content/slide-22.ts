import type { CtaData } from '../components/layouts/CtaLayout';
import type { SlideMeta } from '../types/slide';
import { prints } from './prints';
import { M2 } from './sections';

export const meta: SlideMeta = {
  id: 'slide-22', title: 'Acesse o portal BWS', section: M2, theme: 'aurora', bare: true,
  notes: 'Encerramento: peça para todos abrirem o portal BWS agora. O botão abre https://bws.barracred.app.br/home/dashboard em outra aba. O QR Code bws_365 abre a jornada do cooperado no tablet.',
};

export const data: CtaData = {
  eyebrow: 'Próximo passo',
  titleA: 'Acesse o',
  titleB: 'portal BWS',
  text: 'Abra o BWS_HELP e peça ajuda à TI em poucos cliques.',
  cta: { label: 'Acessar o portal BWS', url: 'https://bws.barracred.app.br/home/dashboard' },
  screen: prints.bwsCockpit,
  qr: {
    src: 'qrcode/bws_365.png',
    name: 'bws_365',
    title: 'Jornada do cooperado',
    caption: 'Escaneie com o tablet para abrir a jornada.',
  },
};
