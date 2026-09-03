import axios from 'axios';

// By default we point to the API gateway or users service for auth
export const api = axios.create({
  baseURL: 'http://localhost:8081/api', // usuarios-service as default for Auth
  headers: {
    'Content-Type': 'application/json',
  },
});

// For multiple services, we might define specific instances or use paths
export const ofertasApi = axios.create({
  baseURL: 'http://localhost:8082/api',
  headers: { 'Content-Type': 'application/json' },
});

export const postulacionesApi = axios.create({
  baseURL: 'http://localhost:8083/api',
  headers: { 'Content-Type': 'application/json' },
});

const injectToken = (config: any) => {
  const token = localStorage.getItem('jwt_token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
};

api.interceptors.request.use(injectToken);
ofertasApi.interceptors.request.use(injectToken);
postulacionesApi.interceptors.request.use(injectToken);

// Error handlers (401, 403, etc.)
const handleErrors = (error: any) => {
  if (error.response?.status === 401) {
    localStorage.removeItem('jwt_token');
    window.location.href = '/auth/login';
  }
  return Promise.reject(error);
};

api.interceptors.response.use((res) => res, handleErrors);
ofertasApi.interceptors.response.use((res) => res, handleErrors);
postulacionesApi.interceptors.response.use((res) => res, handleErrors);
