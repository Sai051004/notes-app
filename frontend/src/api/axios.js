import axios from 'axios';
import { API_BASE_URL, STORAGE_KEYS } from '../constants/index.js';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message || error.message || 'Something went wrong';

    if (error.response?.status === 401) {
      const hadSession = !!localStorage.getItem(STORAGE_KEYS.TOKEN);
      localStorage.removeItem(STORAGE_KEYS.TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER);
      const isAuthPage =
        window.location.pathname.includes('/login') ||
        window.location.pathname.includes('/register');
      if (!isAuthPage && hadSession) {
        window.dispatchEvent(new CustomEvent('notes:session-expired'));
      }
    }

    return Promise.reject(new Error(message));
  },
);

export default api;
