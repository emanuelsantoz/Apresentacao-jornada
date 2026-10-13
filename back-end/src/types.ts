/**
 * Formato do arquivo de edições (espelha src/edit/editsStore.ts da apresentação).
 *
 *  v2 (atual):  { versao: 2, textos: { [slideId]: { [chave]: Override } }, cards: { [slideId]: NewCard[] } }
 *  v1 (antigo): { [slideId]: { [chave]: Override } }   ← continua aceito
 */
export interface Mark { i: number; start: number; end: number; color: string }
export interface Override {
  texts?: string[];
  color?: string;
  fontSize?: number;
  fontWeight?: number;
  background?: string;
  marks?: Mark[];
  width?: number;
  height?: number;
  dx?: number;
  dy?: number;
}
export type SlideEdits = Record<string, Override>;
export type AllEdits = Record<string, SlideEdits>;
export interface NewCard { id: string; x: number; y: number; w: number; h: number; fill: string; t: Override }
export interface EditsDoc { versao: 2; textos: AllEdits; cards: Record<string, NewCard[]> }
export type Stored = AllEdits | EditsDoc;

const isObj = (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null && !Array.isArray(v);
const isNum = (v: unknown) => typeof v === 'number' && Number.isFinite(v);

/** O arquivo guardado está no formato v2? */
export const isDoc = (v: unknown): v is EditsDoc => isObj(v) && (v.versao !== undefined || 'textos' in v || 'cards' in v);

/** Parte dos textos, qualquer que seja o formato (devolve a referência: alterações valem no objeto original). */
export const textosOf = (v: Stored): AllEdits => (isDoc(v) ? v.textos : v);

const NUMS = ['fontSize', 'fontWeight', 'width', 'height', 'dx', 'dy'] as const;
const ALLOWED: string[] = ['texts', 'color', 'background', 'marks', ...NUMS];

/** Valida um override de campo. Retorna mensagem de erro ou null. */
export function validarOverride(v: unknown): string | null {
  if (!isObj(v)) return 'valor deve ser um objeto';
  for (const k of Object.keys(v)) if (!ALLOWED.includes(k)) return `campo desconhecido: ${k}`;
  if (v.texts !== undefined && !(Array.isArray(v.texts) && v.texts.every((t) => typeof t === 'string'))) return 'texts deve ser string[]';
  if (v.color !== undefined && typeof v.color !== 'string') return 'color deve ser string';
  if (v.background !== undefined && typeof v.background !== 'string') return 'background deve ser string';
  for (const k of NUMS) if (v[k] !== undefined && !isNum(v[k])) return `${k} deve ser número`;
  if (v.marks !== undefined) {
    const ok = Array.isArray(v.marks) && v.marks.every((m) => isObj(m) && isNum(m.i) && isNum(m.start) && isNum(m.end) && typeof m.color === 'string');
    if (!ok) return 'marks deve ser { i, start, end, color }[]';
  }
  return null;
}

/** Valida { slideId: { chave: override } }. */
export function validarTextos(v: unknown): string | null {
  if (!isObj(v)) return 'textos deve ser um objeto { slideId: { chave: override } }';
  for (const [slide, campos] of Object.entries(v)) {
    if (!isObj(campos)) return `slide "${slide}" deve ser um objeto`;
    for (const [chave, o] of Object.entries(campos)) {
      const e = validarOverride(o);
      if (e) return `${slide} › ${chave}: ${e}`;
    }
  }
  return null;
}

function validarCards(v: unknown): string | null {
  if (!isObj(v)) return 'cards deve ser um objeto { slideId: card[] }';
  for (const [slide, lista] of Object.entries(v)) {
    if (!Array.isArray(lista)) return `cards de "${slide}" deve ser uma lista`;
    for (const c of lista) {
      if (!isObj(c) || typeof c.id !== 'string' || !c.id) return `${slide}: card sem id`;
      if (!(isNum(c.x) && isNum(c.y) && isNum(c.w) && isNum(c.h)) || typeof c.fill !== 'string') return `${slide} › ${c.id}: x, y, w, h e fill são obrigatórios`;
      const e = validarOverride(c.t);
      if (e) return `${slide} › ${c.id}: ${e}`;
    }
  }
  return null;
}

/** Valida o arquivo inteiro (v1 ou v2). */
export function validarTudo(v: unknown): string | null {
  if (!isObj(v)) return 'o corpo deve ser um objeto';
  if (!isDoc(v)) return validarTextos(v);
  if (v.versao !== 2) return 'versao deve ser 2';
  return validarTextos(v.textos ?? {}) ?? validarCards(v.cards ?? {});
}
