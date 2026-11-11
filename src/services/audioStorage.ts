// IndexedDB & Cloud Chunked Storage helper for large Audio (MP3/M4A/WAV) and Book (PDF/EPUB) files.

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

function uint8ToBase64(bytes: Uint8Array): string {
  let binary = '';
  const chunkSize = 0x8000;
  for (let i = 0; i < bytes.length; i += chunkSize) {
    const sub = bytes.subarray(i, Math.min(i + chunkSize, bytes.length));
    binary += String.fromCharCode.apply(null, Array.from(sub));
  }
  return btoa(binary);
}

function base64ToUint8(base64: string): Uint8Array {
  const clean = base64.includes(',') ? base64.split(',')[1] : base64;
  const binary = atob(clean);
  const len = binary.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

function dataUriToBlobUrl(dataUri: string): string {
  try {
    const [header, base64] = dataUri.split(',');
    const mimeMatch = header.match(/data:([^;]+)/);
    const mime = mimeMatch ? mimeMatch[1] : 'application/pdf';
    const bytes = base64ToUint8(base64);
    const blob = new Blob([bytes.buffer as ArrayBuffer], { type: mime });
    return URL.createObjectURL(blob);
  } catch {
    return dataUri;
  }
}

export const audioStorage = {
  async saveAudio(key: string, dataUrlOrBlob: string | Blob): Promise<string> {
    try {
      let valueToStore: any = dataUrlOrBlob;
      // Convert File/Blob to ArrayBuffer before storing in IndexedDB so file handles never expire
      if (dataUrlOrBlob instanceof Blob) {
        const buffer = await dataUrlOrBlob.arrayBuffer();
        valueToStore = {
          __isBufferRecord: true,
          buffer,
          type: dataUrlOrBlob.type || 'application/octet-stream',
        };
      }
      const db = await openDB();
      return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, 'readwrite');
        const store = tx.objectStore(STORE_NAME);
        store.put(valueToStore, key);
        tx.oncomplete = () => resolve(key);
        tx.onerror = () => reject(tx.error);
      });
    } catch (e) {
      console.warn('Failed to save file to IndexedDB:', e);
      return '';
    }
  },

  async getRawBlob(key: string): Promise<Blob | null> {
    if (!key) return null;
    try {
      const db = await openDB();
      return new Promise((resolve) => {
        const tx = db.transaction(STORE_NAME, 'readonly');
        const store = tx.objectStore(STORE_NAME);
        const req = store.get(key);
        req.onsuccess = () => {
          const res = req.result;
          if (!res) return resolve(null);
          if (res instanceof Blob) return resolve(res);
          if (res && res.__isBufferRecord && res.buffer) {
            return resolve(new Blob([res.buffer], { type: res.type || 'application/pdf' }));
          }
          if (typeof res === 'string' && res.startsWith('data:')) {
            const [header, b64] = res.split(',');
            const mimeMatch = header.match(/data:([^;]+)/);
            const bytes = base64ToUint8(b64);
            return resolve(new Blob([bytes.buffer as ArrayBuffer], { type: mimeMatch ? mimeMatch[1] : 'application/pdf' }));
          }
          resolve(null);
        };
        req.onerror = () => resolve(null);
      });
    } catch {
      return null;
    }
  },

  async uploadBookInChunks(
    bookId: string,
    fileOrBlob: Blob,
    token: string,
    onProgress?: (percent: number) => void
  ): Promise<string> {
    const buffer = await fileOrBlob.arrayBuffer();
    const mimeType = fileOrBlob.type || 'application/pdf';

    // Cache locally in IndexedDB under canonical key
    await this.saveAudio(`idb:book_${bookId}`, new Blob([buffer], { type: mimeType }));

    const bytes = new Uint8Array(buffer);
    // 1 MB binary per chunk (~1.33 MB base64, well below Vercel 4.5 MB payload limit)
    const CHUNK_BYTE_SIZE = 1024 * 1024;
    const totalChunks = Math.max(1, Math.ceil(bytes.length / CHUNK_BYTE_SIZE));
    const authToken = (!token || token === 'local-admin-token') ? 'thicalandinh2026' : token;

    let completed = 0;
    const report = () => {
      completed++;
      if (onProgress) {
        onProgress(Math.min(100, Math.round((completed / totalChunks) * 100)));
      }
    };

    const uploadSingleChunk = async (idx: number, reset = false) => {
      const start = idx * CHUNK_BYTE_SIZE;
      const end = Math.min(start + CHUNK_BYTE_SIZE, bytes.length);
      const chunkBytes = bytes.subarray(start, end);
      const chunkData = uint8ToBase64(chunkBytes);

      const res = await fetch('/api/book-chunks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          bookId,
          chunkIndex: idx,
          totalChunks,
          mimeType,
          chunkData,
          reset,
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || `Lỗi tải phân đoạn ${idx + 1}/${totalChunks}`);
      }
      report();
    };

    if (onProgress) onProgress(2);
    // First chunk resets any old chunks for this bookId
    await uploadSingleChunk(0, true);

    // Remaining chunks uploaded with concurrency = 3
    const remaining: number[] = [];
    for (let i = 1; i < totalChunks; i++) remaining.push(i);

    const CONCURRENCY = 3;
    for (let i = 0; i < remaining.length; i += CONCURRENCY) {
      const batch = remaining.slice(i, i + CONCURRENCY);
      await Promise.all(batch.map(idx => uploadSingleChunk(idx, false)));
    }

    return `chunked:${bookId}`;
  },

  async downloadChunkedBook(
    bookId: string,
    onProgress?: (percent: number) => void
  ): Promise<string | null> {
    // 1. Check local IndexedDB cache first
    const cachedBlob = await this.getRawBlob(`idb:book_${bookId}`);
    if (cachedBlob && cachedBlob.size > 0) {
      if (onProgress) onProgress(100);
      return URL.createObjectURL(cachedBlob);
    }

    // 2. Fetch chunk metadata from server
    try {
      if (onProgress) onProgress(5);
      const metaRes = await fetch(`/api/book-chunks?bookId=${encodeURIComponent(bookId)}`);
      if (!metaRes.ok) return null;
      const meta = await metaRes.json();
      const totalChunks = Number(meta.totalChunks || 0);
      const mimeType = meta.mimeType || 'application/pdf';
      if (totalChunks <= 0) return null;

      const chunkParts: Uint8Array[] = new Array(totalChunks);
      let downloaded = 0;

      const fetchChunk = async (idx: number) => {
        const r = await fetch(`/api/book-chunks?bookId=${encodeURIComponent(bookId)}&chunkIndex=${idx}`);
        if (!r.ok) throw new Error(`Failed chunk ${idx}`);
        const data = await r.json();
        chunkParts[idx] = base64ToUint8(data.chunkData);
        downloaded++;
        if (onProgress) {
          onProgress(Math.min(99, Math.round((downloaded / totalChunks) * 100)));
        }
      };

      const indices = Array.from({ length: totalChunks }, (_, i) => i);
      const CONCURRENCY = 3;
      for (let i = 0; i < indices.length; i += CONCURRENCY) {
        const batch = indices.slice(i, i + CONCURRENCY);
        await Promise.all(batch.map(idx => fetchChunk(idx)));
      }

      const fullBlob = new Blob(chunkParts as BlobPart[], { type: mimeType });
      // Save to local IndexedDB for instant subsequent opens
      await this.saveAudio(`idb:book_${bookId}`, fullBlob);
      if (onProgress) onProgress(100);
      return URL.createObjectURL(fullBlob);
    } catch (e) {
      console.warn('Error downloading chunked book from server:', e);
      return null;
    }
  },

  async getAudio(
    keyOrUrl?: string,
    onProgress?: (percent: number) => void,
    fallbackBookId?: string
  ): Promise<string | null> {
    if (!keyOrUrl) return null;

    if (
      keyOrUrl.startsWith('http://') ||
      keyOrUrl.startsWith('https://') ||
      keyOrUrl.startsWith('/assets') ||
      keyOrUrl.startsWith('blob:')
    ) {
      return keyOrUrl;
    }

    if (keyOrUrl.startsWith('data:')) {
      return dataUriToBlobUrl(keyOrUrl);
    }

    if (keyOrUrl.startsWith('chunked:')) {
      const bookId = keyOrUrl.replace('chunked:', '');
      return this.downloadChunkedBook(bookId, onProgress);
    }

    // Otherwise, it's an IndexedDB key (e.g. "idb:audio_vi_..." or "idb:book_...")
    const blob = await this.getRawBlob(keyOrUrl);
    if (blob) {
      return URL.createObjectURL(blob);
    }

    // If not in local IndexedDB, check if server has chunked version under fallbackBookId or key
    const candidateId = fallbackBookId || keyOrUrl.replace('idb:book_', '');
    if (candidateId) {
      const fromServer = await this.downloadChunkedBook(candidateId, onProgress);
      if (fromServer) return fromServer;
    }

    return null;
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
