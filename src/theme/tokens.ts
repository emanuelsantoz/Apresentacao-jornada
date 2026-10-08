/**
 * Tokens de design da apresentação.
 * Marca Barracred (SKILL.md) para a apresentação inteira;
 * tokens BWS (DESIGN.md) apenas dentro dos mockups de tela.
 * Espelhados em src/styles/tokens.css — altere os dois juntos.
 */
export const brand = {
  white: '#FFFFFF',
  green900: '#104726',
  green700: '#1E6D2F',
  green600: '#28972E',
  lime: '#AFBF30',
  teal: '#23775B',
  blue: '#39A3BE',
  gold: '#DCA349',
  yellow: '#F2EB80',
} as const;

export const bws = {
  chrome: '#0B2E1F',
  primary: '#0B5D3B',
  action: '#12864F',
  canvas: '#F5F7F6',
  text: '#1F2937',
  muted: '#6B7280',
  border: '#E5E7EB',
  selection: '#E8F5E9',
} as const;

export const semantic = {
  success: '#28972E',
  alert: '#E08A1E',
  danger: '#C8423B',
  info: '#39A3BE',
} as const;

export const stage = { width: 1920, height: 1080 } as const;

export const motionTokens = {
  ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
  slide: 0.55,
  reveal: 0.5,
  stagger: 0.08,
} as const;
