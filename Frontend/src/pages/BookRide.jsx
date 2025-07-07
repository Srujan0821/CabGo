import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Clock, Car, Users, DollarSign, ArrowRight, Home } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useAuth } from '../contexts/AuthContext'; // Import useAuth
import API from '../api/axios'; // Import axios instance

const BookRide = () => {
  const navigate = useNavigate();
  const { userToken, currentUser } = useAuth(); // Get userToken and currentUser
  const [bookingStep, setBookingStep] = useState(1); // 1: Enter locations, 2: Searching/Driver Connected
  const [bookingData, setBookingData] = useState({
    pickup: '',
    dropoff: '',
    fare: 0, // To store fare from backend
    rideId: null, // To store rideId from backend
    driverId: null, // To store driverId from backend
    driverName: 'Searching...', // To store fetched driver name
    driverVehicle: 'Searching...', // To store fetched driver vehicle details
  });
  const [isBooking, setIsBooking] = useState(false);
  const [bookingError, setBookingError] = useState(null);

  // Hardcoded vehicle types for display purposes (fare will come from backend)
  const vehicleTypes = [
    { id: 'standard', name: 'Standard', description: 'Affordable rides for everyday trips', capacity: 4, eta: '3-5 min', icon: Car },
    { id: 'premium', name: 'Premium', description: 'Higher-end vehicles with extra comfort', capacity: 4, eta: '5-8 min', icon: Car },
    { id: 'xl', name: 'XL', description: 'Spacious rides for groups up to 6', capacity: 6, eta: '8-12 min', icon: Users }
  ];

  const handleBookRide = async () => {
    if (!bookingData.pickup || !bookingData.dropoff) {
      alert('Please enter both pickup and drop-off locations.');
      return;
    }
    if (!userToken) {
      alert('You must be logged in to book a ride.');
      navigate('/user/auth'); // Redirect to login if no token
      return;
    }

    setIsBooking(true); // Start booking/searching process
    setBookingError(null);
    setBookingStep(2); // Move to searching step

    try {
      // 1. Send booking request to backend
      const response = await API.post('/rides/book', {
        pickupLocation: bookingData.pickup,
        dropoffLocation: bookingData.dropoff,
        // No vehicleType sent here as per new flow
      }, {
        headers: { Authorization: `Bearer ${userToken}` },
      });

      const rideResponse = response.data; // The ride object from your API
      const newRideId = rideResponse.rideId;
      const newDriverId = rideResponse.driverId;
      const newFare = rideResponse.fare;

      // Update bookingData with actual ride details
      setBookingData(prev => ({
        ...prev,
        rideId: newRideId,
        driverId: newDriverId,
        fare: newFare,
      }));

      // Simulate driver search delay
      await new Promise(resolve => setTimeout(resolve, 3000)); // 3 seconds delay

      // 2. Fetch driver details using the driverId from the booking response
      if (newDriverId) {
        try {
          const driverResponse = await API.get(`/drivers/data/${newDriverId}`);
          setBookingData(prev => ({
            ...prev,
            driverName: driverResponse.data.name || 'Assigned Driver',
            driverVehicle: driverResponse.data.vehicleDetails || 'Vehicle details not available',
          }));
        } catch (driverFetchError) {
          console.warn('Failed to fetch driver details:', driverFetchError.response?.data || driverFetchError.message);
          setBookingData(prev => ({
            ...prev,
            driverName: 'Assigned Driver (details unavailable)',
            driverVehicle: 'Vehicle details not available',
          }));
        }
      } else {
        setBookingData(prev => ({
          ...prev,
          driverName: 'No driver assigned yet', // Or handle as per your backend logic for unassigned rides
          driverVehicle: 'N/A',
        }));
      }

      // Simulate a brief moment to show "Driver Connected"
      await new Promise(resolve => setTimeout(resolve, 2000)); // 2 seconds display

      // 3. Navigate to payment page
      navigate(`/payment/${newRideId}`, {
        state: {
          rideDetails: { // Pass essential details to Payment page to avoid re-fetching immediately
            id: newRideId,
            from: bookingData.pickup,
            to: bookingData.dropoff,
            fare: newFare,
            driver: bookingData.driverName, // This will be updated after fetch
            vehicle: bookingData.driverVehicle, // This will be updated after fetch
            // Add other details if needed by Payment.jsx
          }
        }
      });

    } catch (error) {
      console.error('Ride booking failed:', error.response?.data || error.message);
      setBookingError(error.response?.data?.message || 'Failed to book ride. Please try again.');
      setIsBooking(false); // Stop loading animation
      setBookingStep(1); // Go back to step 1 on error
    }
  };

  // Render loading/searching state
  if (isBooking) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
          <div className="max-w-md mx-auto w-full px-4 py-16">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200 p-8 text-center">
              {bookingData.driverId === null ? (
                <>
                  <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-500 mx-auto mb-6"></div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Finding Your Driver</h2>
                  <p className="text-gray-600 mb-6">We're matching you with the best driver nearby...</p>
                </>
              ) : (
                <>
                  <Car className="h-16 w-16 text-green-500 mx-auto mb-6 animate-bounce" />
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Driver Connected!</h2>
                  <p className="text-gray-600 mb-2">Your ride is confirmed with:</p>
                  <p className="text-xl font-semibold text-blue-700">{bookingData.driverName}</p>
                  <p className="text-md text-gray-600">{bookingData.driverVehicle}</p>
                </>
              )}
              
              <div className="bg-gray-100 rounded-lg p-4 mt-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">From:</span>
                  <span className="font-medium">{bookingData.pickup}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">To:</span>
                  <span className="font-medium">{bookingData.dropoff}</span>
                </div>
                {bookingData.fare > 0 && (
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-sm text-gray-600">Estimated Fare:</span>
                    <span className="font-bold text-green-600">₹{bookingData.fare.toFixed(2)}</span>
                  </div>
                )}
              </div>
              {bookingError && (
                <p className="text-red-500 mt-4">{bookingError}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-grow flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
        <div className="max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Book Your Ride</h1>
              <p className="text-gray-600">Tell us where you want to go</p>
            </div>
            <Link
              to="/user/dashboard"
              className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium transition-colors space-x-2 p-3 rounded-lg bg-blue-50 hover:bg-blue-100 shadow-sm"
            >
              <Home className="h-5 w-5" />
              <span>Back to Dashboard</span>
            </Link>
          </div>

          {bookingStep === 1 && (
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200 p-8">
              <h2 className="text-2xl font-semibold mb-6">Enter Locations</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pickup Location
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-500 h-5 w-5" />
                    <input
                      type="text"
                      value={bookingData.pickup}
                      onChange={(e) => setBookingData({...bookingData, pickup: e.target.value})}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter pickup location"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Drop-off Location
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-red-500 h-5 w-5" />
                    <input
                      type="text"
                      value={bookingData.dropoff}
                      onChange={(e) => setBookingData({...bookingData, dropoff: e.target.value})}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter destination"
                      required
                    />
                  </div>
                </div>

                <button
                  onClick={handleBookRide} // This button now triggers the full booking flow
                  disabled={!bookingData.pickup || !bookingData.dropoff || isBooking}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {isBooking ? 'Booking Ride...' : 'Book Ride'}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </button>
                {bookingError && (
                  <p className="text-red-500 text-center mt-4">{bookingError}</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookRide;