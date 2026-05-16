import axios from 'axios';
import { API_BASE_URL } from '../constants/index.js';

export const aboutService = {
  getAbout: () => axios.get(`${API_BASE_URL}/about`),
};
