const DB_NAME = 'FontStashDB';
const DB_VERSION = 1;
const STORE_NAME = 'fonts';

let dbPromise = null;

function openDb() {
  if (typeof window === 'undefined' || !window.indexedDB) {
    return Promise.reject(new Error('IndexedDB not available'));
  }

  if (dbPromise) return dbPromise;

  dbPromise = new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => {
      dbPromise = null;
      reject(request.error);
    };
  });

  return dbPromise;
}

export async function saveFontToDb(fontRecord) {
  if (typeof window === 'undefined' || !window.indexedDB) return;
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const request = store.keyPath ? store.put(fontRecord) : store.put(fontRecord, fontRecord.id);

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
    tx.onerror = () => reject(tx.error);
  });
}

export async function getFontsFromDb() {
  if (typeof window === 'undefined' || !window.indexedDB) return [];
  try {
    const db = await openDb();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
      tx.onerror = () => reject(tx.error);
    });
  } catch (err) {
    console.error('Failed to read fonts from IndexedDB:', err);
    return [];
  }
}

export async function deleteFontFromDb(id) {
  if (typeof window === 'undefined' || !window.indexedDB) return;
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const request = store.delete(id);

    request.onsuccess = () => resolve(true);
    request.onerror = () => reject(request.error);
    tx.onerror = () => reject(tx.error);
  });
}

export async function getStorageEstimate() {
  if (typeof navigator === 'undefined' || !navigator.storage || !navigator.storage.estimate) {
    return { usageMB: '0.0', quotaMB: '0', percentage: '0' };
  }

  try {
    const { quota = 0, usage = 0 } = await navigator.storage.estimate();
    return {
      usageMB: (usage / (1024 * 1024)).toFixed(1),
      quotaMB: (quota / (1024 * 1024)).toFixed(0),
      quotaGB: (quota / (1024 * 1024 * 1024)).toFixed(1),
      percentage: quota > 0 ? ((usage / quota) * 100).toFixed(2) : '0',
    };
  } catch {
    return { usageMB: '0.0', quotaMB: '0', percentage: '0' };
  }
}

export async function requestStoragePersistence() {
  if (typeof navigator === 'undefined' || !navigator.storage || !navigator.storage.persist) {
    return false;
  }
  try {
    return await navigator.storage.persist();
  } catch {
    return false;
  }
}
