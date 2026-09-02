import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('roxx_user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(() => localStorage.getItem('roxx_token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      if (token) {
        try {
          const res = await api.get('/auth/me');
          if (res.data.success && res.data.data.user) {
            setUser(res.data.data.user);
            localStorage.setItem('roxx_user', JSON.stringify(res.data.data.user));
          }
        } catch (error) {
          console.error('Failed to restore session:', error);
          logout();
        }
      }
      setLoading(false);
    };

    fetchCurrentUser();
  }, [token]);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    if (res.data.success) {
      const { user: loggedInUser, token: authToken } = res.data.data;
      setUser(loggedInUser);
      setToken(authToken);
      localStorage.setItem('roxx_token', authToken);
      localStorage.setItem('roxx_user', JSON.stringify(loggedInUser));
      return loggedInUser;
    }
    throw new Error(res.data.message || 'Login failed');
  };

  const signup = async ({ name, email, password, address }) => {
    const res = await api.post('/auth/signup', { name, email, password, address });
    if (res.data.success) {
      const { user: registeredUser, token: authToken } = res.data.data;
      setUser(registeredUser);
      setToken(authToken);
      localStorage.setItem('roxx_token', authToken);
      localStorage.setItem('roxx_user', JSON.stringify(registeredUser));
      return registeredUser;
    }
    throw new Error(res.data.message || 'Signup failed');
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('roxx_token');
    localStorage.removeItem('roxx_user');
  };

  const updatePassword = async (currentPassword, newPassword) => {
    const res = await api.put('/auth/update-password', {
      currentPassword,
      newPassword,
    });
    return res.data;
  };

  const refreshProfile = async () => {
    try {
      const res = await api.get('/auth/me');
      if (res.data.success && res.data.data.user) {
        setUser(res.data.data.user);
        localStorage.setItem('roxx_user', JSON.stringify(res.data.data.user));
      }
    } catch (e) {
      console.error('Failed to refresh profile', e);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!user && !!token,
        login,
        signup,
        logout,
        updatePassword,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
