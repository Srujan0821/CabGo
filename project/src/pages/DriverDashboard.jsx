import React, { useState, useEffect } from 'react';
import { Car, DollarSign, Clock, Star, ToggleLeft, ToggleRight, MapPin } from 'lucide-react';
import Navbar from '../components/Navbar';
import { useAuth } from '../contexts/AuthContext';

const DriverDashboard = () => {
  const { currentUser } = useAuth();
  const [isAvailable, setIsAvailable] = useState(currentUser?.available || false);


  useEffect(() => {
    if (currentUser) {
      setIsAvailable(currentUser.available);
    }
  }, [currentUser]);

  const handleStatusChange = async () => {
    const success = await updateDriverStatus(!isAvailable);
    if (success) {
      setIsAvailable(!isAvailable);
    } else {
      alert('Failed to update status. Please try again.');
    }
  };

  // Mock data for today's stats and recent rides
  const todayStats = {
    earnings: 145.75,
    rides: 8,
    hours: 6.5,
    rating: 4.9
  };

  const recentRides = [
    {
      id: '1',
      passenger: 'John Smith',
      from: 'Downtown Mall',
      to: 'Airport Terminal 1',
      fare: 45.50,
      time: '10:30 AM',
      rating: 5
    },
    {
      id: '2',
      passenger: 'Emily Davis',
      from: 'Central Station',
      to: 'Business District',
      fare: 28.25,
      time: '9:15 AM',
      rating: 5
    },
    {
      id: '3',
      passenger: 'Mike Wilson',
      from: 'Hotel Plaza',
      to: 'Conference Center',
      fare: 18.75,
      time: '8:45 AM',
      rating: 4
    }
  ];

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Driver Status Header */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200 p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Good morning, {currentUser?.name}!
              </h1>
              <p className="text-gray-600">Ready to start earning?</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-gray-600">Status</p>
                <p className={`font-semibold ${isAvailable ? 'text-green-600' : 'text-red-600'}`}>
                  {isAvailable ? 'Available' : 'Offline'}
                </p>
              </div>
              <button
                onClick={handleStatusChange}
                className="transition-all duration-200 transform hover:scale-105"
              >
                {isAvailable ? (
                  <ToggleRight className="h-12 w-12 text-green-500" />
                ) : (
                  <ToggleLeft className="h-12 w-12 text-gray-400" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Today's Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-2xl border border-green-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Today's Earnings</h3>
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-white" />
              </div>
            </div>
            <p className="text-3xl font-bold text-green-600 mb-2">${todayStats.earnings}</p>
            <p className="text-green-600 text-sm">+12% from yesterday</p>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-2xl border border-blue-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Rides Completed</h3>
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                <Car className="h-6 w-6 text-white" />
              </div>
            </div>
            <p className="text-3xl font-bold text-blue-600 mb-2">{todayStats.rides}</p>
            <p className="text-blue-600 text-sm">2 rides in progress</p>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-2xl border border-purple-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Hours Online</h3>
              <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center">
                <Clock className="h-6 w-6 text-white" />
              </div>
            </div>
            <p className="text-3xl font-bold text-purple-600 mb-2">{todayStats.hours}h</p>
            <p className="text-purple-600 text-sm">Target: 8h</p>
          </div>

          <div className="bg-gradient-to-br from-yellow-50 to-orange-50 p-6 rounded-2xl border border-yellow-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Rating</h3>
              <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center">
                <Star className="h-6 w-6 text-white" />
              </div>
            </div>
            <p className="text-3xl font-bold text-yellow-600 mb-2">{todayStats.rating}</p>
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
              ))}
            </div>
          </div>
        </div>

        {/* Weekly Earnings Chart Placeholder */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200 p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Weekly Earnings</h2>
          <div className="h-64 bg-gradient-to-r from-blue-100 to-purple-100 rounded-xl flex items-center justify-center">
            <p className="text-gray-600">Earnings chart would be displayed here</p>
          </div>
        </div>

        {/* Recent Rides */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Recent Rides</h2>
            <button className="text-blue-600 hover:text-blue-800 font-medium transition-colors">
              View All
            </button>
          </div>

          <div className="space-y-4">
            {recentRides.map(ride => (
              <div key={ride.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                    <MapPin className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{ride.passenger}</p>
                    <p className="text-sm text-gray-600">{ride.from} → {ride.to}</p>
                    <p className="text-xs text-gray-500 mt-1">{ride.time}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">${ride.fare}</p>
                  <div className="flex items-center mt-1">
                    <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                    <span className="text-sm text-gray-600">{ride.rating}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DriverDashboard;