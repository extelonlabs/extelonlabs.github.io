const DATABASE = 'extelon-library';
const STORE = 'projects';
const MAX_HTML_BYTES = 10 * 1024 * 1024;
const MAX_BACKUP_BYTES = 30 * 1024 * 1024;
const COLORS = new Set(['violet', 'green', 'amber', 'blue', 'rose']);
const encoder = new TextEncoder();
let databasePromise;
let bundledIds = new Set();

function storageError(error) {
  if (error?.name === 'QuotaExceededError') {
    return new Error('Your browser storage is full. Export a backup, then remove a project and try again.');
  }
  return new Error('Browser storage is unavailable. Allow site storage or use a regular browser window, then reload.', { cause: error });
}

function openDatabase() {
  if (databasePromise) return databasePromise;
  databasePromise = new Promise((resolve, reject) => {
    let request;
    let failed = false;
    try {
      if (!globalThis.indexedDB) throw new Error('IndexedDB is unavailable.');
      request = indexedDB.open(DATABASE, 1);
    } catch (error) {
      reject(storageError(error));
      return;
    }
    request.onupgradeneeded = () => {
      request.result.createObjectStore(STORE, { keyPath: 'id' });
    };
    request.onerror = () => reject(storageError(request.error));
    request.onblocked = () => {
      failed = true;
      reject(new Error('Close other Extelon Library tabs and reload to update browser storage.'));
    };
    request.onsuccess = () => {
      const database = request.result;
      if (failed) {
        database.close();
        return;
      }
      database.onversionchange = () => {
        database.close();
        databasePromise = undefined;
      };
      resolve(database);
    };
  }).catch(error => {
    databasePromise = undefined;
    throw error;
  });
  return databasePromise;
}

async function readRecords() {
  const database = await openDatabase();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(STORE, 'readonly');
    const request = transaction.objectStore(STORE).getAll();
    transaction.oncomplete = () => resolve(request.result);
    transaction.onabort = () => reject(storageError(transaction.error));
    transaction.onerror = () => reject(storageError(transaction.error));
  });
}

async function writeRecords(records, deletedId) {
  const database = await openDatabase();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(STORE, 'readwrite');
    const store = transaction.objectStore(STORE);
    for (const record of records) store.put(record);
    if (deletedId) store.delete(deletedId);
    transaction.oncomplete = () => resolve();
    transaction.onabort = () => reject(storageError(transaction.error));
    transaction.onerror = () => reject(storageError(transaction.error));
  });
}

function localId(id) {
  if (typeof id !== 'string' || !/^local-[a-zA-Z0-9_-]{1,100}$/.test(id)) {
    throw new Error('A saved project needs a valid local project ID.');
  }
  return id;
}

function shortText(value, label, limit, fallback) {
  if (value === undefined && fallback !== undefined) return fallback;
  if (typeof value !== 'string' || !value.trim() || value.length > limit) {
    throw new Error(`${label} must be between 1 and ${limit} characters.`);
  }
  return value.trim();
}

function timestamp(value, fallback) {
  if (value === undefined) return fallback;
  if (typeof value !== 'number' || !Number.isFinite(value) || value < 0) {
    throw new Error('A project contains an invalid date.');
  }
  return value;
}

function favorite(value) {
  if (value === undefined) return false;
  if (typeof value !== 'boolean') throw new Error('A project contains an invalid favorite setting.');
  return value;
}

function validateProject(value, reservedIds = bundledIds) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new Error('The backup contains an invalid project.');
  }
  const id = localId(value.id);
  if (reservedIds.has(id) || (value.bundled !== undefined && value.bundled !== false)) {
    throw new Error('A backup cannot replace a bundled project.');
  }
  const title = shortText(value.title, 'Project name', 100);
  const description = value.description ?? '';
  if (typeof description !== 'string' || description.length > 300) {
    throw new Error('Project descriptions must be at most 300 characters.');
  }
  if (!['link', 'html'].includes(value.type)) {
    throw new Error('Each project must be a website link or an HTML upload.');
  }
  let url = '';
  let html = '';
  if (value.type === 'link') {
    let parsed;
    try {
      if (typeof value.url !== 'string') throw new Error();
      parsed = new URL(value.url);
    } catch {
      throw new Error(`“${title}” needs a complete website address, starting with https:// or http://.`);
    }
    if (!['https:', 'http:'].includes(parsed.protocol) || parsed.username || parsed.password) {
      throw new Error(`“${title}” needs an HTTP or HTTPS address without embedded credentials.`);
    }
    url = parsed.href;
  } else {
    if (typeof value.html !== 'string' || !value.html.trim()) {
      throw new Error(`“${title}” is missing its HTML content.`);
    }
    if (encoder.encode(value.html).byteLength > MAX_HTML_BYTES) {
      throw new Error(`“${title}” exceeds the 10 MB HTML upload limit.`);
    }
    html = value.html;
  }
  const color = value.color ?? 'violet';
  if (!COLORS.has(color)) throw new Error('A project contains an unsupported color.');
  return {
    id,
    title,
    description: description.trim(),
    type: value.type,
    url,
    html,
    category: shortText(value.category, 'Category', 60, 'Websites'),
    color,
    favorite: favorite(value.favorite),
    createdAt: timestamp(value.createdAt, Date.now()),
    lastOpened: timestamp(value.lastOpened, 0),
    bundled: false,
  };
}

export async function loadLibrary(bundledProjects) {
  bundledIds = new Set(bundledProjects.map(project => project.id));
  const records = await readRecords();
  const byId = new Map(records.map(record => [record.id, record]));
  const bundled = bundledProjects.map(project => {
    const saved = byId.get(project.id);
    return {
      ...project,
      favorite: saved?.kind === 'bundled-state' ? saved.favorite : Boolean(project.favorite),
      lastOpened: saved?.kind === 'bundled-state' ? saved.lastOpened : (project.lastOpened || 0),
      bundled: true,
    };
  });
  const local = records
    .filter(record => record.kind !== 'bundled-state' && !bundledIds.has(record.id))
    .map(record => validateProject(record));
  return [...bundled, ...local];
}

export async function saveProject(project) {
  if (bundledIds.has(project.id)) {
    await writeRecords([{
      id: project.id,
      kind: 'bundled-state',
      favorite: favorite(project.favorite),
      lastOpened: timestamp(project.lastOpened, 0),
    }]);
    return;
  }
  await writeRecords([validateProject(project)]);
}

export async function removeProject(id) {
  if (bundledIds.has(id)) throw new Error('Bundled projects are managed in the repository.');
  await writeRecords([], localId(id));
}

export async function exportLibrary() {
  const records = await readRecords();
  const projects = records
    .filter(record => record.kind !== 'bundled-state' && !bundledIds.has(record.id))
    .map(record => validateProject(record));
  const backup = { format: 'extelon-library', version: 1, projects };
  if (encoder.encode(JSON.stringify(backup)).byteLength > MAX_BACKUP_BYTES) {
    throw new Error('This library exceeds the 30 MB backup limit. Download large HTML projects separately first.');
  }
  return backup;
}

export async function importLibrary(data, bundledProjects) {
  if (!data || data.format !== 'extelon-library' || data.version !== 1 || !Array.isArray(data.projects)) {
    throw new Error('Choose a valid Extelon Library backup (.json).');
  }
  let serialized;
  try {
    serialized = JSON.stringify(data);
  } catch {
    throw new Error('The backup is not valid JSON data.');
  }
  if (encoder.encode(serialized).byteLength > MAX_BACKUP_BYTES) {
    throw new Error('This backup exceeds the 30 MB import limit.');
  }
  const reservedIds = new Set(bundledProjects.map(project => project.id));
  const projects = data.projects.map(project => validateProject(project, reservedIds));
  if (new Set(projects.map(project => project.id)).size !== projects.length) {
    throw new Error('The backup contains duplicate project IDs.');
  }
  // Validate every record before opening a write transaction: imports are atomic.
  await writeRecords(projects);
  return projects.length;
}
