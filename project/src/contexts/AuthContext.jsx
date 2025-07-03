import React, { createContext, useContext, useState, useEffect } from 'react';
import { userService, driverService } from '../services/authService';

const AuthContext = createContext(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userType = localStorage.getItem('userType');
    
    if (token) {
      loadUserProfile(userType);
    } else {
      setLoading(false);
    }
  }, []);

  const loadUserProfile = async (type) => {
    try {
      const service = type === 'USER' ? userService : driverService;
      const profile = await service.getProfile();
      setCurrentUser({ ...profile, type });
    } catch (error) {
      localStorage.removeItem('token');
      localStorage.removeItem('userType');
    } finally {
      setLoading(false);
    }
  };

  const login = async (identifier, password, type) => {
    try {
      const service = type === 'user' ? userService : driverService;
      const credentials = type === 'user' 
        ? { email: identifier, password }
        : { phone: identifier, password };

      const response = await service.login(credentials);
      
      if (response.success) {
        localStorage.setItem('token', response.data);
        localStorage.setItem('userType', type.toUpperCase());
        await loadUserProfile(type.toUpperCase());
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const register = async (userData, type) => {
    try {
      const service = type === 'user' ? userService : driverService;
      const response = await service.register(userData);
      return response.success;
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userType');
    setCurrentUser(null);
  };

  const updateDriverStatus = async (available) => {
    try {
      const response = await driverService.updateStatus(available);
      if (response.success) {
        setCurrentUser(prev => ({ ...prev, available }));
      }
      return response.success;
    } catch (error) {
      console.error('Update status error:', error);
      return false;
    }
  };

  return (
    <AuthContext.Provider 
      value={{ 
        currentUser, 
        login, 
        register, 
        logout,
        updateDriverStatus,
        loading 
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};