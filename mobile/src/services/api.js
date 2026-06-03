import Constants from 'expo-constants';

const API_URL =
  Constants.expoConfig?.extra?.apiUrl ||
  process.env.EXPO_PUBLIC_API_URL ||
  'http://localhost:3000/api';

class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

let accessToken = null;
let refreshToken = null;
let onTokenRefresh = null;

export function setTokens(access, refresh) {
  accessToken = access;
  refreshToken = refresh;
}

export function setOnTokenRefresh(callback) {
  onTokenRefresh = callback;
}

async function request(path, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`;
  }

  let response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  if (response.status === 401 && refreshToken && !options._retry) {
    const refreshRes = await fetch(`${API_URL}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });

    if (refreshRes.ok) {
      const tokens = await refreshRes.json();
      accessToken = tokens.accessToken;
      refreshToken = tokens.refreshToken;
      onTokenRefresh?.(tokens);
      return request(path, { ...options, _retry: true });
    }
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new ApiError(data.error || 'Error de servidor', response.status);
  }

  return data;
}

export const api = {
  register: (body) => request('/auth/register', { method: 'POST', body }),
  login: (body) => request('/auth/login', { method: 'POST', body }),
  logout: (body) => request('/auth/logout', { method: 'POST', body }),
  forgotPassword: (body) => request('/auth/forgot-password', { method: 'POST', body }),
  resetPassword: (body) => request('/auth/reset-password', { method: 'POST', body }),
  me: () => request('/auth/me'),

  listGroups: () => request('/groups'),
  createGroup: (body) => request('/groups', { method: 'POST', body }),
  joinGroup: (body) => request('/groups/join', { method: 'POST', body }),
  getGroup: (id) => request(`/groups/${id}`),
  triggerLight: (id) => request(`/groups/${id}/lights`, { method: 'POST' }),
  getFeed: (id) => request(`/groups/${id}/feed`),
  getStats: (id) => request(`/groups/${id}/stats`),

  addReaction: (eventId, emoji) =>
    request(`/events/${eventId}/reactions`, { method: 'POST', body: { emoji } }),

  registerPush: (body) => request('/push/register', { method: 'POST', body }),
};

export { ApiError, API_URL };
