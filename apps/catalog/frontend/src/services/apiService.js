// apiService.js
// Servicio base para peticiones HTTP a la API backend

const API_BASE_URL = process.env.REACT_APP_API_URL;
if (!API_BASE_URL) {
  throw new Error('REACT_APP_API_URL no está definida en el entorno. Por favor, configura la variable en tu archivo .env del frontend.');
}

const RUNTIME_ENV_KEY = 'runtime:selectedEnvironment';
const RUNTIME_SOURCE_KEY = 'runtime:selectedDataSource';
const RUNTIME_META_KEY = 'runtime:lastMeta';

function getSelectedEnvironment() {
  return (localStorage.getItem(RUNTIME_ENV_KEY) || 'dev').toLowerCase();
}

function getSelectedDataSource() {
  return (localStorage.getItem(RUNTIME_SOURCE_KEY) || 'mysql').toLowerCase();
}

function setRuntimeSelection({ environment, dataSource }) {
  if (environment) {
    localStorage.setItem(RUNTIME_ENV_KEY, String(environment).toLowerCase());
  }
  if (dataSource) {
    localStorage.setItem(RUNTIME_SOURCE_KEY, String(dataSource).toLowerCase());
  }
  window.dispatchEvent(new CustomEvent('runtime-selection-updated'));
}

function getRuntimeSelection() {
  return {
    environment: getSelectedEnvironment(),
    dataSource: getSelectedDataSource()
  };
}

function readRuntimeMeta() {
  const raw = localStorage.getItem(RUNTIME_META_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function saveRuntimeMetaFromResponse(response) {
  const meta = {
    requestedEnvironment: response.headers.get('x-runtime-env-requested') || null,
    servedEnvironment: response.headers.get('x-runtime-env-served') || null,
    requestedDataSource: response.headers.get('x-data-source-requested') || null,
    servedDataSource: response.headers.get('x-data-source-served') || null,
    fallbackApplied: response.headers.get('x-data-source-fallback') === '1',
    mysqlAvailable: response.headers.get('x-data-source-mysql-available') === '1',
    updatedAt: new Date().toISOString()
  };

  localStorage.setItem(RUNTIME_META_KEY, JSON.stringify(meta));
  window.dispatchEvent(new CustomEvent('runtime-meta-updated', { detail: meta }));
}

function buildHeaders(includeJson = false) {
  const token = localStorage.getItem('token');
  const headers = {};
  if (includeJson) headers['Content-Type'] = 'application/json';
  if (token) headers['Authorization'] = `Bearer ${token}`;
  headers['x-runtime-env'] = getSelectedEnvironment();
  headers['x-data-source'] = getSelectedDataSource();
  return headers;
}

async function parseError(response, defaultMsg) {
  let msg = defaultMsg;
  try {
    const data = await response.json();
    msg = data.message || data.error || msg;
  } catch {
    // Keep default message
  }
  return msg;
}

async function request(method, path, body) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: buildHeaders(method !== 'GET'),
    body: body ? JSON.stringify(body) : undefined
  });

  saveRuntimeMetaFromResponse(response);

  if (!response.ok) {
    const msg = await parseError(response, 'Request failed');
    throw new Error(msg);
  }

  return response.json();
}

const apiService = {
  async login({ username, password }) {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: buildHeaders(true),
      body: JSON.stringify({ username, password })
    });
    saveRuntimeMetaFromResponse(response);
    let data;
    try {
      data = await response.json();
    } catch {
      data = {};
    }
    if (!response.ok) {
      // Si el backend manda un mensaje, úsalo
      throw new Error(data.message || 'Authentication error');
    }
    return data;
  },

  async post(path, body) {
    return request('POST', path, body);
  },

  async get(path) {
    return request('GET', path);
  },

  async patch(path, body) {
    return request('PATCH', path, body);
  },

  async getRuntimeStatus() {
    return request('GET', '/runtime/status');
  },

  getRuntimeSelection,
  setRuntimeSelection,
  getLastRuntimeMeta: readRuntimeMeta
};

export default apiService;
