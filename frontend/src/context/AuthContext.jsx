import { createContext, useContext, useState, useEffect } from 'react';
import { loginUser, registerUser } from '../api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('fuchsiusUser');
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(false);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const { data } = await loginUser({ email, password });
      localStorage.setItem('fuchsiusUser', JSON.stringify(data));
      setUser(data);
      return { success: true, role: data.role };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Login failed' };
    } finally {
      setLoading(false);
    }
  };

  const register = async (formData) => {
    setLoading(true);
    try {
      const { data } = await registerUser(formData);
      localStorage.setItem('fuchsiusUser', JSON.stringify(data));
      setUser(data);
      return { success: true };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Registration failed' };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('fuchsiusUser');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
