import axios from 'axios';
import { useAuthStore } from '../store/authStore';

const rawUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const baseURL = rawUrl.endsWith('/api') ? rawUrl : `${rawUrl}/api`;

export const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    console.error('API error:', err.response?.data || err.message);
    if (err.response?.status === 401) {
      useAuthStore.getState().logout();
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export function extractError(err: unknown): { code: string; message: string } {
  if (axios.isAxiosError(err) && err.response?.data) {
    const d = err.response.data;
    if (!d.success && d.error) return d.error;
  }
  return { code: 'UNKNOWN', message: 'An unexpected error occurred.' };
}
