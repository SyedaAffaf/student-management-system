import axios from 'axios';

const api = axios.create({ baseURL: '/api' });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// If the token expires, send the person back to login.
api.interceptors.response.use(
  (r) => r,
  (err) => {
    if (err.response?.status === 401 && !location.pathname.startsWith('/login')) {
      localStorage.clear();
      location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export const errMsg = (e) => e.response?.data?.message || 'Cannot reach the server. Is the backend running?';
export default api;
