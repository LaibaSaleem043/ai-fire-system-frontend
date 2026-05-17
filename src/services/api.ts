import axios from 'axios';
import { Detection, AnalyticsSummary, AnalyticsTrend, User } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://laiba1232-smoke.hf.space/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 1. Add interceptor for JWT (Request)
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// 2. Add interceptor for 401 Unauthorized (Response)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn("[API] 401 Unauthorized - Clearing token and redirecting to login");
      localStorage.removeItem('token');
      if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
        window.location.replace('/login');
      }
    }
    return Promise.reject(error);
  }
);

export const apiService = {
  // Auth
  login: async (credentials: { username: string; password: any }) => {
    const params = new URLSearchParams();
    params.append('username', credentials.username);
    params.append('password', credentials.password);
    
    const { data } = await api.post('/users/login', params, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    return data;
  },

  register: async (userData: { name: string; email: string; password: string; otp_code: string }) => {
    const { data } = await api.post('/users/register', userData);
    return data;
  },

  requestRegister: async (email: string) => {
    const { data } = await api.post('/users/register/request', { email });
    return data;
  },

  requestPasswordReset: async (email: string) => {
    const { data } = await api.post('/users/forgot-password/request', { email });
    return data;
  },

  resetPassword: async (resetData: any) => {
    const { data } = await api.post('/users/forgot-password/reset', resetData);
    return data;
  },

  // User Management (Admin Only)
  getUsers: async () => {
    const { data } = await api.get<any[]>('/users/');
    return data;
  },

  createUserByAdmin: async (userData: any) => {
    const { data } = await api.post('/users/', userData);
    return data;
  },

  deleteUser: async (userId: number) => {
    const { data } = await api.delete(`/users/${userId}`);
    return data;
  },

  // Detections
  getDetections: async () => {
    const { data } = await api.get<Detection[]>('/detections/');
    return data;
  },

  approveDetection: async (id: number) => {
    const { data } = await api.patch(`/detections/${id}/approve`);
    return data;
  },

  rejectDetection: async (id: number) => {
    const { data } = await api.patch(`/detections/${id}/reject`);
    return data;
  },

  deleteDetection: async (id: number) => {
    const { data } = await api.delete(`/detections/${id}`);
    return data;
  },

  getDetectionById: async (id: number) => {
    const { data } = await api.get(`/detections/${id}`);
    return data;
  },

  exportCSV: async () => {
    const { data } = await api.get('/detections/export/csv', { responseType: 'blob' });
    return data;
  },

  // Analytics
  getAnalyticsSummary: async () => {
    const { data } = await api.get<AnalyticsSummary>('/analytics/summary');
    return data;
  },

  getAnalyticsTrends: async () => {
    const { data } = await api.get<AnalyticsTrend[]>('/analytics/trends');
    return data;
  },

  getAnalyticsBySource: async () => {
    const { data } = await api.get<any[]>('/analytics/by-source');
    return data;
  },

  // Upload
  uploadVideo: async (file: File, onProgress?: (progress: number) => void) => {
    const formData = new FormData();
    formData.append('file', file);
    const { data } = await api.post('/upload/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          onProgress(Math.round((progressEvent.loaded * 100) / progressEvent.total));
        }
      },
    });
    return data;
  },

  getUploadStatus: async () => {
    const { data } = await api.get('/upload/status');
    return data;
  },

  // Stream
  getStreamStatus: async () => {
    const { data } = await api.get('/stream/status');
    return data;
  },

  toggleStream: async () => {
    const { data } = await api.post('/stream/toggle');
    return data;
  },

  // Recycle Bin
  getDeletedDetections: async () => {
    const { data } = await api.get<Detection[]>('/recycle/');
    return data;
  },

  restoreDetection: async (id: number) => {
    const { data } = await api.post(`/recycle/${id}/restore`);
    return data;
  },

  purgeDetection: async (id: number) => {
    const { data } = await api.delete(`/recycle/${id}/purge`);
    return data;
  },
};
