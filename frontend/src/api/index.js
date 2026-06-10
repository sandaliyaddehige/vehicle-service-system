import axios from 'axios';


const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL 
    ? `${import.meta.env.VITE_API_BASE_URL}/api` 
    : 'http://localhost:5000/api', 
});

// 🚀 Attach JWT token on every request (Admin & Customer Auto-detect)
API.interceptors.request.use((config) => {
  // 1. check Admin token
  const admin = JSON.parse(localStorage.getItem('fuchsiusAdmin') || 'null');
  
  // 2. check Customer token (fuchsiusUser or legacy user key)
  const user = JSON.parse(localStorage.getItem('fuchsiusUser') || localStorage.getItem('user') || 'null');

  if (admin?.token) {
    config.headers.Authorization = `Bearer ${admin.token}`;
  } else if (user?.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  } else if (localStorage.getItem('token')) {
    
    config.headers.Authorization = `Bearer ${localStorage.getItem('token')}`;
  }
  
  return config;
});

// Auto-logout on 401
API.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      
      localStorage.removeItem('fuchsiusAdmin');
      localStorage.removeItem('fuchsiusUser');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ── AUTH ──
export const loginAdmin    = (data) => API.post('/auth/login', data);
export const getMe         = ()     => API.get('/auth/me');

// ── DASHBOARD ──
export const getDashboardStats = () => API.get('/bookings/stats');

// ── BOOKINGS ──
export const getBookings         = (p) => API.get('/bookings', { params: p });
export const getBookingById      = (id) => API.get(`/bookings/${id}`);
export const updateBookingStatus = (id, data) => API.put(`/bookings/${id}/status`, data);
export const deleteBooking       = (id) => API.delete(`/bookings/${id}`);

// ── SERVICES ──
export const getAllServices   = ()       => API.get('/services/admin');
export const createService   = (data)   => API.post('/services', data);
export const updateService   = (id, d)  => API.put(`/services/${id}`, d);
export const deleteService   = (id)     => API.delete(`/services/${id}`);

// ── CUSTOMERS ──
export const getCustomers     = (p)     => API.get('/customers', { params: p });
export const getCustomerById  = (id)    => API.get(`/customers/${id}`);
export const updateCustomer   = (id, d) => API.put(`/customers/${id}`, d);

export default API;