// RideHistory.jsx
import React, { useState, useEffect } from 'react';
import { MapPin, Calendar, Star, Search, Home } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useAuth } from '../contexts/AuthContext'; // Import useAuth hook
import API from '../api/axios'; // Import axios instance

const RideHistory = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [rides, setRides] = useState([]); // State to store fetched rides
  const [loadingRides, setLoadingRides] = useState(true);
  const [totalSpend, setTotalSpend] = useState(0); // State for total spend
  const { userToken } = useAuth(); // Get userToken

  // Function to fetch rides and then driver details from the API
  useEffect(() => {
    const fetchRidesAndDriverDetails = async () => {
      if (!userToken) {
        setLoadingRides(false);
        setRides([]);
        setTotalSpend(0);
        return;
      }
      setLoadingRides(true);
      try {
        // 1. Fetch user rides
        const ridesResponse = await API.get('/rides/user/rides', {
          headers: { Authorization: `Bearer ${userToken}` },
        });

        // 2. Process rides and fetch driver names and vehicle details
        const fetchedRides = ridesResponse.data;
        const ridesWithDriverDetails = await Promise.all(
          fetchedRides.map(async (ride) => {
            let driverName = 'Unknown Driver';
            let vehicleDetails = 'Unknown Vehicle';

            if (ride.driverId) {
              try {
                // Fetch driver data - this endpoint is unprotected as per your info
                const driverDataResponse = await API.get(`/drivers/data/${ride.driverId}`);
                driverName = driverDataResponse.data.name || 'Unknown Driver';
                vehicleDetails = driverDataResponse.data.vehicleDetails || 'Unknown Vehicle'; // Extract vehicleDetails
              } catch (driverError) {
                console.warn(`Could not fetch driver data for ID ${ride.driverId}:`, driverError.response?.data || driverError.message);
                // Fallback to "Unknown Driver" and "Unknown Vehicle" if fetching fails
              }
            }

            return {
              id: ride.rideId.toString(),
              from: ride.pickupLocation,
              to: ride.dropoffLocation,
              // Use actual date/time if provided by API, otherwise adjust backend or use placeholders
              date: ride.rideDate ? new Date(ride.rideDate).toLocaleDateString() : 'N/A Date',
              time: ride.rideDate ? new Date(ride.rideDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'N/A Time',
              fare: ride.fare,
              status: ride.status.toLowerCase(),
              rating: ride.rating || 'N/A', // Use actual rating if available
              driver: driverName, // Use the fetched driver name
              vehicle: vehicleDetails, // Use the fetched vehicle details
              duration: ride.duration || 'N/A' // Use actual duration if available
            };
          })
        );

        setRides(ridesWithDriverDetails);

        // Calculate total spend from fetched and formatted rides
        const calculatedTotalSpend = ridesWithDriverDetails.reduce((sum, ride) => {
          if (ride.status === 'completed' && typeof ride.fare === 'number') {
            return sum + ride.fare;
          }
          return sum;
        }, 0);
        setTotalSpend(calculatedTotalSpend);

      } catch (error) {
        console.error('Failed to fetch ride history:', error.response?.data || error.message);
        setRides([]); // Clear rides on error
        setTotalSpend(0); // Reset total spend on error
      } finally {
        setLoadingRides(false);
      }
    };

    fetchRidesAndDriverDetails();
  }, [userToken]); // Re-fetch when userToken changes

  const filteredRides = rides.filter(ride => {
    const matchesSearch = ride.from.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          ride.to.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          ride.driver.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          ride.vehicle.toLowerCase().includes(searchTerm.toLowerCase()); // Added vehicle to search
    const matchesFilter = filterStatus === 'all' || ride.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'in_progress':
      case 'in-progress':
      case 'pending':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loadingRides) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="animate-spin rounded-full h-20 w-20 border-t-2 border-b-2 border-blue-500"></div>
        <p className="ml-4 text-lg text-gray-700">Loading ride history...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className='bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 min-h-screen'>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Ride History</h1>
              <p className="text-gray-600">View and manage your past trips</p>
            </div>
            <Link
              to="/user/dashboard"
              className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium transition-colors space-x-2 p-3 rounded-lg bg-blue-50 hover:bg-blue-100 shadow-sm"
            >
              <Home className="h-5 w-5" />
              <span>Back to Dashboard</span>
            </Link>
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
                    placeholder="Search rides by location, driver, or vehicle..." // Updated placeholder
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
                  <option value="in-progress">In-Progress</option>
                </select>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <div className="bg-gradient-to-br from-blue-200 to-emerald-100 p-6 rounded-2xl border border-green-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Rides</h3>
              <p className="text-3xl font-bold text-blue-600">{rides.length}</p>
            </div>
            <div className="bg-gradient-to-br from-yellow-50 to-orange-50 p-6 rounded-2xl border border-yellow-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Spend</h3>
                <p className="text-3xl font-bold text-yellow-600">₹{totalSpend.toFixed(2)}</p>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-2xl border border-purple-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Average Rating</h3>
                <p className="text-3xl font-bold text-purple-600">
                    {rides.filter(r => typeof r.rating === 'number' && r.status === 'completed').length > 0
                        ? (rides.filter(r => typeof r.rating === 'number' && r.status === 'completed').reduce((sum, r) => sum + r.rating, 0) / rides.filter(r => typeof r.rating === 'number' && r.status === 'completed').length).toFixed(1)
                        : 'N/A'}
                </p>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-2xl border border-green-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Completed Rides</h3>
                <p className="text-3xl font-bold text-green-600">
                  {rides.filter(ride => ride.status === 'completed').length}
                </p>
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
              {filteredRides.length > 0 ? (
                filteredRides.map(ride => (
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
                            {ride.date} at {ride.time}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-gray-900">₹{ride.fare.toFixed(2)}</p>
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(ride.status)}`}>
                          {ride.status.toUpperCase()}
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
                      {ride.duration && ride.duration !== 'N/A' && (
                        <div>
                          <span className="font-medium">Duration:</span> {ride.duration}
                        </div>
                      )}
                      {ride.rating && ride.rating !== 'N/A' && (
                        <div className="flex items-center">
                          <span className="font-medium mr-1">Rating:</span>
                          <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" /> {ride.rating}
                        </div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12">
                  <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No rides found matching your criteria.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RideHistory;