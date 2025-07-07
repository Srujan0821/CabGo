import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Car, User, LogOut, Menu } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  // Use current user/driver to determine who is logged in and their name
  const { currentUser, currentDriver, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear(); // Clear all local storage before logging out
    logout(); // This now calls the unified logout function from AuthContext
    alert('You have been logged out successfully.');
    // The navigate('/') is handled within the logout function in AuthContext.
    // If you prefer Navbar to control navigation, remove it from AuthContext's logout functions.
  };

  // Determine who is logged in
  const loggedInUser = currentUser || currentDriver; // Will be either user or driver, or null

  return (
    <nav className="bg-white/80 backdrop-blur-md shadow-lg border-b border-white/20 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <Car className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              CabGo
            </span>
          </Link>

          <div className="hidden md:flex items-center space-x-6">
            {loggedInUser ? ( // Check if any user (user or driver) is logged in
              <>
                <Link
                  to={loggedInUser.type === 'user' ? '/user/dashboard' : '/driver/dashboard'}
                  className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 transition-colors"
                >
                  <User className="h-4 w-4" />
                  {/* Display name based on who is logged in */}
                  <span>{loggedInUser.name}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 text-gray-700 hover:text-red-600 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/user/auth"
                  className="text-gray-700 hover:text-blue-600 transition-colors"
                >
                  User Login
                </Link>
                <Link
                  to="/driver/auth"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105"
                >
                  Driver Portal
                </Link>
              </>
            )}
          </div>

          <div className="md:hidden">
            <Menu className="h-6 w-6 text-gray-700" />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;