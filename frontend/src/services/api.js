import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API_BASE = `${BACKEND_URL}/api`;

// Create axios instance
const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('admin_user');
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },
  getMe: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },
};

// Profile API
export const profileAPI = {
  get: async () => {
    const response = await api.get('/profile');
    return response.data;
  },
  update: async (data) => {
    const response = await api.put('/profile', data);
    return response.data;
  },
};

// Experiences API
export const experiencesAPI = {
  getAll: async () => {
    const response = await api.get('/experiences');
    return response.data;
  },
  create: async (data) => {
    const response = await api.post('/experiences', data);
    return response.data;
  },
  update: async (id, data) => {
    const response = await api.put(`/experiences/${id}`, data);
    return response.data;
  },
  delete: async (id) => {
    const response = await api.delete(`/experiences/${id}`);
    return response.data;
  },
};

// Research API
export const researchAPI = {
  getAll: async () => {
    const response = await api.get('/research');
    return response.data;
  },
  create: async (data) => {
    const response = await api.post('/research', data);
    return response.data;
  },
  update: async (id, data) => {
    const response = await api.put(`/research/${id}`, data);
    return response.data;
  },
  delete: async (id) => {
    const response = await api.delete(`/research/${id}`);
    return response.data;
  },
};

// Validators API
export const validatorsAPI = {
  getAll: async () => {
    const response = await api.get('/validators');
    return response.data;
  },
  create: async (data) => {
    const response = await api.post('/validators', data);
    return response.data;
  },
  update: async (id, data) => {
    const response = await api.put(`/validators/${id}`, data);
    return response.data;
  },
  delete: async (id) => {
    const response = await api.delete(`/validators/${id}`);
    return response.data;
  },
};

// Posts API
export const postsAPI = {
  getAll: async (publishedOnly = false) => {
    const response = await api.get('/posts', { params: { published_only: publishedOnly } });
    return response.data;
  },
  getById: async (id) => {
    const response = await api.get(`/posts/${id}`);
    return response.data;
  },
  create: async (data) => {
    const response = await api.post('/posts', data);
    return response.data;
  },
  update: async (id, data) => {
    const response = await api.put(`/posts/${id}`, data);
    return response.data;
  },
  delete: async (id) => {
    const response = await api.delete(`/posts/${id}`);
    return response.data;
  },
};

export default api;
