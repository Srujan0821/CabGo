// UserProfile.jsx
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { User, Mail, Phone, Home } from 'lucide-react';
import Navbar from '../components/Navbar';
import { useAuth } from '../contexts/AuthContext'; // Import useAuth hook

const UserProfile = () => {
  const { currentUser, userToken, fetchUserProfile, loading } = useAuth(); // Get currentUser and auth functions

  useEffect(() => {
    // If we have a token but currentUser data isn't loaded yet, fetch it.
    // This handles cases where currentUser might be null on direct page load (though AuthContext tries to pre-fetch).
    if (userToken && !currentUser) {
      fetchUserProfile(userToken);
    }
  }, [userToken, currentUser, fetchUserProfile]);

  if (loading || !currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="animate-spin rounded-full h-20 w-20 border-t-2 border-b-2 border-blue-500"></div>
        <p className="ml-4 text-lg text-gray-700">Loading user profile...</p>
      </div>
    );
  }

  // Hardcoded profile picture as there's no API endpoint for it
  const profilePicture = 'https://placehold.co/150x150/ADD8E6/000000?text=AD'; 

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl p-8 border border-white/20">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Your Profile Information</h2>
            <p className="text-gray-600">Details associated with your CabGo account.</p>
          </div>

          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            {/* Left Section: Profile Image/Avatar */}
            <div className="flex-shrink-0">
              {profilePicture ? (
                <img
                  src={profilePicture}
                  alt="User Profile"
                  className="w-32 h-32 rounded-full object-cover border-4 border-blue-500 shadow-lg"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://placehold.co/150x150/ADD8E6/000000?text=User';
                  }}
                />
              ) : (
                <div className="w-32 h-32 bg-blue-100 rounded-full flex items-center justify-center border-4 border-blue-500 shadow-lg">
                  <User className="h-20 w-20 text-blue-600" />
                </div>
              )}
            </div>

            {/* Right Section: Profile Details */}
            <div className="flex-grow w-full space-y-4 md:space-y-6">
              {/* Name */}
              <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg shadow-sm">
                <User className="h-6 w-6 text-gray-600" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Full Name</p>
                  <p className="text-lg font-semibold text-gray-900">{currentUser.name}</p>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg shadow-sm">
                <Mail className="h-6 w-6 text-gray-600" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Email Address</p>
                  <p className="text-lg font-semibold text-gray-900">{currentUser.email}</p>
                </div>
              </div>

              {/* Phone Number */}
              <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg shadow-sm">
                <Phone className="h-6 w-6 text-gray-600" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Phone Number</p>
                  <p className="text-lg font-semibold text-gray-900">{currentUser.phone}</p>
                </div>
              </div>

            </div>
          </div>

          <div className="mt-8 text-center">
            <Link
              to="/user/dashboard"
              className="text-blue-600 hover:text-blue-800 font-medium transition-colors flex items-center justify-center space-x-2"
            >
              <Home className="h-5 w-5" />
              <span>Back to Dashboard</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;