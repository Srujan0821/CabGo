import React, { useState } from 'react';
import { MapPin, Calendar, Star, Filter, Search, Download } from 'lucide-react';
import Navbar from '../components/Navbar';

const RideHistory = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const rides = [
    {
      id: '1',
      from: 'Downtown Mall',
      to: 'Airport Terminal 1',
      date: '2024-01-15',
      time: '10:30 AM',
      fare: 45.50,
      status: 'completed',
      rating: 5,
      driver: 'Mike Johnson',
      vehicle: 'Toyota Camry - ABC123',
      duration: '35 min'
    },
    {
      id: '2',
      from: 'Home',
      to: 'Office Building',
      date: '2024-01-14',
      time: '8:15 AM',
      fare: 18.25,
      status: 'completed',
      rating: 4,
      driver: 'Sarah Wilson',
      vehicle: 'Honda Civic - XYZ789',
      duration: '22 min'
    },
    {
      id: '3',
      from: 'Restaurant Plaza',
      to: 'Hotel Grand',
      date: '2024-01-12',
      time: '7:45 PM',
      fare: 32.75,
      status: 'completed',
      rating: 5,
      driver: 'David Chen',
      vehicle: 'Nissan Altima - DEF456',
      duration: '28 min'
    },
    {
      id: '4',
      from: 'Conference Center',
      to: 'Central Station',
      date: '2024-01-10',
      time: '3:20 PM',
      fare: 25.50,
      status: 'cancelled',
      rating: null,
      driver: 'Lisa Brown',
      vehicle: 'Hyundai Elantra - GHI789',
      duration: null
    },
    {
      id: '5',
      from: 'Shopping Mall',
      to: 'University Campus',
      date: '2024-01-08',
      time: '2:15 PM',
      fare: 15.75,
      status: 'completed',
      rating: 5,
      driver: 'James Rodriguez',
      vehicle: 'Volkswagen Jetta - JKL012',
      duration: '18 min'
    }
  ];

  const filteredRides = rides.filter(ride => {
    const matchesSearch = ride.from.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ride.to.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ride.driver.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || ride.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Ride History</h1>
          <p className="text-gray-600">View and manage your past trips</p>
        </div>

        {/* Filters and Search */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200 p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Search rides by location or driver..."
                />
              </div>
            </div>
            
            <div className="flex gap-4">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Rides</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
              
              <button className="flex items-center px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                <Download className="h-5 w-5 mr-2" />
                Export
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-2xl border border-blue-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Rides</h3>
            <p className="text-3xl font-bold text-blue-600">{rides.length}</p>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-2xl border border-green-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Spent</h3>
            <p className="text-3xl font-bold text-green-600">${rides.reduce((sum, ride) => sum + ride.fare, 0).toFixed(2)}</p>
          </div>
          <div className="bg-gradient-to-br from-yellow-50 to-orange-50 p-6 rounded-2xl border border-yellow-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Avg Rating</h3>
            <p className="text-3xl font-bold text-yellow-600">4.8</p>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-2xl border border-purple-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">This Month</h3>
            <p className="text-3xl font-bold text-purple-600">5</p>
          </div>
        </div>

        {/* Rides List */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              {filteredRides.length} {filteredRides.length === 1 ? 'Ride' : 'Rides'} Found
            </h2>
          </div>

          <div className="divide-y divide-gray-200">
            {filteredRides.map(ride => (
              <div key={ride.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                      <MapPin className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">
                        {ride.from} → {ride.to}
                      </p>
                      <p className="text-sm text-gray-600 flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {new Date(ride.date).toLocaleDateString()} at {ride.time}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-gray-900">${ride.fare}</p>
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(ride.status)}`}>
                      {ride.status}
                    </span>
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4 text-sm text-gray-600">
                  <div>
                    <span className="font-medium">Driver:</span> {ride.driver}
                  </div>
                  <div>
                    <span className="font-medium">Vehicle:</span> {ride.vehicle}
                  </div>
                  <div className="flex items-center justify-between">
                    {ride.duration && (
                      <>
                        <span><span className="font-medium">Duration:</span> {ride.duration}</span>
                      </>
                    )}
                    {ride.rating && (
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                        <span>{ride.rating}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredRides.length === 0 && (
            <div className="text-center py-12">
              <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No rides found matching your criteria</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RideHistory;