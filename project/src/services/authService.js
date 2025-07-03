// filepath: c:\Users\2407090\CabGo\project\src\services\authService.js
import api from '../utils/axios';

export const userService = {
  register: async (userData) => {
    const response = await api.post('/users/register', userData);
    return response.data;
  },

  login: async (credentials) => {
    const response = await api.post('/users/login', credentials);
    return response.data;
  },

  getProfile: async () => {
    const response = await api.get('/users/profile');
    return response.data;
  },
};

export const driverService = {
  register: async (driverData) => {
    const response = await api.post('/drivers/register', driverData);
    return response.data;
  },

  login: async (credentials) => {
    const response = await api.post('/drivers/login', credentials);
    return response.data;
  },

  getProfile: async () => {
    const response = await api.get('/drivers/profile');
    return response.data;
  },

  updateStatus: async (available) => {
    const response = await api.put(`/drivers/status?available=${available}`);
    return response.data;
  },
};