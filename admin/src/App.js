import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';

import Login         from './pages/Login';
import Dashboard     from './pages/Dashboard';
import Bookings      from './pages/Bookings';
import BookingDetail from './pages/BookingDetail';
import Customers     from './pages/Customers';
import Services      from './pages/Services';

import './index.css';

// Only admins can access — redirect to login otherwise
const Protected = ({ children }) => {
  const { admin } = useAuth();
  return admin ? children : <Navigate to="/login" replace />;
};

// If already logged in, skip login page
const GuestOnly = ({ children }) => {
  const { admin } = useAuth();
  return admin ? <Navigate to="/" replace /> : children;
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<GuestOnly><Login /></GuestOnly>} />

      <Route path="/"          element={<Protected><Dashboard /></Protected>} />
      <Route path="/bookings"  element={<Protected><Bookings /></Protected>} />
      <Route path="/bookings/:id" element={<Protected><BookingDetail /></Protected>} />
      <Route path="/customers" element={<Protected><Customers /></Protected>} />
      <Route path="/services"  element={<Protected><Services /></Protected>} />

      {/* Catch-all */}
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
            error:   { style: { background: '#FEE2E2', color: '#991B1B' } },
          }}
        />
      </AuthProvider>
    </BrowserRouter>
  );
}
