import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import { MapPin, Car, User, Clock, ArrowLeft, XCircle, CheckCircle, DollarSign } from 'lucide-react'; // <--- ADDED DollarSign HERE
import Navbar from '../components/Navbar';
import { useAuth } from '../contexts/AuthContext';
import API from '../api/axios';

const MapPage = () => {
    const { rideId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const { userToken } = useAuth();

    // Initial ride details from location state (from BookRide.jsx) or null
    const [rideDetails, setRideDetails] = useState(location.state?.rideDetails || null);
    const [loadingRideStatus, setLoadingRideStatus] = useState(true);
    const [error, setError] = useState(null);

    // Function to fetch the latest ride status and details
    const fetchRideStatus = useCallback(async () => {
        if (!rideId || !userToken) {
            setError('Ride ID or user token missing.');
            setLoadingRideStatus(false);
            return;
        }

        try {
            const response = await API.get(`/rides/data/${rideId}`, {
                headers: { Authorization: `Bearer ${userToken}` },
            });
            const fetchedRide = response.data;

            // If ride details were not passed via state, fetch driver details now
            if (!rideDetails || rideDetails.driver === 'Searching...') { // Check if driver details are placeholders
                let driverName = 'Unknown Driver';
                let driverVehicle = 'Unknown Vehicle';
                if (fetchedRide.driverId) {
                    try {
                        const driverResponse = await API.get(`/drivers/data/${fetchedRide.driverId}`);
                        driverName = driverResponse.data.name || driverName;
                        driverVehicle = driverResponse.data.vehicleDetails || driverVehicle;
                    } catch (driverErr) {
                        console.warn(`Failed to fetch driver details for ${fetchedRide.driverId}:`, driverErr);
                    }
                }
                setRideDetails({
                    id: fetchedRide.rideId,
                    from: fetchedRide.pickupLocation,
                    to: fetchedRide.dropoffLocation,
                    fare: fetchedRide.fare,
                    driver: driverName,
                    vehicle: driverVehicle,
                    status: fetchedRide.status, // Update status
                    userId: fetchedRide.userId // Ensure userId is passed for payment if needed
                });
            } else {
                // Only update the status if other details are already present
                setRideDetails(prev => ({ ...prev, status: fetchedRide.status }));
            }

            // Handle navigation based on ride status
            if (fetchedRide.status === 'COMPLETED') {
                navigate(`/payment/${rideId}`, { state: { rideDetails: fetchedRide } });
            } else if (fetchedRide.status === 'CANCELLED') {
                alert('Your ride has been cancelled by the driver or system.');
                navigate('/user/dashboard'); // Or a specific cancellation page
            }

        } catch (err) {
            console.error('Failed to fetch ride status:', err.response?.data || err.message);
            setError(err.response?.data?.message || 'Failed to load ride status.');
        } finally {
            setLoadingRideStatus(false);
        }
    }, [rideId, userToken, navigate, rideDetails]); // Added rideDetails to dependencies for the initial fetch logic

    // Polling effect to continuously check ride status
    useEffect(() => {
        // Fetch immediately on mount
        fetchRideStatus();

        // Set up interval for polling (e.g., every 5 seconds)
        const intervalId = setInterval(fetchRideStatus, 5000);

        // Cleanup interval on component unmount
        return () => clearInterval(intervalId);
    }, [fetchRideStatus]); // Depend on the memoized fetchRideStatus

    // Loading State
    if (loadingRideStatus && !rideDetails) { // Only show full loading if no initial details
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
                <div className="animate-spin rounded-full h-20 w-20 border-t-2 border-b-2 border-blue-500"></div>
                <p className="ml-4 text-lg text-gray-700">Tracking your ride...</p>
            </div>
        );
    }

    // Error State
    if (error) {
        return (
            <div className="min-h-screen flex flex-col">
                <Navbar />
                {/* <div className="flex-grow flex items-center justify-center p-4">
                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200 p-8 text-center">
                        <XCircle className="h-16 w-16 text-red-500 mx-auto mb-6" />
                        <p className="text-red-500 text-lg mb-4">{error}</p>
                        <Link to="/user/dashboard" className="text-blue-600 hover:underline">Back to Dashboard</Link>
                    </div>
                </div> */}
            </div>
        );
    }

    // If rideDetails are still null after loading (e.g., rideId was invalid)
    if (!rideDetails) {
        return (
            <div className="min-h-screen flex flex-col">
                <Navbar />
                <div className="flex-grow flex items-center justify-center p-4">
                    {/* <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200 p-8 text-center">
                        <XCircle className="h-16 w-16 text-red-500 mx-auto mb-6" />
                        <p className="text-red-500 text-lg mb-4">Ride details not found or accessible.</p>
                        <Link to="/user/dashboard" className="text-blue-600 hover:underline">Back to Dashboard</Link>
                    </div> */}
                </div>
            </div>
        );
    }

    // Determine animation class based on ride status
    let carAnimationClass = '';
    let statusMessage = '';
    let carColor = 'text-gray-700';

    if (rideDetails.status === 'ASSIGNED') {
        carAnimationClass = 'animate-car-to-pickup'; // Custom animation
        statusMessage = "Your driver is on the way to your pickup location.";
        carColor = 'text-blue-600';
    } else if (rideDetails.status === 'ONGOING' || rideDetails.status === 'IN_PROGRESS') {
        carAnimationClass = 'animate-car-to-dropoff'; // Custom animation
        statusMessage = "Your ride is currently in progress.";
        carColor = 'text-green-600';
    } else {
        // Fallback or if status is PENDING, REQUESTED etc.
        statusMessage = "Waiting for driver assignment...";
        carAnimationClass = 'animate-pulse';
        carColor = 'text-gray-500';
    }


    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />

            <div className="flex-grow flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
                <div className="max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
                    <div className="mb-8 flex justify-between items-center">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">Track Your Ride</h1>
                            <p className="text-gray-600">Real-time updates on your trip</p>
                        </div>
                        {/* <Link
                            to="/user/dashboard"
                            className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium transition-colors space-x-2 p-3 rounded-lg bg-blue-50 hover:bg-blue-100 shadow-sm"
                        >
                            <ArrowLeft className="h-5 w-5" />
                            <span>Back to Dashboard</span>
                        </Link> */}
                    </div>

                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200 p-8">
                        <h2 className="text-2xl font-semibold mb-6">Ride Status: <span className="text-purple-700">{rideDetails.status}</span></h2>

                        {/* Ride Details Summary */}
                        <div className="grid md:grid-cols-2 gap-6 mb-8">
                            <div className="space-y-4">
                                <div className="flex items-center space-x-3">
                                    <MapPin className="h-6 w-6 text-green-500" />
                                    <div>
                                        <p className="text-sm text-gray-600">Pickup</p>
                                        <p className="font-medium text-gray-900">{rideDetails.from}</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <MapPin className="h-6 w-6 text-red-500" />
                                    <div>
                                        <p className="text-sm text-gray-600">Drop-off</p>
                                        <p className="font-medium text-gray-900">{rideDetails.to}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div className="flex items-center space-x-3">
                                    <User className="h-6 w-6 text-blue-500" />
                                    <div>
                                        <p className="text-sm text-gray-600">Driver</p>
                                        <p className="font-medium text-gray-900">{rideDetails.driver}</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <Car className="h-6 w-6 text-blue-500" />
                                    <div>
                                        <p className="text-sm text-gray-600">Vehicle</p>
                                        <p className="font-medium text-gray-900">{rideDetails.vehicle}</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <DollarSign className="h-6 w-6 text-green-500" />
                                    <div>
                                        <p className="text-sm text-gray-600">Fare</p>
                                        <p className="font-bold text-green-700">₹{rideDetails.fare.toFixed(2)}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Animated Map Section */}
                        <div className="relative w-full h-48 bg-gray-100 rounded-xl border border-gray-300 overflow-hidden flex items-center justify-between p-4">
                            {/* Pickup Location Marker */}
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 flex flex-col items-center">
                                <MapPin className="h-8 w-8 text-green-500 z-10" />
                                <span className="text-xs text-gray-700 mt-1">Pickup</span>
                            </div>

                            {/* Drop-off Location Marker */}
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col items-center">
                                <MapPin className="h-8 w-8 text-red-500 z-10" />
                                <span className="text-xs text-gray-700 mt-1">Drop-off</span>
                            </div>

                            {/* Route Line (conceptual) */}
                            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[calc(100%-8rem)] h-1 bg-gray-400 rounded-full"></div>

                            {/* Animated Car Icon */}
                            <div className={`absolute top-1/2 -translate-y-1/2 ${carAnimationClass} z-20`}>
                                <Car className={`h-10 w-10 ${carColor}`} />
                            </div>
                        </div>

                        <div className="text-center mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                            <p className="text-lg font-semibold text-gray-800 flex items-center justify-center">
                                <Clock className="h-5 w-5 mr-2 text-blue-600" />
                                {statusMessage}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MapPage;
