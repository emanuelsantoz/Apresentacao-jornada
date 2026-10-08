/**
 * Armazenamento local (IndexedDB) para conveniências de quem monta a apresentação:
 * prints enviados, logo e edições de texto. Nunca é a fonte oficial — a versão
 * permanente fica em public/ (prints/, brand/, edicoes.json).
 */
const DB = 'barracred-prints'; // nome mantido: preserva prints e logos já enviados
const VERSION = 2; // v2 adicionou o store 'edits'
export type StoreName = 'prints' | 'edits';

let dbPromise: Promise<IDBDatabase> | null = null;

function openDb(): Promise<IDBDatabase> {
  dbPromise ??= new Promise((resolve, reject) => {
    const req = indexedDB.open(DB, VERSION);
    req.onupgradeneeded = () => {
      for (const s of ['prints', 'edits']) if (!req.result.objectStoreNames.contains(s)) req.result.createObjectStore(s);
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
  return dbPromise;
}

async function run<T>(store: StoreName, mode: IDBTransactionMode, fn: (s: IDBObjectStore) => IDBRequest<T>): Promise<T> {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const r = fn(db.transaction(store, mode).objectStore(store));
    r.onsuccess = () => resolve(r.result);
    r.onerror = () => reject(r.error);
  });
}

export const localStore = {
  get: <T>(store: StoreName, key: string) => run<T | undefined>(store, 'readonly', (s) => s.get(key)),
  put: (store: StoreName, key: string, value: unknown) => run(store, 'readwrite', (s) => s.put(value, key)),
  del: (store: StoreName, key: string) => run(store, 'readwrite', (s) => s.delete(key)),
};
