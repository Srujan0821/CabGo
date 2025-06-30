import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// Import Pages
import Home from './pages/Home';
import UserRegister from './pages/UserRegister';
import UserLogin from './pages/UserLogin';
import DriverRegister from './pages/DriverRegister';
import DriverLogin from './pages/DriverLogin';
import UserProfile from './pages/UserProfile';
import DriverProfile from './pages/DriverProfile';
import BookRide from './pages/BookRide';
import UserRides from './pages/UserRides';

// Import Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';

function App() {
  const { userToken, driverToken } = useAuth();

  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/user/register" element={<UserRegister />} />
            <Route path="/user/login" element={<UserLogin />} />
            <Route path="/driver/register" element={<DriverRegister />} />
            <Route path="/driver/login" element={<DriverLogin />} />

            {/* Protected Routes for Users */}
            {userToken && (
              <>
                <Route path="/user/profile" element={<UserProfile />} />
                <Route path="/user/book-ride" element={<BookRide />} />
                <Route path="/user/rides" element={<UserRides />} />
              </>
            )}

            {/* Protected Routes for Drivers */}
            {driverToken && (
              <>
                <Route path="/driver/profile" element={<DriverProfile />} />
                {/* Add driver specific routes like managing rides, etc. */}
              </>
            )}

            {/* Redirect unauthenticated users/drivers from protected routes */}
            {!userToken && !driverToken && (
              <Route path="/*" element={<p className="text-center text-red-500 text-xl font-semibold mt-10">Please login to access this page.</p>} />
            )}
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;