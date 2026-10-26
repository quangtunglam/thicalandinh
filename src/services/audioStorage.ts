// IndexedDB storage helper for large audio files (MP3/M4A/WAV)
// Browser IndexedDB has gigabytes of storage capacity, eliminating localStorage 5MB quota errors.

const DB_NAME = 'ThiCaLanDinh_AudioDB';
const STORE_NAME = 'audio_files';
const DB_VERSION = 1;

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      return reject(new Error('IndexedDB not supported'));
    }
    const request = window.indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export const audioStorage = {
  async saveAudio(key: string, dataUrlOrBlob: string | Blob): Promise<string> {
    try {
      const db = await openDB();
      return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, 'readwrite');
        const store = tx.objectStore(STORE_NAME);
        store.put(dataUrlOrBlob, key);
        tx.oncomplete = () => resolve(key);
        tx.onerror = () => reject(tx.error);
      });
    } catch (e) {
      console.warn('Failed to save audio to IndexedDB, fallback to in-memory:', e);
      return '';
    }
  },

  async getAudio(keyOrUrl?: string): Promise<string | null> {
    if (!keyOrUrl) return null;
    // If it's a web URL, local asset path, or data URI, return directly
    if (
      keyOrUrl.startsWith('http://') ||
      keyOrUrl.startsWith('https://') ||
      keyOrUrl.startsWith('/assets') ||
      keyOrUrl.startsWith('data:audio') ||
      keyOrUrl.startsWith('blob:')
    ) {
      return keyOrUrl;
    }

    // Otherwise, it's an IndexedDB key (e.g. "idb:audio_vi_...")
    try {
      const db = await openDB();
      return new Promise((resolve) => {
        const tx = db.transaction(STORE_NAME, 'readonly');
        const store = tx.objectStore(STORE_NAME);
        const req = store.get(keyOrUrl);
        req.onsuccess = () => {
          const res = req.result;
          if (!res) return resolve(null);
          if (res instanceof Blob) {
            resolve(URL.createObjectURL(res));
          } else {
            resolve(res as string);
          }
        };
        req.onerror = () => resolve(null);
      });
    } catch (e) {
      console.warn('Error reading audio from IndexedDB:', e);
      return null;
    }
  },

  async deleteAudio(key: string): Promise<void> {
    if (!key || key.startsWith('http') || key.startsWith('data:')) return;
    try {
      const db = await openDB();
      return new Promise((resolve) => {
        const tx = db.transaction(STORE_NAME, 'readwrite');
        const store = tx.objectStore(STORE_NAME);
        store.delete(key);
        tx.oncomplete = () => resolve();
        tx.onerror = () => resolve();
      });
    } catch {}
  }
};
