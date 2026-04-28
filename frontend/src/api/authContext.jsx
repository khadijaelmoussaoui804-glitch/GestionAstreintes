import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authAPI } from './client';

const AuthContext = createContext();

const getApiErrorMessage = (err, fallback) => {
  if (err.response?.data?.errors) {
    return Object.values(err.response.data.errors).flat()[0] || fallback;
  }
  if (err.response?.data?.error) {       
    return err.response.data.error;
  }
  if (err.response?.data?.message) {
    return err.response.data.message;
  }
  return fallback;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('auth_token'));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is already logged in
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('auth_token');

    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setToken(storedToken);
    }
    setLoading(false);
  }, []);

  const login = useCallback(async (email, password) => {
    try {
      setError(null);
      const response = await authAPI.login(email, password);
      const { user, token } = response.data;

      localStorage.setItem('auth_token', token);
      localStorage.setItem('user', JSON.stringify(user));

      setUser(user);
      setToken(token);

      return response.data;
    } catch (err) {
      const errorMessage = getApiErrorMessage(err, 'Login failed');
      setError(errorMessage);
      throw err;
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await authAPI.logout();
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      setUser(null);
      setToken(null);
    }
  }, []);
  const register = useCallback(async (data) => {
    try {
      setError(null);
      const response = await authAPI.register(data);
      const { user, token } = response.data;
      localStorage.setItem('auth_token', token);
      localStorage.setItem('user', JSON.stringify(user));
      setUser(user);
      setToken(token);
      return response.data;
    } catch (err) {
      const errorMessage = getApiErrorMessage(err, 'Registration failed');
      setError(errorMessage);
      throw err;
    }
  }, []);

  const updateProfile = useCallback(async (data) => {
    try {
      setError(null);
      const response = await authAPI.updateProfile(data);
      const updatedUser = response.data?.user ?? { ...user, ...data };

      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);

      return response.data;
    } catch (err) {
      const errorMessage = getApiErrorMessage(err, 'Update failed');
      setError(errorMessage);
      throw err;
    }
  }, [user]);

  const value = {
    user,
    token,
    loading,
    error,
    isAuthenticated: !!token,
    login,
    logout,
    register,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
