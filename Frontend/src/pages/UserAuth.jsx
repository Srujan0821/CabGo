// UserAuth.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext'; // Import useAuth hook
import { User, Mail, Lock, Phone } from 'lucide-react';
import Navbar from '../components/Navbar';

const UserAuth = () => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const { registerUser, loginUser } = useAuth(); // Destructure auth functions

  const handleAuth = async (e) => {
    e.preventDefault();
    if (isRegistering) {
      // Register
      const result = await registerUser({ name, email, phone, password });
      if (result.success) {
        // After successful registration, switch to login form
        setIsRegistering(false);
        // Optionally, pre-fill login fields with registered email
        // setEmail(email); 
        // setPassword(''); // Clear password field for security
      }
    } else {
      // Login
      const result = await loginUser({ email, password });
      if (result.success) {
        // Redirection is handled inside loginUser in AuthContext
        // No need to navigate here
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-grow flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
        <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl p-8 md:p-10 w-full max-w-md border border-white/20">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-6">
            {isRegistering ? 'Create User Account' : 'User Login'}
          </h2>

          <form onSubmit={handleAuth} className="space-y-5">
            {isRegistering && (
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Full Name"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required={isRegistering}
                />
              </div>
            )}
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                placeholder="Email Address"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            {isRegistering && (
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="tel"
                  placeholder="Phone Number"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required={isRegistering}
                />
              </div>
            )}
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="password"
                placeholder="Password"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 shadow-md"
            >
              {isRegistering ? 'Register' : 'Login'}
            </button>
          </form>

          <p className="mt-6 text-center text-gray-600">
            {isRegistering ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button
              onClick={() => setIsRegistering(!isRegistering)}
              className="text-blue-600 hover:text-blue-800 font-semibold focus:outline-none"
            >
              {isRegistering ? 'Login here' : 'Register now'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserAuth;