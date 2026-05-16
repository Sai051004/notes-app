import api from '../api/axios.js';

export const authService = {
  register: (data) => api.post('/register', data),
  login: (data) => api.post('/login', data),
};
