import { BlobNotFoundError, del, head, put } from '@vercel/blob';
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import type { AllEdits } from './types.js';

/** Caminho do arquivo no Blob. */
export const BLOB_PATH = 'apresentacao/edicoes.json';

export interface Storage {
  read(): Promise<AllEdits | null>; // null = arquivo ainda não existe
  write(data: AllEdits): Promise<void>;
  remove(): Promise<void>;
}

/** Produção: Vercel Blob. */
export const blobStorage: Storage = {
  async read() {
    try {
      const meta = await head(BLOB_PATH);
      // ?v= muda a cada gravação e evita resposta velha do CDN
      const r = await fetch(`${meta.url}?v=${meta.uploadedAt.getTime()}`, { cache: 'no-store' });
      if (!r.ok) throw new Error(`Falha ao ler o Blob (${r.status})`);
      return (await r.json()) as AllEdits;
    } catch (e) {
      if (e instanceof BlobNotFoundError) return null;
      throw e;
    }
  },
  async write(data) {
    await put(BLOB_PATH, JSON.stringify(data, null, 2), {
      access: 'public',
      contentType: 'application/json',
      addRandomSuffix: false,
      allowOverwrite: true,
      cacheControlMaxAge: 60,
    });
  },
  async remove() {
    try {
      const meta = await head(BLOB_PATH);
      await del(meta.url);
    } catch (e) {
      if (!(e instanceof BlobNotFoundError)) throw e;
    }
  },
};

/** Desenvolvimento sem token: grava em .dev-data/edicoes.json. */
export function fileStorage(dir = '.dev-data'): Storage {
  const file = `${dir}/edicoes.json`;
  return {
    async read() {
      try { return JSON.parse(await readFile(file, 'utf-8')) as AllEdits; } catch { return null; }
    },
    async write(data) {
      await mkdir(dir, { recursive: true });
      await writeFile(file, JSON.stringify(data, null, 2), 'utf-8');
    },
    async remove() { await rm(file, { force: true }); },
  };
}

export const defaultStorage = (): Storage => (process.env.BLOB_READ_WRITE_TOKEN ? blobStorage : fileStorage());
