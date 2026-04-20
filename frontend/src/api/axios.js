import axios from 'axios';
import { auth } from '../firebase';

const API_BASE_URL = import.meta.env.VITE_API_URL || (typeof window !== 'undefined' ? window.location.origin : '');

const api = axios.create({
  baseURL: API_BASE_URL.endsWith('/api') ? API_BASE_URL : `${API_BASE_URL}/api`,
  withCredentials: true, // Still good for backwards compatibility if needed
  headers: {
    'Content-Type': 'application/json',
  },
});

// ─── Request Interceptor ───────────────────────────────────────────────────────
api.interceptors.request.use(
  async (config) => {
    // Attach Firebase ID token if user is logged in
    if (auth.currentUser) {
      try {
        console.log('Firebase user exists, getting token...');
        const token = await auth.currentUser.getIdToken();
        console.log('Token fetched successfully');
        config.headers.Authorization = `Bearer ${token}`;
      } catch (err) {
        console.error('Failed to get Firebase token', err);
        alert('Firebase token error: ' + err.message);
      }
    } else {
      console.log('No auth.currentUser available');
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ─── Response Interceptor ──────────────────────────────────────────────────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const message = error.response?.data?.error || error.message;

    if (status === 401) {
      // Token expired or invalid — redirect to login
      // Avoid redirect loop if already on login page
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login?session=expired';
      }
    }

    return Promise.reject({
      status,
      message,
      data: error.response?.data,
    });
  }
);

export default api;

// ─── Typed API Helpers ─────────────────────────────────────────────────────────

/** Auth */
export const authAPI = {
  getMe: () => api.get('/auth/me'),
  logout: () => api.post('/auth/logout'),
  updateProfile: (data) => api.patch('/auth/profile', data),
  verifyFirebase: () => api.post('/auth/verify'),
};

/** Appointments */
export const appointmentsAPI = {
  book: (data) => api.post('/appointments', data),
  getAll: (params) => api.get('/appointments', { params }),
  getById: (id) => api.get(`/appointments/${id}`),
  updateStatus: (id, data) => api.patch(`/appointments/${id}/status`, data),
  update: (id, data) => api.patch(`/appointments/${id}`, data),
  delete: (id) => api.delete(`/appointments/${id}`),
  getStats: () => api.get('/appointments/stats/overview'),
};

/** Slots */
export const slotsAPI = {
  getAvailable: () => api.get('/slots/available'),
  getAll: (params) => api.get('/slots', { params }),
  create: (data) => api.post('/slots', data),
  update: (id, data) => api.patch(`/slots/${id}`, data),
  delete: (id) => api.delete(`/slots/${id}`),
};

/** Experts */
export const expertsAPI = {
  getMe: () => api.get('/experts/me'),
  updateMe: (formData) => api.put('/experts/me', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  getAll: () => api.get('/experts'),
  getAllAdmin: () => api.get('/experts/all'),
  getById: (id) => api.get(`/experts/${id}`),
  create: (formData) => api.post('/experts', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  update: (id, formData) =>
    api.put(`/experts/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  delete: (id) => api.delete(`/experts/${id}`),
};

/** Resources */
export const resourcesAPI = {
  getPublished: (params) => api.get('/resources', { params }),
  getAllAdmin: (params) => api.get('/resources/all', { params }),
  getById: (id) => api.get(`/resources/${id}`),
  create: (formData) =>
    api.post('/resources', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  update: (id, formData) =>
    api.put(`/resources/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  delete: (id) => api.delete(`/resources/${id}`),
  incrementDownload: (id) => api.patch(`/resources/${id}/download`),
};

/** Contact */
export const contactAPI = {
  send: (data) => api.post('/contact', data),
  getAll: (params) => api.get('/contact', { params }),
  markRead: (id, isRead = true) => api.patch(`/contact/${id}/read`, { isRead }),
  delete: (id) => api.delete(`/contact/${id}`),
};

/** Newsletter */
export const newsletterAPI = {
  subscribe: (email) => api.post('/newsletter', { email }),
  getAll: (params) => api.get('/newsletter', { params }),
  delete: (id) => api.delete(`/newsletter/${id}`),
};

/** Users (Admin) */
export const usersAPI = {
  getAll: (params) => api.get('/users', { params }),
  getById: (id) => api.get(`/users/${id}`),
  updateRole: (id, role) => api.patch(`/users/${id}/role`, { role }),
  setActive: (id, isActive) => api.patch(`/users/${id}/active`, { isActive }),
  delete: (id) => api.delete(`/users/${id}`),
  getDashboardStats: () => api.get('/users/dashboard-stats'),
};
