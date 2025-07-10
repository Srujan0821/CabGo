// App.js (Corrected Order)
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import LandingPage from './pages/LandingPage';
import UserAuth from './pages/UserAuth';
import DriverAuth from './pages/DriverAuth';
import UserDashboard from './pages/UserDashboard';
import DriverDashboard from './pages/DriverDashboard';
import BookRide from './pages/BookRide';
import RideHistory from './pages/RideHistory';
import Payment from './pages/Payment';
import Rating from './pages/Rating';
import UserProfile from './pages/UserProfile';
import DriverProfile from './pages/DriverProfile';
import MapPage from './pages/MapPage';

function App() {
  return (
    <Router> {/* Router is rendered first, providing the context */}
      <AuthProvider> {/* AuthProvider is now inside the Router context */}
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/user/auth" element={<UserAuth />} />
            <Route path="/driver/auth" element={<DriverAuth />} />
            <Route path="/user/dashboard" element={<UserDashboard />} />
            <Route path="/user/profile" element={<UserProfile />} /> 
            <Route path="/ride-tracking/:rideId" element={<MapPage />} /> 
            <Route path="/driver/dashboard" element={<DriverDashboard />} />
            <Route path="/driver/profile" element={<DriverProfile />} /> 
            <Route path="/book-ride" element={<BookRide />} />
            <Route path="/ride-history" element={<RideHistory />} />
            <Route path="/payment/:rideId" element={<Payment />} />
            <Route path="/rating/:rideId" element={<Rating />} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;