import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Clock, Car, Users, DollarSign, ArrowRight } from 'lucide-react';
import Navbar from '../components/Navbar';

const BookRide = () => {
  const navigate = useNavigate();
  const [bookingStep, setBookingStep] = useState(1);
  const [bookingData, setBookingData] = useState({
    pickup: '',
    dropoff: '',
    vehicleType: 'standard',
    passengers: 1,
    scheduledTime: 'now'
  });
  const [searchingDriver, setSearchingDriver] = useState(false);

  const vehicleTypes = [
    {
      id: 'standard',
      name: 'Standard',
      description: 'Affordable rides for everyday trips',
      capacity: 4,
      price: 12.50,
      eta: '3-5 min',
      icon: Car
    },
    {
      id: 'premium',
      name: 'Premium',
      description: 'Higher-end vehicles with extra comfort',
      capacity: 4,
      price: 18.75,
      eta: '5-8 min',
      icon: Car
    },
    {
      id: 'xl',
      name: 'XL',
      description: 'Spacious rides for groups up to 6',
      capacity: 6,
      price: 22.50,
      eta: '8-12 min',
      icon: Users
    }
  ];

  const handleBookRide = async () => {
    setSearchingDriver(true);
    
    // Simulate driver search
    setTimeout(() => {
      const rideId = Math.random().toString(36).substr(2, 9);
      navigate(`/payment/${rideId}`);
    }, 3000);
  };

  if (searchingDriver) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="max-w-md mx-auto px-4 py-16">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200 p-8 text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-500 mx-auto mb-6"></div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Finding Your Driver</h2>
            <p className="text-gray-600 mb-6">We're matching you with the best driver nearby...</p>
            <div className="bg-gray-100 rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">From:</span>
                <span className="font-medium">{bookingData.pickup}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">To:</span>
                <span className="font-medium">{bookingData.dropoff}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Book Your Ride</h1>
          <p className="text-gray-600">Tell us where you want to go</p>
        </div>

        {bookingStep === 1 && (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200 p-8">
            <h2 className="text-2xl font-semibold mb-6">Where are you going?</h2>
            
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
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    When?
                  </label>
                  <select
                    value={bookingData.scheduledTime}
                    onChange={(e) => setBookingData({...bookingData, scheduledTime: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="now">Now</option>
                    <option value="schedule">Schedule for later</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Passengers
                  </label>
                  <select
                    value={bookingData.passengers}
                    onChange={(e) => setBookingData({...bookingData, passengers: parseInt(e.target.value)})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {[1,2,3,4,5,6].map(num => (
                      <option key={num} value={num}>{num} passenger{num > 1 ? 's' : ''}</option>
                    ))}
                  </select>
                </div>
              </div>

              <button
                onClick={() => setBookingStep(2)}
                disabled={!bookingData.pickup || !bookingData.dropoff}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                Choose Vehicle Type
                <ArrowRight className="ml-2 h-5 w-5" />
              </button>
            </div>
          </div>
        )}

        {bookingStep === 2 && (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200 p-8">
            <button
              onClick={() => setBookingStep(1)}
              className="text-blue-600 hover:text-blue-800 mb-6 flex items-center"
            >
              ← Back to locations
            </button>
            
            <h2 className="text-2xl font-semibold mb-6">Choose Your Ride</h2>

            <div className="space-y-4 mb-8">
              {vehicleTypes.map(vehicle => {
                const IconComponent = vehicle.icon;
                return (
                  <div
                    key={vehicle.id}
                    onClick={() => setBookingData({...bookingData, vehicleType: vehicle.id})}
                    className={`p-6 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                      bookingData.vehicleType === vehicle.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                          bookingData.vehicleType === vehicle.id
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-100 text-gray-600'
                        }`}>
                          <IconComponent className="h-6 w-6" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">{vehicle.name}</h3>
                          <p className="text-gray-600 text-sm">{vehicle.description}</p>
                          <p className="text-gray-500 text-xs mt-1">
                            Up to {vehicle.capacity} passengers • {vehicle.eta} away
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-gray-900">${vehicle.price}</p>
                        <p className="text-gray-500 text-sm">Estimated fare</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h3 className="font-semibold mb-2">Trip Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">From:</span>
                  <span>{bookingData.pickup}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">To:</span>
                  <span>{bookingData.dropoff}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Vehicle:</span>
                  <span>{vehicleTypes.find(v => v.id === bookingData.vehicleType)?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Passengers:</span>
                  <span>{bookingData.passengers}</span>
                </div>
              </div>
            </div>

            <button
              onClick={handleBookRide}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 flex items-center justify-center"
            >
              <DollarSign className="mr-2 h-5 w-5" />
              Confirm Booking - ${vehicleTypes.find(v => v.id === bookingData.vehicleType)?.price}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookRide;