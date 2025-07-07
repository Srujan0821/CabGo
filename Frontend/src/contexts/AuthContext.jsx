import React, { createContext, useContext, useState, useEffect } from 'react';
import API from '../api/axios'; // Import your configured axios instance
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userToken, setUserToken] = useState(localStorage.getItem('userToken'));
  const [driverToken, setDriverToken] = useState(localStorage.getItem('driverToken'));
  const [currentUser, setCurrentUser] = useState(null); // Stores user profile data
  const [currentDriver, setCurrentDriver] = useState(null); // Stores driver profile data
  const [loading, setLoading] = useState(true); // To manage initial loading of user/driver data
  const navigate = useNavigate();

  // Function to fetch user profile
  const fetchUserProfile = async (token) => {
    try {
      const response = await API.get('/users/profile', {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Assuming your user profile response includes a 'type' field
      setCurrentUser({ ...response.data, type: 'user' });
    } catch (error) {
      console.error('Failed to fetch user profile:', error.response?.data || error.message);
      // If profile fetch fails (e.g., token expired), log out client-side
      logoutUserClientSide(); // Use client-side logout to clear token
    }
  };

  // Function to fetch driver profile
  const fetchDriverProfile = async (token) => {
    try {
      const response = await API.get('/drivers/profile', {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Assuming your driver profile response includes a 'type' field
      setCurrentDriver({ ...response.data, type: 'driver' });
    } catch (error) {
      console.error('Failed to fetch driver profile:', error.response?.data || error.message);
      // If profile fetch fails (e.g., token expired), log out client-side
      logoutDriverClientSide(); // Use client-side logout to clear token
    }
  };

  // Effect to load data on initial render or token change
  useEffect(() => {
    const initializeAuth = async () => {
      setLoading(true);
      // Prioritize user if both tokens exist (or handle based on your app logic)
      if (userToken) {
        await fetchUserProfile(userToken);
      } else {
        setCurrentUser(null);
      }
      if (driverToken) {
        await fetchDriverProfile(driverToken);
      } else {
        setCurrentDriver(null);
      }
      setLoading(false);
    };
    initializeAuth();
  }, [userToken, driverToken]); // Re-run if tokens change

  // --- User Authentication Functions ---
  const registerUser = async (userData) => {
    try {
      const response = await API.post('/users/register', userData);
      alert(response.data.message);
      return { success: true };
    } catch (error) {
      console.error('User registration failed:', error.response?.data || error.message);
      alert(error.response?.data?.message || 'Registration failed');
      return { success: false, error: error.response?.data?.message || error.message };
    }
  };

  const loginUser = async (credentials) => {
    try {
      const response = await API.post('/users/login', credentials);
      const token = response.data.data; // The token is in `data` field as per your API structure
      localStorage.setItem('userToken', token);
      setUserToken(token);
      await fetchUserProfile(token); // Fetch profile immediately after login
      alert(response.data.message);
      navigate('/user/dashboard'); // Redirect after successful login
      return { success: true };
    } catch (error) {
      console.error('User login failed:', error.response?.data || error.message);
      alert(error.response?.data?.message || 'Login failed');
      return { success: false, error: error.response?.data?.message || error.message };
    }
  };

  // Client-side logout for User (clears local state/storage)
  const logoutUserClientSide = () => {
    localStorage.removeItem('userToken');
    setUserToken(null);
    setCurrentUser(null);
  };

  // Full logout for User (calls backend, then client-side clear)
  const logoutUser = async () => {
    try {
      // Call your backend logout endpoint for users
      await API.post('/users/logout', {}, {
        headers: { Authorization: `Bearer ${userToken}` },
      });
      console.log('User backend logout successful');
    } catch (error) {
      console.error('Error during user backend logout:', error.response?.data || error.message);
      // Optionally alert user about backend logout failure but proceed with client-side logout
      alert(error.response?.data?.message || 'Logout failed on server, clearing local data.');
    } finally {
      logoutUserClientSide(); // Always clear client-side data
      navigate('/'); // Redirect after logout
    }
  };

  // --- Driver Authentication Functions ---
  const registerDriver = async (driverData) => {
    try {
      const response = await API.post('/drivers/register', driverData);
      alert(response.data.message);
      return { success: true };
    } catch (error) {
      console.error('Driver registration failed:', error.response?.data || error.message);
      alert(error.response?.data?.message || 'Registration failed');
      return { success: false, error: error.response?.data?.message || error.message };
    }
  };

  const loginDriver = async (credentials) => {
    try {
      const response = await API.post('/drivers/login', credentials);
      const token = response.data.data; // The token is in `data` field
      localStorage.setItem('driverToken', token);
      setDriverToken(token);
      await fetchDriverProfile(token); // Fetch profile immediately after login
      alert(response.data.message);
      navigate('/driver/dashboard'); // Redirect after successful login
      return { success: true };
    } catch (error) {
      console.error('Driver login failed:', error.response?.data || error.message);
      alert(error.response?.data?.message || 'Login failed');
      return { success: false, error: error.response?.data?.message || error.message };
    }
  };

  // Client-side logout for Driver (clears local state/storage)
  const logoutDriverClientSide = () => {
    localStorage.removeItem('driverToken');
    setDriverToken(null);
    setCurrentDriver(null);
  };

  // Full logout for Driver (calls backend, then client-side clear)
  const logoutDriver = async () => {
    try {
      // Call your backend logout endpoint for drivers
      await API.post('/drivers/logout', {}, {
        headers: { Authorization: `Bearer ${driverToken}` },
      });
      console.log('Driver backend logout successful');
    } catch (error) {
      console.error('Error during driver backend logout:', error.response?.data || error.message);
      // Optionally alert user about backend logout failure but proceed with client-side logout
      alert(error.response?.data?.message || 'Logout failed on server, clearing local data.');
    } finally {
      logoutDriverClientSide(); // Always clear client-side data
      navigate('/'); // Redirect after logout
    }
  };

  const updateDriverStatus = async (available) => {
    if (!driverToken) {
      console.error("No driver token available for status update.");
      return { success: false, message: "Authentication required." };
    }
    try {
      const response = await API.put(`/drivers/status?available=${available}`, {}, {
        headers: { Authorization: `Bearer ${driverToken}` },
      });
      // Update the currentDriver state to reflect the new availability
      setCurrentDriver(prev => ({ ...prev, available: available }));
      return { success: true, message: response.data.message };
    } catch (error) {
      console.error('Failed to update driver status:', error.response?.data || error.message);
      alert(error.response?.data?.message || 'Failed to update status');
      return { success: false, message: error.response?.data?.message || error.message };
    }
  };

  // Unified logout function for Navbar
  const logout = () => {
    if (userToken && currentUser) { // If a user is logged in
      logoutUser();
    } else if (driverToken && currentDriver) { // If a driver is logged in
      logoutDriver();
    } else {
      // Fallback for cases where tokens are present but profile is not loaded yet
      // or if somehow neither user nor driver is truly logged in but a button was clicked
      logoutUserClientSide(); // Clear any potential user token
      logoutDriverClientSide(); // Clear any potential driver token
      navigate('/');
    }
  };

  const value = {
    userToken,
    driverToken,
    currentUser, // User profile object (if user logged in)
    currentDriver, // Driver profile object (if driver logged in)
    loading,
    registerUser,
    loginUser,
    logoutUser: logoutUserClientSide, // Expose client-side only if needed elsewhere
    registerDriver,
    loginDriver,
    logoutDriver: logoutDriverClientSide, // Expose client-side only if needed elsewhere
    fetchUserProfile,
    fetchDriverProfile,
    updateDriverStatus,
    logout // The unified logout function for UI components
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
        <p className="ml-4 text-gray-700">Loading...</p>
      </div>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};