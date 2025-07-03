import React from 'react';
import { Link } from 'react-router-dom';
import { Car, Clock, Shield, Star, MapPin, CreditCard } from 'lucide-react';
import Navbar from '../components/Navbar';

const LandingPage = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Your Ride,
            </span>
            <br />
            <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 bg-clip-text text-transparent">
              Your Way
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
            Experience seamless transportation with RideEasy. Safe, reliable, and affordable rides at your fingertips.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              to="/user/auth"
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              Book a Ride
            </Link>
            <Link
              to="/driver/auth"
              className="bg-white/80 backdrop-blur-sm text-gray-800 px-8 py-4 rounded-xl text-lg font-semibold border-2 border-gray-200 hover:border-purple-300 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              Drive with Us
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
            Why Choose RideEasy?
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Clock className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-gray-800">Quick Booking</h3>
              <p className="text-gray-600 leading-relaxed">Book your ride in seconds with our intuitive interface and get matched with nearby drivers instantly.</p>
            </div>
            
            <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-gray-800">Safe & Secure</h3>
              <p className="text-gray-600 leading-relaxed">All drivers are verified and background-checked. Your safety is our top priority.</p>
            </div>
            
            <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Star className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-gray-800">Rated Drivers</h3>
              <p className="text-gray-600 leading-relaxed">Choose from top-rated drivers with excellent customer reviews and professional service.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
            How It Works
          </h2>
          
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-2xl font-bold">
                1
              </div>
              <MapPin className="h-8 w-8 text-blue-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Set Location</h3>
              <p className="text-gray-600 text-sm">Enter your pickup and drop-off locations</p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-2xl font-bold">
                2
              </div>
              <Car className="h-8 w-8 text-purple-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Get Matched</h3>
              <p className="text-gray-600 text-sm">We'll find the best driver near you</p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-2xl font-bold">
                3
              </div>
              <Clock className="h-8 w-8 text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Track Ride</h3>
              <p className="text-gray-600 text-sm">Monitor your ride in real-time</p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-2xl font-bold">
                4
              </div>
              <CreditCard className="h-8 w-8 text-orange-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Pay & Rate</h3>
              <p className="text-gray-600 text-sm">Secure payment and rate your experience</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-6">
            <Car className="h-8 w-8 text-blue-400" />
            <span className="text-2xl font-bold">RideEasy</span>
          </div>
          <p className="text-gray-400 mb-6">Making transportation accessible for everyone</p>
          <div className="flex justify-center space-x-8 text-sm text-gray-400">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;