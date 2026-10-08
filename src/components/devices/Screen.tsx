import { BwsScreen, type ScreenKey } from './BwsScreens';
import { PrintSlot } from './PrintSlot';

export interface ScreenSpec {
  /** Nome do arquivo do print em public/prints/ (sem extensão). */
  printId: string;
  /** Rótulo amigável no botão de envio. */
  label: string;
  /** Tela de exemplo exibida enquanto não há print. */
  fallback: ScreenKey;
  emailSubject?: string;
}

/** Conteúdo de tela de um mockup: print real (se houver) ou tela de exemplo. */
export function Screen({ spec }: { spec: ScreenSpec }) {
  return (
    <PrintSlot id={spec.printId} label={spec.label}>
      <BwsScreen screen={spec.fallback} emailSubject={spec.emailSubject} />
    </PrintSlot>
  );
}
