export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const STORAGE_KEYS = {
  TOKEN: 'notes_token',
  USER: 'notes_user',
  THEME: 'notes_theme',
};

export const ROUTES = {
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/',
  CREATE_NOTE: '/notes/new',
  EDIT_NOTE: '/notes/:id/edit',
  SHARED: '/shared',
  SEARCH: '/search',
  HISTORY: '/notes/:id/history',
  ABOUT: '/about',
};

export const NOTE_SORT_OPTIONS = [
  { value: 'updatedAt', label: 'Last Updated' },
  { value: 'createdAt', label: 'Created Date' },
  { value: 'title', label: 'Title' },
];
