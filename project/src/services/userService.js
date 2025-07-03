import api from '../utils/axios';

export const userService = {
  getRideHistory: async () => {
    const response = await api.get('/users/rides');
    return response.data;
  },

  getStats: async () => {
    const response = await api.get('/users/stats');
    return response.data;
  },

  updateProfile: async (profileData) => {
    const response = await api.put('/users/profile', profileData);
    return response.data;
  }
};