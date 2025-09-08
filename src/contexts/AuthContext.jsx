import React, { createContext, useContext, useState, useEffect } from 'react';
import apiService from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is logged in on app start
  useEffect(() => {
    const checkAuth = async () => {
      const token = apiService.getToken();
      if (token) {
        try {
          const response = await apiService.getCurrentUser();
          if (response.status === 'success') {
            setUser(response.data.user);
            setProfile(response.data.profile);
          }
        } catch (error) {
          console.error('Auth check failed:', error);
          apiService.removeToken();
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      setError(null);
      setLoading(true);
      
      const response = await apiService.login(email, password);
      
      if (response.status === 'success') {
        setUser(response.data.user);
        setProfile(response.data.profile);
        return { success: true, data: response.data };
      }
      
      throw new Error(response.message || 'Login failed');
    } catch (error) {
      setError(error.message);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setError(null);
      setLoading(true);
      
      const response = await apiService.register(userData);
      
      if (response.status === 'success') {
        setUser(response.data.user);
        setProfile(response.data.profile);
        apiService.setToken(response.data.token);
        return { success: true, data: response.data };
      }
      
      throw new Error(response.message || 'Registration failed');
    } catch (error) {
      setError(error.message);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await apiService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      setProfile(null);
      apiService.removeToken();
    }
  };

  const updateProfile = async (profileData) => {
    try {
      setError(null);
      
      const response = await apiService.updateProfile(profileData);
      
      if (response.status === 'success') {
        setProfile(response.data.profile);
        return { success: true, data: response.data };
      }
      
      throw new Error(response.message || 'Profile update failed');
    } catch (error) {
      setError(error.message);
      return { success: false, error: error.message };
    }
  };

  const clearError = () => {
    setError(null);
  };

  const value = {
    user,
    profile,
    loading,
    error,
    login,
    register,
    logout,
    updateProfile,
    clearError,
    isAuthenticated: !!user,
    isOrganization: user?.role === 'organization',
    isEmployee: user?.role === 'employee',
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};



