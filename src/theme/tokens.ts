/**
 * Tokens de design — Barracred WorkSpace (“uma só linguagem visual”).
 * Espelhados em src/styles/tokens.css — altere os dois juntos.
 */
export const workspace = {
  chrome: '#0B2E1F',
  primary: '#0B5D3B',
  action: '#12864F',
  canvas: '#F5F7F6',
  selection: '#E8F5E9',
  text: '#1F2937',
  muted: '#6B7280',
  border: '#E5E7EB',
} as const;

/** Status: apenas em badges discretos (tint + texto). */
export const status = {
  success: { fg: '#12864F', bg: '#E8F5E9' },
  alert: { fg: '#B45309', bg: '#FEF3C7' },
  danger: { fg: '#B91C1C', bg: '#FEE2E2' },
  info: { fg: '#1D4ED8', bg: '#DBEAFE' },
} as const;

export const stage = { width: 1920, height: 1080 } as const;

export const motionTokens = {
  ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
  slide: 0.5,
  reveal: 0.45,
  stagger: 0.08,
} as const;
