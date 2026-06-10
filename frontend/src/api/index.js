import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
});

// Add token to every request
API.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem('fuchsiusUser') || 'null');
  if (user?.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

// Handle 401 globally
API.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('fuchsiusUser');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ── AUTH ──
export const registerUser = (data) => API.post('/auth/register', data);
export const loginUser = (data) => API.post('/auth/login', data);
export const getMe = () => API.get('/auth/me');

// ── BOOKINGS ──
export const createBooking = (data) => API.post('/bookings', data);
export const getBookings = (params) => API.get('/bookings', { params });
export const getBookingById = (id) => API.get(`/bookings/${id}`);
export const updateBookingStatus = (id, data) => API.put(`/bookings/${id}/status`, data);
export const deleteBooking = (id) => API.delete(`/bookings/${id}`);
export const getDashboardStats = () => API.get('/bookings/stats');

// ── SERVICES ──
export const getServices = (params) => API.get('/services', { params });
export const getAllServicesAdmin = () => API.get('/services/admin');
export const createService = (data) => API.post('/services', data);
export const updateService = (id, data) => API.put(`/services/${id}`, data);
export const deleteService = (id) => API.delete(`/services/${id}`);

// ── CUSTOMERS ──
export const getCustomers = (params) => API.get('/customers', { params });
export const getCustomerById = (id) => API.get(`/customers/${id}`);
export const updateCustomer = (id, data) => API.put(`/customers/${id}`, data);

export default API;
