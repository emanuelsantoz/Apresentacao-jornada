/** Mesmo formato do editsStore da apresentação: { [slideId]: { [chave do texto]: Override } } */
export interface TextOverride {
  texts?: string[];
  color?: string;
  fontSize?: number;
  fontWeight?: number;
}
export type SlideEdits = Record<string, TextOverride>;
export type AllEdits = Record<string, SlideEdits>;

const isObj = (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null && !Array.isArray(v);

/** Valida um override de campo. Retorna mensagem de erro ou null. */
export function validarOverride(v: unknown): string | null {
  if (!isObj(v)) return 'valor deve ser um objeto';
  const allowed = ['texts', 'color', 'fontSize', 'fontWeight'];
  for (const k of Object.keys(v)) if (!allowed.includes(k)) return `campo desconhecido: ${k}`;
  if (v.texts !== undefined && !(Array.isArray(v.texts) && v.texts.every((t) => typeof t === 'string'))) return 'texts deve ser string[]';
  if (v.color !== undefined && typeof v.color !== 'string') return 'color deve ser string';
  if (v.fontSize !== undefined && typeof v.fontSize !== 'number') return 'fontSize deve ser número';
  if (v.fontWeight !== undefined && typeof v.fontWeight !== 'number') return 'fontWeight deve ser número';
  return null;
}

/** Valida o arquivo inteiro. */
export function validarTudo(v: unknown): string | null {
  if (!isObj(v)) return 'o corpo deve ser um objeto { slideId: { chave: override } }';
  for (const [slide, campos] of Object.entries(v)) {
    if (!isObj(campos)) return `slide "${slide}" deve ser um objeto`;
    for (const [chave, o] of Object.entries(campos)) {
      const e = validarOverride(o);
      if (e) return `${slide} › ${chave}: ${e}`;
    }
  }
  return null;
}
