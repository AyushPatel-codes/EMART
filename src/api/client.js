import axios from 'axios';

const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api' });

api.interceptors.request.use((cfg) => {
  const token = localStorage.getItem('emart_token');
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});

// Expired/revoked/suspended -> backend answers 401: drop the session everywhere.
api.interceptors.response.use((r) => r, (err) => {
  if (err.response?.status === 401 && localStorage.getItem('emart_token')) {
    window.dispatchEvent(new Event('emart:logout'));
  }
  return Promise.reject(err);
});

export const errMsg = (e) => e.response?.data?.message || (e.request ? 'Cannot reach the server' : e.message) || 'Something went wrong';
export const errFields = (e) => e.response?.data?.errors || {};
export default api;
