import { useCallback, useEffect, useState } from 'react';
import { localStore } from '../lib/localStore';

/**
 * Prints de tela (screenshots) que preenchem os mockups.
 *
 * Ordem de busca para um slot `id`:
 *   1. Imagem enviada pela própria apresentação (arrastar/soltar ou botão) — guardada no
 *      IndexedDB deste navegador, só para conveniência de quem está montando.
 *   2. Arquivo permanente (padrão: public/prints/<id>.png, .jpg ou .webp) — é o que vale
 *      para o projeto, o build e o PDF.
 *   3. Nenhum: o mockup mostra a tela de exemplo recriada em código.
 */
const EXT = ['png', 'jpg', 'jpeg', 'webp'];

const loadImage = (src: string) =>
  new Promise<string>((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(src);
    img.onerror = reject;
    img.src = src;
  });

async function findStatic(paths: string[]): Promise<string | null> {
  for (const path of paths) {
    try {
      return await loadImage(`${import.meta.env.BASE_URL}${path}`);
    } catch {
      /* tenta o próximo arquivo */
    }
  }
  return null;
}

/** Avisa todas as instâncias com o mesmo id (ex.: a logo em todos os slides). */
const EVENT = 'barracred:image-updated';
const notify = (id: string) => window.dispatchEvent(new CustomEvent(EVENT, { detail: id }));

export type PrintSource = 'upload' | 'arquivo' | 'exemplo';

/**
 * @param id        chave do armazenamento local
 * @param staticPaths arquivos permanentes a procurar (relativos a public/). Padrão: prints/<id>.png|jpg|jpeg|webp
 */
export function usePrint(id: string, staticPaths?: string[]) {
  const paths = staticPaths ?? EXT.map((e) => `prints/${id}.${e}`);
  const pathsKey = paths.join('|');
  const [src, setSrc] = useState<string | null>(null);
  const [source, setSource] = useState<PrintSource>('exemplo');

  const refresh = useCallback(async () => {
    try {
      const blob = await localStore.get<Blob>('prints', id);
      if (blob) {
        setSrc(URL.createObjectURL(blob));
        setSource('upload');
        return;
      }
    } catch {
      /* IndexedDB indisponível (aba anônima, PDF): segue para o arquivo */
    }
    const file = await findStatic(pathsKey.split('|'));
    setSrc(file);
    setSource(file ? 'arquivo' : 'exemplo');
  }, [id, pathsKey]);

  useEffect(() => { void refresh(); }, [refresh]);

  useEffect(() => {
    const onUpdate = (e: Event) => { if ((e as CustomEvent<string>).detail === id) void refresh(); };
    window.addEventListener(EVENT, onUpdate);
    return () => window.removeEventListener(EVENT, onUpdate);
  }, [id, refresh]);

  const save = useCallback(async (file: File) => {
    try { await localStore.put('prints', id, file); } catch { /* sem persistência */ }
    setSrc(URL.createObjectURL(file));
    setSource('upload');
    notify(id);
  }, [id]);

  const remove = useCallback(async () => {
    try { await localStore.del('prints', id); } catch { /* ignore */ }
    await refresh();
    notify(id);
  }, [id, refresh]);

  return { src, source, save, remove };
}
