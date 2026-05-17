import api from '../api/axios.js';

export const noteService = {
  getAll: (params) => api.get('/notes', { params }),
  getShared: (params) => api.get('/notes/shared', { params }),
  getSharedUnreadCount: () => api.get('/notes/shared/unread-count'),
  markSharedAsRead: () => api.post('/notes/shared/mark-read'),
  getById: (id) => api.get(`/notes/${id}`),
  create: (data) => api.post('/notes', data),
  update: (id, data) => api.put(`/notes/${id}`, data),
  delete: (id) => api.delete(`/notes/${id}`),
  share: (id, data) => api.post(`/notes/${id}/share`, data),
  search: (params) => api.get('/search', { params }),
  getHistory: (id, params) => api.get(`/notes/${id}/history`, { params }),
  restoreVersion: (id, versionId) => api.post(`/notes/${id}/restore/${versionId}`),
};
