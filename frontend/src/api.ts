import axios from 'axios';
import { offlineStorage, registerSync, isOnline } from './utils/offlineStorage';

const API_BASE_URL = (import.meta as any).env.VITE_API_BASE_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Token ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;
    
    // If offline and it's a mood POST request, save to offline storage
    if (!isOnline() && originalRequest.url === '/api/moods/' && originalRequest.method === 'post') {
      const token = localStorage.getItem('token');
      await offlineStorage.saveMood(originalRequest.data, token);
      
      // Return a mock successful response
      return Promise.resolve({
        data: {
          id: Date.now(),
          ...originalRequest.data,
          timestamp: new Date().toISOString(),
          offline: true,
        },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: originalRequest,
      });
    }
    
    return Promise.reject(error);
  }
);

export default api;
