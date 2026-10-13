import { usePrint } from '../../hooks/usePrint';
import { BwsScreen, MenuStrip, type ScreenKey } from './BwsScreens';
import { PrintSlot } from './PrintSlot';

export interface ScreenSpec {
  /** Nome do arquivo do print em public/prints/ (sem extensão). */
  printId: string;
  /** Rótulo amigável no botão de envio. */
  label: string;
  /** Tela de exemplo exibida enquanto não há print. */
  fallback: ScreenKey;
  emailSubject?: string;
  /** Só para a tela de e-mail: imagem (relativa a public/) no painel da direita; a caixa de entrada continua à esquerda. */
  emailBody?: string;
  /** Imagem completa (sem recorte) mostrada ao expandir `emailBody`. */
  emailBodyFull?: string;
  /** Mostra o menu lateral do BWS à esquerda e o print ao lado (em vez do print ocupar a tela toda). */
  menu?: boolean;
  /** Como o print preenche a tela do mockup (padrão: cover). Use 'contain' para prints mais largos que o tablet. */
  fit?: 'cover' | 'contain';
  position?: string;
  /** Cor de fundo das faixas livres quando fit = 'contain'. */
  bg?: string;
}

/** Conteúdo de tela de um mockup: print real (se houver) ou tela de exemplo. */
export function Screen({ spec }: { spec: ScreenSpec }) {
  const { src } = usePrint(spec.printId);
  const slot = (
    <PrintSlot id={spec.printId} label={spec.label} fit={spec.fit} position={spec.position} bg={spec.bg}>
      <BwsScreen screen={spec.fallback} emailSubject={spec.emailSubject} emailBody={spec.emailBody} emailBodyFull={spec.emailBodyFull} />
    </PrintSlot>
  );
  if (!spec.menu || !src) return slot;
  return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex' }}>
      <MenuStrip />
      <div style={{ position: 'relative', flex: 1, minWidth: 0 }}>{slot}</div>
    </div>
  );
}
