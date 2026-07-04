import React, { createContext, useState, useEffect, useContext } from 'react';
import * as authService from '../services/authService';

const AdminAuthContext = createContext();

export const AdminAuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('adminToken');
      const cachedUser = localStorage.getItem('adminUser');
      if (token && cachedUser) {
        try {
          // Set cached session immediately
          setAdmin(JSON.parse(cachedUser));
          
          // Verify with backend
          const freshData = await authService.getMe();
          setAdmin(prev => ({ ...prev, ...freshData }));
        } catch (err) {
          console.warn('Admin token verification failed, clearing cache', err);
          localStorage.removeItem('adminToken');
          localStorage.removeItem('adminUser');
          setAdmin(null);
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    setError(null);
    setLoading(true);
    try {
      const data = await authService.login(email, password);
      setAdmin(data);
      setLoading(false);
      return data;
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Login failed. Please check credentials.';
      setError(errMsg);
      setLoading(false);
      throw new Error(errMsg);
    }
  };

  const register = async (name, email, password, code) => {
    setError(null);
    setLoading(true);
    try {
      const data = await authService.register(name, email, password, code);
      setAdmin(data);
      setLoading(false);
      return data;
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Registration failed. Please try again.';
      setError(errMsg);
      setLoading(false);
      throw new Error(errMsg);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await authService.logout();
    } finally {
      setAdmin(null);
      setLoading(false);
    }
  };

  return (
    <AdminAuthContext.Provider value={{ admin, loading, error, login, register, logout, isAuthenticated: !!admin }}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => useContext(AdminAuthContext);
export default AdminAuthContext;
