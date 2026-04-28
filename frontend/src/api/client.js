import axios from 'axios';

const apiBaseURL = (import.meta.env.VITE_API_URL || '/api').replace(/\/$/, '');

const API = axios.create({
  baseURL: apiBaseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  login: (email, password) => {
    return API.post('/auth/login', { email, password });
  },

  register: (data) => {
    return API.post('/auth/register', data);
  },

  logout: () => {
    return API.post('/auth/logout');
  },

  updateProfile: (data) => {
    return API.put('/auth/profile', data);
  },
};
