import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Clock, Star, CreditCard, History, User } from 'lucide-react';
import Navbar from '../components/Navbar';
import { useAuth } from '../contexts/AuthContext';
import { userService } from '../services/userService';

const UserDashboard = () => {
  const { currentUser } = useAuth();
  const [recentRides, setRecentRides] = useState([]);
  const [stats, setStats] = useState({
    totalRides: 0,
    totalSpent: 0,
    averageRating: 0,
    thisMonthRides: 0,
    thisMonthSpent: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        const [rides, userStats] = await Promise.all([
          userService.getRideHistory(),
          userService.getStats()
        ]);

        setRecentRides(rides.slice(0, 3));
        setStats(userStats);
      } catch (err) {
        setError('Failed to load dashboard data');
        console.error('Dashboard data loading error:', err);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-600">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-2 text-red-600 hover:text-red-800 font-medium"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {currentUser?.name}!
          </h1>
          <p className="text-gray-600">Ready for your next journey?</p>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          <Link
            to="/book-ride"
            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-2xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            <MapPin className="h-8 w-8 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Book a Ride</h3>
            <p className="text-blue-100 text-sm">Get a ride in minutes</p>
          </Link>

          <Link
            to="/ride-history"
            className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-gray-200 hover:border-purple-300 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            <History className="h-8 w-8 text-purple-600 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Ride History</h3>
            <p className="text-gray-600 text-sm">View past trips</p>
          </Link>

          <Link
            to="/payment-methods"
            className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-gray-200 hover:border-green-300 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            <CreditCard className="h-8 w-8 text-green-600 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Payment</h3>
            <p className="text-gray-600 text-sm">Manage payment methods</p>
          </Link>

          <Link
            to="/profile"
            className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-gray-200 hover:border-orange-300 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            <User className="h-8 w-8 text-orange-600 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Profile</h3>
            <p className="text-gray-600 text-sm">Update your info</p>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-2xl border border-blue-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Total Rides</h3>
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                <MapPin className="h-6 w-6 text-white" />
              </div>
            </div>
            <p className="text-3xl font-bold text-blue-600 mb-2">{stats.totalRides}</p>
            <p className="text-blue-600 text-sm">+{stats.thisMonthRides} this month</p>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-2xl border border-green-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Total Spent</h3>
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                <CreditCard className="h-6 w-6 text-white" />
              </div>
            </div>
            <p className="text-3xl font-bold text-green-600 mb-2">${stats.totalSpent.toFixed(2)}</p>
            <p className="text-green-600 text-sm">${stats.thisMonthSpent.toFixed(2)} this month</p>
          </div>

          <div className="bg-gradient-to-br from-yellow-50 to-orange-50 p-6 rounded-2xl border border-yellow-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Average Rating</h3>
              <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center">
                <Star className="h-6 w-6 text-white" />
              </div>
            </div>
            <p className="text-3xl font-bold text-yellow-600 mb-2">{stats.averageRating.toFixed(1)}</p>
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  className={`h-4 w-4 ${
                    i < Math.round(stats.averageRating) 
                      ? 'text-yellow-400 fill-current' 
                      : 'text-gray-300'
                  }`} 
                />
              ))}
            </div>
          </div>
        </div>

        {/* Recent Rides */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Recent Rides</h2>
            <Link
              to="/ride-history"
              className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
            >
              View All
            </Link>
          </div>

          {recentRides.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No rides yet. Book your first ride now!
            </div>
          ) : (
            <div className="space-y-4">
              {recentRides.map(ride => (
                <div key={ride.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                      <MapPin className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{ride.from} → {ride.to}</p>
                      <p className="text-sm text-gray-600 flex items-center mt-1">
                        <Clock className="h-4 w-4 mr-1" />
                        {new Date(ride.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">${ride.fare.toFixed(2)}</p>
                    {ride.rating && (
                      <div className="flex items-center mt-1">
                        <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                        <span className="text-sm text-gray-600">{ride.rating}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;