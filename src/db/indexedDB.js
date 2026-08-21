// IndexedDB Database Manager for SonicPulse

const DB_NAME = 'SonicPulseDB';
const DB_VERSION = 1;

let dbInstance = null;

export async function initDB() {
  if (dbInstance) return dbInstance;

  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (e) => {
      const db = e.target.result;

      // Tracks Store
      if (!db.objectStoreNames.contains('tracks')) {
        const trackStore = db.createObjectStore('tracks', { keyPath: 'id' });
        trackStore.createIndex('title', 'title', { unique: false });
        trackStore.createIndex('artist', 'artist', { unique: false });
        trackStore.createIndex('album', 'album', { unique: false });
      }

      // Playlists Store
      if (!db.objectStoreNames.contains('playlists')) {
        db.createObjectStore('playlists', { keyPath: 'id' });
      }

      // Settings Store
      if (!db.objectStoreNames.contains('settings')) {
        db.createObjectStore('settings', { keyPath: 'key' });
      }
    };

    request.onsuccess = (e) => {
      dbInstance = e.target.result;
      resolve(dbInstance);
    };

    request.onerror = (e) => {
      console.error('IndexedDB init error:', e);
      reject(e);
    };
  });
}

// Track operations
export async function saveTrackToDB(track) {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('tracks', 'readwrite');
    const store = tx.objectStore('tracks');
    const req = store.put(track);
    req.onsuccess = () => resolve(track);
    req.onerror = (err) => reject(err);
  });
}

export async function getAllTracksFromDB() {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('tracks', 'readonly');
    const store = tx.objectStore('tracks');
    const req = store.getAll();
    req.onsuccess = () => resolve(req.result || []);
    req.onerror = (err) => reject(err);
  });
}

export async function deleteTrackFromDB(trackId) {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('tracks', 'readwrite');
    const store = tx.objectStore('tracks');
    const req = store.delete(trackId);
    req.onsuccess = () => resolve(true);
    req.onerror = (err) => reject(err);
  });
}

// Playlist operations
export async function savePlaylistToDB(playlist) {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('playlists', 'readwrite');
    const store = tx.objectStore('playlists');
    const req = store.put(playlist);
    req.onsuccess = () => resolve(playlist);
    req.onerror = (err) => reject(err);
  });
}

export async function getAllPlaylistsFromDB() {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('playlists', 'readonly');
    const store = tx.objectStore('playlists');
    const req = store.getAll();
    req.onsuccess = () => resolve(req.result || []);
    req.onerror = (err) => reject(err);
  });
}

export async function deletePlaylistFromDB(playlistId) {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('playlists', 'readwrite');
    const store = tx.objectStore('playlists');
    const req = store.delete(playlistId);
    req.onsuccess = () => resolve(true);
    req.onerror = (err) => reject(err);
  });
}

// Setting operations
export async function setSettingInDB(key, value) {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('settings', 'readwrite');
    const store = tx.objectStore('settings');
    const req = store.put({ key, value });
    req.onsuccess = () => resolve(value);
    req.onerror = (err) => reject(err);
  });
}

export async function getSettingFromDB(key, defaultValue = null) {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('settings', 'readonly');
    const store = tx.objectStore('settings');
    const req = store.get(key);
    req.onsuccess = () => resolve(req.result ? req.result.value : defaultValue);
    req.onerror = () => resolve(defaultValue);
  });
}
