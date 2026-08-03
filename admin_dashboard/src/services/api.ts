import axios, { type InternalAxiosRequestConfig, type AxiosError } from 'axios';
import { getFirebaseAuth } from './authService';

const baseURL: string =
  import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000/api/v1';

export const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach the current Firebase Auth ID token to every outgoing request.
api.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
  const auth = getFirebaseAuth();
  const currentUser = auth.currentUser;
  if (currentUser) {
    const token = await currentUser.getIdToken();
    config.headers.set('Authorization', 'Bearer ' + token);
  }
  return config;
});

// Redirect to the login page whenever the API reports an unauthenticated request.
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      if (window.location.pathname !== '/login') {
        window.location.assign('/login');
      }
    }
    return Promise.reject(error);
  }
);

export default api;
