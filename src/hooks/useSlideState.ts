import { createContext, useContext } from 'react';

export interface SlideState {
  /** Passo atual dentro do slide (0 = estado inicial). */
  step: number;
  /** true na rota de impressão: tudo revelado e sem animação. */
  print: boolean;
  /** true quando o slide está em foco no palco. */
  active: boolean;
}

export const SlideStateContext = createContext<SlideState>({ step: 0, print: false, active: true });

export const useSlideState = () => useContext(SlideStateContext);

/** Atalho: o passo `n` já foi revelado? */
export const useRevealed = (n: number) => {
  const { step, print } = useSlideState();
  return print || step >= n;
};
