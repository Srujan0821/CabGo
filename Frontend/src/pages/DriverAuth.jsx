// DriverAuth.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext'; // Import useAuth hook
import { Car, Phone, Lock, ClipboardList } from 'lucide-react';
import Navbar from '../components/Navbar';

const DriverAuth = () => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [vehicleDetails, setVehicleDetails] = useState('');
  const [password, setPassword] = useState('');
  const { registerDriver, loginDriver } = useAuth(); // Destructure auth functions

  const handleAuth = async (e) => {
    e.preventDefault();
    if (isRegistering) {
      // Register
      const result = await registerDriver({ name, phone, licenseNumber, vehicleDetails, password });
      if (result.success) {
        setIsRegistering(false); // Switch to login after successful registration
      }
    } else {
      // Login
      const result = await loginDriver({ phone, password });
      if (result.success) {
        // Redirection handled by AuthContext
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-grow flex items-center justify-center bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 p-4">
        <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl p-8 md:p-10 w-full max-w-md border border-white/20">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-6">
            {isRegistering ? 'Become a Driver' : 'Driver Login'}
          </h2>

          <form onSubmit={handleAuth} className="space-y-5">
            {isRegistering && (
              <>
                <div className="relative">
                  <Car className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Full Name"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-200"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required={isRegistering}
                  />
                </div>
                <div className="relative">
                  <ClipboardList className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="License Number"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-200"
                    value={licenseNumber}
                    onChange={(e) => setLicenseNumber(e.target.value)}
                    required={isRegistering}
                  />
                </div>
                <div className="relative">
                  <Car className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Vehicle Details (e.g., Toyota Camry, Black, 2020)"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-200"
                    value={vehicleDetails}
                    onChange={(e) => setVehicleDetails(e.target.value)}
                    required={isRegistering}
                  />
                </div>
              </>
            )}
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="tel"
                placeholder="Phone Number"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-200"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="password"
                placeholder="Password"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-200"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 shadow-md"
            >
              {isRegistering ? 'Register' : 'Login'}
            </button>
          </form>

          <p className="mt-6 text-center text-gray-600">
            {isRegistering ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button
              onClick={() => setIsRegistering(!isRegistering)}
              className="text-green-600 hover:text-green-800 font-semibold focus:outline-none"
            >
              {isRegistering ? 'Login here' : 'Register now'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default DriverAuth;