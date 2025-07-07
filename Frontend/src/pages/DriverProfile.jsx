// DriverProfile.jsx
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { User, Phone, Car, ClipboardList, Home, Tally4 } from 'lucide-react'; // Added Tally4 for available status
import Navbar from '../components/Navbar';
import { useAuth } from '../contexts/AuthContext'; // Import useAuth hook

const DriverProfile = () => {
  const { currentDriver, driverToken, fetchDriverProfile, loading } = useAuth(); // Get currentDriver and auth functions

  useEffect(() => {
    // If we have a token but currentDriver data isn't loaded yet, fetch it.
    if (driverToken && !currentDriver) {
      fetchDriverProfile(driverToken);
    }
  }, [driverToken, currentDriver, fetchDriverProfile]);

  if (loading || !currentDriver) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
        <div className="animate-spin rounded-full h-20 w-20 border-t-2 border-b-2 border-green-500"></div>
        <p className="ml-4 text-lg text-gray-700">Loading driver profile...</p>
      </div>
    );
  }

  // Hardcoded profile picture for driver
  const profilePicture = 'https://placehold.co/150x150/90EE90/000000?text=JD';

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl p-8 border border-white/20">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Your Driver Profile</h2>
            <p className="text-gray-600">Details associated with your CabGo driver account.</p>
          </div>

          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            {/* Left Section: Profile Image/Avatar */}
            <div className="flex-shrink-0">
              {profilePicture ? (
                <img
                  src={profilePicture}
                  alt="Driver Profile"
                  className="w-32 h-32 rounded-full object-cover border-4 border-green-500 shadow-lg"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://placehold.co/150x150/90EE90/000000?text=Driver';
                  }}
                />
              ) : (
                <div className="w-32 h-32 bg-green-100 rounded-full flex items-center justify-center border-4 border-green-500 shadow-lg">
                  <User className="h-20 w-20 text-green-600" />
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
                  <p className="text-lg font-semibold text-gray-900">{currentDriver.name}</p>
                </div>
              </div>

              {/* Phone Number */}
              <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg shadow-sm">
                <Phone className="h-6 w-6 text-gray-600" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Phone Number</p>
                  <p className="text-lg font-semibold text-gray-900">{currentDriver.phone}</p>
                </div>
              </div>

              {/* License Number */}
              <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg shadow-sm">
                <ClipboardList className="h-6 w-6 text-gray-600" />
                <div>
                  <p className="text-sm font-medium text-gray-500">License Number</p>
                  <p className="text-lg font-semibold text-gray-900">{currentDriver.licenseNumber}</p>
                </div>
              </div>

              {/* Vehicle Details */}
              <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg shadow-sm">
                <Car className="h-6 w-6 text-gray-600" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Vehicle Details</p>
                  <p className="text-lg font-semibold text-gray-900">{currentDriver.vehicleDetails}</p>
                </div>
              </div>

              {/* Availability Status */}
              <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg shadow-sm">
                <Tally4 className="h-6 w-6 text-gray-600" /> {/* Using Tally4 for a generic status icon */}
                <div>
                  <p className="text-sm font-medium text-gray-500">Current Status</p>
                  <p className={`text-lg font-semibold ${currentDriver.available ? 'text-green-600' : 'text-red-600'}`}>
                    {currentDriver.available ? 'Available' : 'Offline'}
                  </p>
                </div>
              </div>

            </div>
          </div>

          <div className="mt-8 text-center">
            <Link
              to="/driver/dashboard"
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

export default DriverProfile;