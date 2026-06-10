import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';

// Public pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Services from './pages/Services';
import BookingForm from './pages/BookingForm';
import MyBookings from './pages/MyBookings';
import Contact from './pages/Contact';

// Admin pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminBookings from './pages/admin/AdminBookings';
import AdminCustomers from './pages/admin/AdminCustomers';
import AdminServices from './pages/admin/AdminServices';

import './index.css';

// Route guards
const AdminRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== 'admin') return <Navigate to="/" replace />;
  return children;
};

const PrivateRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/services" element={<Services />} />
      <Route path="/book" element={<BookingForm />} />
      <Route path="/contact" element={<Contact />} />

      {/* Private - customer */}
      <Route path="/my-bookings" element={<PrivateRoute><MyBookings /></PrivateRoute>} />

      {/* Admin */}
      <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
      <Route path="/admin/bookings" element={<AdminRoute><AdminBookings /></AdminRoute>} />
      <Route path="/admin/customers" element={<AdminRoute><AdminCustomers /></AdminRoute>} />
      <Route path="/admin/services" element={<AdminRoute><AdminServices /></AdminRoute>} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
        <Toaster
          position="top-right"
          toastOptions={{
            style: { fontFamily: 'DM Sans, sans-serif', fontSize: 13, borderRadius: 10 },
            success: { style: { background: '#D1FAE5', color: '#065F46' } },
            error: { style: { background: '#FEE2E2', color: '#991B1B' } },
          }}
        />
      </AuthProvider>
    </BrowserRouter>
  );
}
