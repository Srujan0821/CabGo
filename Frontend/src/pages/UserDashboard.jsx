// UserDashboard.jsx
import React from 'react';
import { DollarSign, Car, Clock, Star, MapPin } from 'lucide-react';
import Navbar from '../components/Navbar';
import { useAuth } from '../contexts/AuthContext'; // Import useAuth
import { Link } from 'react-router-dom';

const UserDashboard = () => {
  const { currentUser, loading } = useAuth(); // Get currentUser and loading state

  // Hardcoded data for elements not covered by provided API endpoints
  const todayStats = {
    rides: 3,
    distance: 25.4, // in miles/km
    carbonSaved: 1.2, // in kg
    pointsEarned: 150
  };

  const upcomingRides = [
    {
      id: 'up1',
      from: 'Home',
      to: 'Office Downtown',
      time: '08:30 AM',
      driver: 'John Doe',
      status: 'confirmed'
    },
    {
      id: 'up2',
      from: 'Shopping Mall',
      to: 'Central Park',
      time: '04:00 PM',
      driver: 'Jane Smith',
      status: 'pending'
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="animate-spin rounded-full h-20 w-20 border-t-2 border-b-2 border-blue-500"></div>
        <p className="ml-4 text-lg text-gray-700">Loading user dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Header */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200 p-6 mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Good day, {currentUser?.name || 'User'}!
            </h1>
            <p className="text-gray-600">Welcome to your CabGo dashboard.</p>
          </div>
          <Link
            to="/user/profile"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 transition-colors"
          >
            View Profile
          </Link>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Link to="/book-ride" className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200 p-6 text-center hover:shadow-xl transition-all transform hover:-translate-y-1">
            <Car className="h-12 w-12 text-blue-600 mx-auto mb-3" />
            <h3 className="text-xl font-semibold text-gray-900">Book a New Ride</h3>
            <p className="text-gray-600 text-sm">Find a ride instantly.</p>
          </Link>

          <Link to="/ride-history" className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200 p-6 text-center hover:shadow-xl transition-all transform hover:-translate-y-1">
            <Clock className="h-12 w-12 text-purple-600 mx-auto mb-3" />
            <h3 className="text-xl font-semibold text-gray-900">Ride History</h3>
            <p className="text-gray-600 text-sm">Review your past trips.</p>
          </Link>

          <Link to="/support" className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200 p-6 text-center hover:shadow-xl transition-all transform hover:-translate-y-1">
            <Star className="h-12 w-12 text-yellow-600 mx-auto mb-3" />
            <h3 className="text-xl font-semibold text-gray-900">Help & Support</h3>
            <p className="text-gray-600 text-sm">Get assistance when you need it.</p>
          </Link>
        </div>

        {/* Today's Usage Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-2xl border border-blue-100 flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mb-3">
              <Car className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">Rides Today</h3>
            <p className="text-3xl font-bold text-blue-600">{todayStats.rides}</p>
            <p className="text-blue-600 text-sm mt-1">Trips completed</p>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-2xl border border-purple-100 flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mb-3">
              <MapPin className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">Distance Travelled</h3>
            <p className="text-3xl font-bold text-purple-600">{todayStats.distance} km</p>
            <p className="text-purple-600 text-sm mt-1">Today's total</p>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-2xl border border-green-100 flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mb-3">
              <DollarSign className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">Carbon Offset</h3>
            <p className="text-3xl font-bold text-green-600">{todayStats.carbonSaved} kg</p>
            <p className="text-green-600 text-sm mt-1">Saved today</p>
          </div>

          <div className="bg-gradient-to-br from-yellow-50 to-orange-50 p-6 rounded-2xl border border-yellow-100 flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center mb-3">
              <Star className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">Reward Points</h3>
            <p className="text-3xl font-bold text-yellow-600">{todayStats.pointsEarned}</p>
            <p className="text-yellow-600 text-sm mt-1">Accumulated</p>
          </div>
        </div>

        {/* Upcoming Rides */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Upcoming Rides</h2>
            <Link to="/ride-history" className="text-blue-600 hover:text-blue-800 font-medium transition-colors">
              View All
            </Link>
          </div>

          <div className="space-y-4">
            {upcomingRides.length > 0 ? (
              upcomingRides.map(ride => (
                <div key={ride.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                      <MapPin className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{ride.from} → {ride.to}</p>
                      <p className="text-sm text-gray-600">Driver: {ride.driver}</p>
                      <p className="text-xs text-gray-500 mt-1">{ride.time}</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    ride.status === 'confirmed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {ride.status}
                  </span>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-600">No upcoming rides scheduled.</p>
                <Link to="/book-ride" className="mt-4 inline-block text-blue-600 hover:text-blue-800 font-medium">
                  Book your first ride!
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;