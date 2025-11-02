import axios from 'axios';

const API_URL = 'http://localhost:5000/api/waste';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add response interceptor for better error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const wasteAPI = {
  // Get all records with optional filters
  getAll: (filters = {}) => {
    console.log('Fetching records with filters:', filters);
    return api.get('/', { params: filters });
  },
  
  // Get single record by ID
  getById: (id) => api.get(`/${id}`),
  
  // Create new record
  create: (data) => api.post('/', data),
  
  // Update record
  update: (id, data) => api.put(`/${id}`, data),
  
  // Delete record
  delete: (id) => api.delete(`/${id}`),
};

export default api;