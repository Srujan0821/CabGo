import React, { useState, useEffect, useCallback } from 'react';
import { Car, DollarSign, Clock, Star, ToggleLeft, ToggleRight, MapPin, BellRing, CheckCircle, XCircle, Play, FastForward, User, Route } from 'lucide-react'; // Added User and Route icons
import Navbar from '../components/Navbar';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import API from '../api/axios';

const DriverDashboard = () => {
  const { currentDriver, loading, updateDriverStatus, driverToken } = useAuth();
  const [isAvailable, setIsAvailable] = useState(currentDriver?.available || false);
  const [incomingRideRequests, setIncomingRideRequests] = useState([]);
  const [activeRide, setActiveRide] = useState(null);
  const [activeRidePassengerName, setActiveRidePassengerName] = useState('Passenger');
  const [driverRatings, setDriverRatings] = useState([]);
  const [loadingRequests, setLoadingRequests] = useState(true);
  const [loadingRatings, setLoadingRatings] = useState(true);

  // Update local availability state if currentDriver.available changes externally
  useEffect(() => {
    if (currentDriver) {
      setIsAvailable(currentDriver.available);
    }
  }, [currentDriver]);

  // Handle availability toggle
  const handleToggleAvailability = async () => {
    const newAvailability = !isAvailable;
    const result = await updateDriverStatus(newAvailability);
    if (result.success) {
      setIsAvailable(newAvailability);
      alert(result.message);
    } else {
      alert(result.message);
    }
  };

  // Function to fetch user's name (passenger)
  const fetchPassengerName = useCallback(async (userId) => {
    if (!userId) return 'Passenger';
    try {
      // ASSUMPTION: Endpoint to get user data by ID exists and is accessible
      const response = await API.get(`/users/data/${userId}`, {
        headers: { Authorization: `Bearer ${driverToken}` },
      });
      return response.data.name || 'Passenger';
    } catch (error) {
      console.warn(`Failed to fetch passenger name for user ID ${userId}:`, error.response?.data || error.message);
      return 'Passenger';
    }
  }, [driverToken]);

  // --- Fetch incoming ride requests and active ride ---
  const fetchIncomingRequests = useCallback(async () => {
    if (!driverToken || !currentDriver?.driverId) {
      setLoadingRequests(false);
      return;
    }
    setLoadingRequests(true);
    try {
      const response = await API.get(`/rides/driver/${currentDriver.driverId}/pending-requests`, {
        headers: { Authorization: `Bearer ${driverToken}` },
      });

      let foundActiveRide = null;
      const requestedRides = [];

      for (const ride of response.data) {
        if (ride.status === 'ASSIGNED' || ride.status === 'ONGOING' || ride.status === 'IN_PROGRESS') {
          if (!foundActiveRide) {
            foundActiveRide = ride;
            // Fetch passenger name for the active ride
            if (ride.userId) {
              const pName = await fetchPassengerName(ride.userId);
              setActiveRidePassengerName(pName);
            } else {
              setActiveRidePassengerName('Passenger');
            }
          }
        } else if (ride.status === 'REQUESTED') {
          requestedRides.push(ride);
        }
      }

      setActiveRide(foundActiveRide);
      setIncomingRideRequests(requestedRides);

    } catch (error) {
      console.error('Failed to fetch ride requests/active ride:', error.response?.data || error.message);
      setActiveRide(null);
      setActiveRidePassengerName('Passenger');
      setIncomingRideRequests([]);
    } finally {
      setLoadingRequests(false);
    }
  }, [driverToken, currentDriver, fetchPassengerName]);

  // Effect hook to call fetchIncomingRequests initially and set up polling
  useEffect(() => {
    const interval = setInterval(fetchIncomingRequests, 5000); // Poll every 5 seconds
    fetchIncomingRequests(); // Initial fetch
    return () => clearInterval(interval); // Cleanup on unmount
  }, [fetchIncomingRequests]);

  // Fetch driver ratings
  useEffect(() => {
    const fetchDriverRatings = async () => {
      if (!driverToken) {
        setLoadingRatings(false);
        return;
      }
      setLoadingRatings(true);
      try {
        const response = await API.get('/ratings/driver/ratings', {
          headers: { Authorization: `Bearer ${driverToken}` },
        });
        setDriverRatings(response.data);
      } catch (error) {
        console.error('Failed to fetch driver ratings:', error.response?.data || error.message);
        setDriverRatings([]);
      } finally {
        setLoadingRatings(false);
      }
    };

    fetchDriverRatings();
  }, [driverToken]);

  // Handle updating ride status (Accept, Complete, Cancel, Start)
  const handleUpdateRideStatus = async (rideId, status) => {
    if (!driverToken || !currentDriver?.driverId) {
      alert('Authentication required to update ride status.');
      return;
    }
    try {
      const response = await API.put(`/rides/status?status=${status}`, {}, {
        headers: { Authorization: `Bearer ${driverToken}` },
      });
      alert(response.data.message);
      fetchIncomingRequests(); // Re-fetch all requests to update UI correctly
    } catch (error) {
      console.error(`Failed to update ride status to ${status}:`, error.response?.data || error.message);
      alert(error.response?.data?.message || `Failed to update status to ${status}`);
    }
  };

  // Hardcoded stats and recent rides (as no API endpoints provided for them)
  const todayStats = {
    earnings: 145.75,
    rides: 8,
    hours: 6.5,
    rating: 4.9
  };

  const recentRides = [
    { id: '1', passenger: 'John Smith', from: 'Downtown Mall', to: 'Airport Terminal 1', fare: 45.50, time: '10:30 AM', rating: 5 },
    { id: '2', passenger: 'Emily Davis', from: 'Central Station', to: 'Business District', fare: 28.25, time: '9:15 AM', rating: 5 },
    { id: '3', passenger: 'Mike Wilson', from: 'Hotel Plaza', to: 'Conference Center', fare: 18.75, time: '8:45 AM', rating: 4 }
  ];

  if (loading || !currentDriver) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
        <div className="animate-spin rounded-full h-20 w-20 border-t-2 border-b-2 border-green-500"></div>
        <p className="ml-4 text-lg text-gray-700">Loading driver dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Driver Status Header */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200 p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Good morning, {currentDriver?.name}!
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
                onClick={handleToggleAvailability}
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
          <div className="mt-4 text-right">
            <Link
              to="/driver/profile"
              className="text-blue-600 hover:text-blue-800 font-medium transition-colors inline-flex items-center space-x-1"
            >
              <Car className="h-5 w-5" />
              <span>View Driver Profile</span>
            </Link>
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
            <p className="text-3xl font-bold text-green-600 mb-2">₹{todayStats.earnings}</p>
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

        {/* Current Active Ride */}
        {activeRide && (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200 p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <Car className="h-7 w-7 text-green-600 mr-2" /> Current Active Ride
            </h2>
            <div className="p-4 bg-gradient-to-br from-green-50 to-blue-50 rounded-xl border border-blue-200 flex flex-col md:flex-row items-start md:items-center justify-between space-y-4 md:space-y-0 md:space-x-4">
              <div className="flex-grow">
                <p className="font-semibold text-gray-900">Ride ID: #{activeRide.rideId}</p>
                <p className="text-sm text-gray-700 mt-1">
                  <MapPin className="inline h-4 w-4 mr-1 text-gray-500" />
                  {activeRide.pickupLocation}
                  <span className="mx-2">→</span>
                  <MapPin className="inline h-4 w-4 mr-1 text-gray-500" />
                  {activeRide.dropoffLocation}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Fare: <span className="font-bold text-green-600">₹{activeRide.fare.toFixed(2)}</span>
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Status: <span className="font-semibold text-purple-700">{activeRide.status}</span>
                </p>
                <p className="text-sm text-gray-500 mt-1 flex items-center">
                  <User className="h-4 w-4 mr-1" /> Passenger: <span className="font-semibold ml-1">{activeRidePassengerName}</span>
                </p>
              </div>
              <div className="flex space-x-2 flex-wrap justify-end">
                {activeRide.status === 'ASSIGNED' && (
                  <>
                    <button
                      onClick={() => handleUpdateRideStatus(activeRide.rideId, 'ONGOING')}
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center whitespace-nowrap"
                    >
                      <Play className="h-4 w-4 mr-1" /> Start Ride
                    </button>
                    <button
                      onClick={() => handleUpdateRideStatus(activeRide.rideId, 'CANCELLED')}
                      className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center whitespace-nowrap"
                    >
                      <XCircle className="h-4 w-4 mr-1" /> Cancel Ride
                    </button>
                  </>
                )}
                {(activeRide.status === 'ONGOING' || activeRide.status === 'IN_PROGRESS') && (
                  <>
                    {/* The primary button for completing an ONGOING ride */}
                    <button
                      onClick={() => handleUpdateRideStatus(activeRide.rideId, 'COMPLETED')}
                      className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center whitespace-nowrap"
                    >
                      <FastForward className="h-4 w-4 mr-1" /> Finish Ride
                    </button>
                    <button
                      onClick={() => handleUpdateRideStatus(activeRide.rideId, 'CANCELLED')}
                      className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center whitespace-nowrap"
                    >
                      <XCircle className="h-4 w-4 mr-1" /> Cancel Ride
                    </button>
                  </>
                )}
              </div>
            </div>
            {/* Visual animation for active ride */}
            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200 text-center">
                {activeRide.status === 'ASSIGNED' && (
                    <div className="flex items-center justify-center space-x-4">
                        <Car className="h-8 w-8 text-blue-600 animate-pulse" />
                        <span className="text-lg font-semibold text-gray-800">Heading to pickup location...</span>
                        <MapPin className="h-8 w-8 text-green-500" />
                    </div>
                )}
                {(activeRide.status === 'ONGOING' || activeRide.status === 'IN_PROGRESS') && (
                    <div className="flex items-center justify-center space-x-4">
                        <MapPin className="h-8 w-8 text-green-500" />
                        <Route className="h-8 w-8 text-blue-600 animate-ping-slow" /> {/* Custom animation class */}
                        <Car className="h-8 w-8 text-blue-600 animate-bounce-horizontal" /> {/* Custom animation class */}
                        <Route className="h-8 w-8 text-blue-600 animate-ping-slow" />
                        <MapPin className="h-8 w-8 text-red-500" />
                    </div>
                )}
            </div>
          </div>
        )}

        {/* Incoming Ride Requests (only REQUESTED status) */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200 p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Incoming Ride Requests</h2>
            {loadingRequests && (
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
            )}
          </div>
          <div className="space-y-4">
            {incomingRideRequests.length > 0 ? (
              incomingRideRequests.map(request => (
                <div key={request.rideId} className="p-4 bg-blue-50 rounded-xl border border-blue-200 flex flex-col md:flex-row items-start md:items-center justify-between space-y-3 md:space-y-0">
                  <div className="flex items-center space-x-4">
                    <BellRing className="h-8 w-8 text-blue-600 animate-pulse" />
                    <div>
                      <p className="font-semibold text-gray-900">New Ride Request!</p>
                      <p className="text-sm text-gray-700 mt-1">{request.pickupLocation} → {request.dropoffLocation}</p>
                      <p className="text-xs text-gray-500 mt-1">Fare: ₹{request.fare.toFixed(2)}</p>
                    </div>
                  </div>
                  <div className="flex space-x-2 mt-3 md:mt-0">
                    <button
                      onClick={() => handleUpdateRideStatus(request.rideId, 'ASSIGNED')}
                      className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center whitespace-nowrap"
                    >
                      <CheckCircle className="h-4 w-4 mr-1" /> Accept
                    </button>
                    <button
                      onClick={() => handleUpdateRideStatus(request.rideId, 'CANCELLED')}
                      className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center whitespace-nowrap"
                    >
                      <XCircle className="h-4 w-4 mr-1" /> Decline
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-600">
                <p>No new ride requests at the moment.</p>
                <p className="text-sm mt-2">Ensure you are 'Available' to receive requests.</p>
              </div>
            )}
          </div>
        </div>

        {/* Driver Ratings */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200 p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Ratings</h2>
          {loadingRatings ? (
            <div className="flex justify-center items-center h-48">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
              <p className="ml-4 text-gray-700">Loading ratings...</p>
            </div>
          ) : driverRatings.length > 0 ? (
            <div className="space-y-4">
              {driverRatings.map(rating => (
                <div key={rating.ratingId} className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`h-5 w-5 ${i < rating.score ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                      ))}
                      <span className="ml-2 text-lg font-semibold">{rating.score}/5</span>
                    </div>
                    <span className="text-sm text-gray-500">Ride ID: #{rating.rideId}</span>
                  </div>
                  <p className="text-gray-700 italic">"{rating.comments || 'No comment provided.'}"</p>
                  <p className="text-xs text-gray-500 mt-2">From User ID: {rating.fromUserId}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-600">
              <p>No ratings received yet.</p>
            </div>
          )}
        </div>

        {/* Recent Rides (kept hardcoded for now) */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Recent Rides (Hardcoded)</h2>
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
                  <p className="font-semibold text-gray-900">₹{ride.fare}</p>
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