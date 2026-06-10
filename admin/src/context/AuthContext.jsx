import { createContext, useContext, useState } from 'react';
import { loginAdmin } from '../api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(() => {
    try { return JSON.parse(localStorage.getItem('fuchsiusAdmin') || 'null'); }
    catch { return null; }
  });
  const [loading, setLoading] = useState(false);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const { data } = await loginAdmin({ email, password });
      if (data.role !== 'admin') return { success: false, message: 'Access denied. Admins only.' };
      localStorage.setItem('fuchsiusAdmin', JSON.stringify(data));
      setAdmin(data);
      return { success: true };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Login failed' };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('fuchsiusAdmin');
    setAdmin(null);
  };

  return (
    <AuthContext.Provider value={{ admin, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
