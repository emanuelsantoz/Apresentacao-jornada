import type { ComponentType } from 'react';

export type Theme = 'light' | 'dark' | 'aurora';

export interface SlideMeta {
  id: string; // "slide-04"
  title: string; // usado na visão geral e no <title>
  section: string; // rótulo do rodapé (módulo)
  theme: Theme;
  steps?: number; // quantos cliques internos (0 = nenhum)
  notes?: string; // fala do apresentador (tecla N)
  /** Sem logo/rodapé (capas). */
  bare?: boolean;
  /** Formas decorativas do fundo. */
  shapes?: 'a' | 'b' | 'c' | 'none';
  /** Logo e rótulo do rodapé sobre painel escuro à esquerda (texto claro). */
  chromeOnDark?: boolean;
}

export interface SlideDef extends SlideMeta {
  /** Componente do layout já ligado ao seu conteúdo. */
  Component: ComponentType;
}
