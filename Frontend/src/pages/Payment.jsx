import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom'; // Added Link for error state
import { CreditCard, Smartphone, Wallet, Shield, CheckCircle, MapPin, DollarSign, Banknote, QrCode, XCircle } from 'lucide-react'; // Added XCircle for error
import Navbar from '../components/Navbar';
import { useAuth } from '../contexts/AuthContext';
import API from '../api/axios'; // Assuming this is your configured axios instance

const Payment = () => {
    const { rideId } = useParams(); // Still used for initial ride details fetch and rating navigation
    const navigate = useNavigate();
    const location = useLocation();
    const { userToken } = useAuth(); // Get user token from AuthContext

    // State to hold ride details (can be passed via location.state or fetched)
    const [rideDetails, setRideDetails] = useState(location.state?.rideDetails || null);
    const [loadingRideDetails, setLoadingRideDetails] = useState(!rideDetails); // True if rideDetails not yet available
    const [selectedMethod, setSelectedMethod] = useState('CARD'); // Default payment method
    const [processing, setProcessing] = useState(false); // State for payment processing animation
    const [paymentComplete, setPaymentComplete] = useState(false); // State for successful payment screen
    const [receipt, setReceipt] = useState(null); // State to store payment receipt data
    const [paymentError, setPaymentError] = useState(null); // State to store any payment-related errors

    // Define available payment methods with their details and icons
    const paymentMethods = [
        { id: 'CARD', name: 'Credit/Debit Card', description: 'Pay securely with your card', icon: CreditCard, available: true },
        { id: 'UPI', name: 'UPI (Google Pay, PhonePe, etc.)', description: 'Fast payments via UPI apps', icon: QrCode, available: true },
        { id: 'CASH', name: 'Cash', description: 'Pay the driver in cash', icon: Banknote, available: true }
    ];

    // Effect to fetch ride details if not already provided via navigation state
    useEffect(() => {
        const fetchRideDetails = async () => {
            // Basic validation for fetching
            if (!rideId || !userToken) {
                setLoadingRideDetails(false);
                setPaymentError('Ride ID or user token missing. Cannot load payment page.');
                return;
            }
            // If ride details are already available, no need to fetch again
            if (rideDetails) {
                setLoadingRideDetails(false);
                return;
            }

            setLoadingRideDetails(true); // Start loading state
            try {
                // Fetch ride data from the backend using rideId
                const response = await API.get(`/rides/data/${rideId}`, {
                    headers: { Authorization: `Bearer ${userToken}` },
                });
                const fetchedRide = response.data;

                // Initialize driver details
                let driverName = 'Unknown Driver';
                let driverVehicle = 'Unknown Vehicle';

                // Fetch driver details if driverId is available for display
                if (fetchedRide.driverId) {
                    try {
                        const driverResponse = await API.get(`/drivers/data/${fetchedRide.driverId}`);
                        driverName = driverResponse.data.name || driverName;
                        driverVehicle = driverResponse.data.vehicleDetails || driverVehicle;
                    } catch (driverErr) {
                        console.warn(`Failed to fetch driver details for ${fetchedRide.driverId}:`, driverErr);
                        // Do not block if driver details fail, just log a warning
                    }
                }

                // Set the fetched ride details into state
                setRideDetails({
                    id: fetchedRide.rideId,
                    from: fetchedRide.pickupLocation,
                    to: fetchedRide.dropoffLocation,
                    fare: fetchedRide.fare,
                    driver: driverName,
                    vehicle: driverVehicle,
                    distance: 'N/A', // Assuming these are not in your RideDTO for now
                    duration: 'N/A' // Assuming these are not in your RideDTO for now
                });
            } catch (error) {
                console.error('Failed to fetch ride details for payment:', error.response?.data || error.message);
                setPaymentError('Could not load ride details. Please try again.');
            } finally {
                setLoadingRideDetails(false); // End loading state
            }
        };

        fetchRideDetails(); // Call the fetch function
    }, [rideId, userToken, rideDetails]); // Dependencies for useEffect

    // Handler for processing payment
    const handlePayment = async () => {
        // Pre-check: Ensure ride details and user token are available
        if (!rideDetails || !userToken) {
            setPaymentError('Ride details or user token missing. Cannot process payment.');
            return;
        }
        setProcessing(true); // Set processing state to true for UI feedback
        setPaymentError(null); // Clear any previous errors

        try {
            // 1. Process Payment - Call your backend's /api/payments/process endpoint
            const paymentResponse = await API.post('/payments/process', {
                amount: rideDetails.fare, // Send the fare as amount
                method: selectedMethod, // Send the selected payment method (CARD, UPI, CASH)
            }, {
                headers: { Authorization: `Bearer ${userToken}` }, // Include JWT for authorization
            });
            console.log('Payment process response:', paymentResponse.data);

            // 2. Get Receipt - Call your backend's /api/payments/receipt endpoint
            // *** CRUCIAL CHANGE HERE: No rideId in the URL path, as per your backend logic ***
            const receiptResponse = await API.get(`/payments/receipt`, {
                headers: { Authorization: `Bearer ${userToken}` }, // Include JWT for authorization
            });
            setReceipt(receiptResponse.data); // Store the fetched receipt data
            console.log('Receipt response:', receiptResponse.data);

            setPaymentComplete(true); // Set payment complete state for success screen

            // Navigate to the rating page after a short delay for user to see success message
            setTimeout(() => {
                navigate(`/rating/${rideId}`);
            }, 2000);

        } catch (error) {
            // Error handling for API calls
            console.error('Payment failed:', error.response?.data || error.message);
            setPaymentError(error.response?.data?.message || 'Payment failed. Please try again.');
        } finally {
            setProcessing(false); // End processing state
        }
    };

    // --- Conditional Renderings for different states ---

    // Loading Ride Details State
    if (loadingRideDetails) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
                <div className="animate-spin rounded-full h-20 w-20 border-t-2 border-b-2 border-blue-500"></div>
                <p className="ml-4 text-lg text-gray-700">Loading ride details...</p>
            </div>
        );
    }

    // Error Loading Ride Details State
    if (!rideDetails && paymentError) { // If rideDetails are null and there's an error message
        return (
            <div className="min-h-screen flex flex-col">
                <Navbar />
                <div className="flex-grow flex items-center justify-center p-4">
                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200 p-8 text-center">
                        <XCircle className="h-16 w-16 text-red-500 mx-auto mb-6" />
                        <p className="text-red-500 text-lg mb-4">{paymentError}</p>
                        <Link to="/user/dashboard" className="text-blue-600 hover:underline">Back to Dashboard</Link>
                    </div>
                </div>
            </div>
        );
    }


    // Payment Complete State
    if (paymentComplete) {
        return (
            <div className="min-h-screen flex flex-col">
                <Navbar />
                <div className="flex-grow flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
                    <div className="max-w-md mx-auto w-full px-4 py-16">
                        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200 p-8 text-center">
                            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-6" />
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">Payment Successful!</h2>
                            <p className="text-gray-600 mb-6">Thank you for choosing CabGo</p>
                            <div className="bg-gray-100 rounded-lg p-4 text-left">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-sm text-gray-600">Ride ID:</span>
                                    <span className="font-medium">#{receipt?.rideId || rideId}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-600">Amount Paid:</span>
                                    <span className="font-bold text-green-600">₹{receipt?.amount?.toFixed(2) || rideDetails.fare.toFixed(2)}</span>
                                </div>
                                {receipt?.method && (
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-600">Method:</span>
                                        <span className="font-medium">{receipt.method}</span>
                                    </div>
                                )}
                                {receipt?.timestamp && (
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-600">Date:</span>
                                        {/* Format timestamp to a readable date string */}
                                        <span className="font-medium">{new Date(receipt.timestamp).toLocaleDateString()}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Payment Processing State
    if (processing) {
        return (
            <div className="min-h-screen flex flex-col">
                <Navbar />
                <div className="flex-grow flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
                    <div className="max-w-md mx-auto w-full px-4 py-16">
                        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200 p-8 text-center">
                            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-500 mx-auto mb-6"></div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">Processing Payment</h2>
                            <p className="text-gray-600 mb-6">Please wait while we process your payment securely...</p>
                            <div className="bg-gray-100 rounded-lg p-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-600">Amount:</span>
                                    <span className="font-bold">₹{rideDetails.fare.toFixed(2)}</span>
                                </div>
                            </div>
                            {paymentError && (
                                <p className="text-red-500 mt-4">{paymentError}</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Main Payment Page Layout
    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />

            <div className="flex-grow flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
                <div className="max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Complete Payment</h1>
                        <p className="text-gray-600">Secure payment for your ride</p>
                    </div>

                    <div className="grid lg:grid-cols-2 gap-8">
                        {/* Trip Summary Section */}
                        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200 p-6">
                            <h2 className="text-xl font-semibold mb-6">Trip Summary</h2>

                            <div className="space-y-4 mb-6">
                                <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center">
                                        <MapPin className="h-5 w-5 text-white" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">From</p>
                                        <p className="font-medium">{rideDetails.from}</p>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center">
                                        <MapPin className="h-5 w-5 text-white" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">To</p>
                                        <p className="font-medium">{rideDetails.to}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="border-t border-gray-200 pt-4 space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Driver:</span>
                                    <span className="font-medium">{rideDetails.driver}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Vehicle:</span>
                                    <span className="font-medium">{rideDetails.vehicle}</span>
                                </div>
                                {/* Distance and Duration are N/A based on your DTO, keep for UI if desired */}
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Distance:</span>
                                    <span className="font-medium">{rideDetails.distance}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Duration:</span>
                                    <span className="font-medium">{rideDetails.duration}</span>
                                </div>
                            </div>

                            <div className="border-t border-gray-200 pt-4 mt-6">
                                <div className="flex justify-between items-center">
                                    <span className="text-xl font-semibold">Total:</span>
                                    <span className="text-2xl font-bold text-green-600">₹{rideDetails.fare.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>

                        {/* Payment Methods Section */}
                        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200 p-6">
                            <h2 className="text-xl font-semibold mb-6">Payment Method</h2>

                            <div className="space-y-4 mb-6">
                                {paymentMethods.map(method => {
                                    const IconComponent = method.icon;
                                    return (
                                        <div
                                            key={method.id}
                                            onClick={() => method.available && setSelectedMethod(method.id)}
                                            className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                                                selectedMethod === method.id
                                                    ? 'border-blue-500 bg-blue-50'
                                                    : method.available
                                                        ? 'border-gray-200 hover:border-gray-300'
                                                        : 'border-gray-100 bg-gray-50 cursor-not-allowed opacity-50'
                                            }`}
                                        >
                                            <div className="flex items-center space-x-4">
                                                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                                                    selectedMethod === method.id
                                                        ? 'bg-blue-500 text-white'
                                                        : 'bg-gray-100 text-gray-600'
                                                }`}>
                                                    <IconComponent className="h-6 w-6" />
                                                </div>
                                                <div className="flex-1">
                                                    <h3 className="font-semibold">{method.name}</h3>
                                                    <p className="text-sm text-gray-600">{method.description}</p>
                                                </div>
                                                {!method.available && (
                                                    <span className="text-xs text-gray-500">Currently Unavailable</span>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Conditional input fields based on selected method */}
                            {selectedMethod === 'CARD' && (
                                <div className="space-y-4 mb-6">
                                    <div>
                                        <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-2">
                                            Card Number
                                        </label>
                                        <input
                                            type="text"
                                            id="cardNumber"
                                            placeholder="1234 5678 9012 3456"
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700 mb-2">
                                                Expiry Date
                                            </label>
                                            <input
                                                type="text"
                                                id="expiryDate"
                                                placeholder="MM/YY"
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="cvv" className="block text-sm font-medium text-gray-700 mb-2">
                                                CVV
                                            </label>
                                            <input
                                                type="text"
                                                id="cvv"
                                                placeholder="123"
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {selectedMethod === 'UPI' && (
                                <div className="space-y-4 mb-6 p-4 border border-blue-200 rounded-lg bg-blue-50 text-center">
                                    <QrCode className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                                    <p className="font-semibold text-lg text-gray-800">Scan to Pay with UPI</p>
                                    <p className="text-sm text-gray-600 mt-2">
                                        Open your preferred UPI app (Google Pay, PhonePe, Paytm, etc.) and scan the QR code to complete the payment.
                                    </p>
                                    {/* Placeholder for dynamic QR code */}
                                    <div className="w-48 h-48 bg-white mx-auto mt-4 flex items-center justify-center border border-gray-300 rounded-md">
                                        <span className="text-gray-400 text-sm">QR Code Placeholder</span>
                                    </div>
                                </div>
                            )}

                            {selectedMethod === 'CASH' && (
                                <div className="space-y-4 mb-6 p-4 border border-green-200 rounded-lg bg-green-50 text-center">
                                    <Banknote className="h-12 w-12 text-green-600 mx-auto mb-4" />
                                    <p className="font-semibold text-lg text-gray-800">Pay in Cash</p>
                                    <p className="text-sm text-gray-600 mt-2">
                                        Please pay the driver ₹{rideDetails.fare.toFixed(2)} directly in cash at the end of your ride.
                                    </p>
                                </div>
                            )}

                            <div className="flex items-center space-x-2 mb-6 text-sm text-gray-600">
                                <Shield className="h-4 w-4" />
                                <span>Your payment information is secure and encrypted</span>
                            </div>

                            {/* Payment Button */}
                            <button
                                onClick={handlePayment}
                                disabled={processing || !selectedMethod} // Disable if processing or no method selected
                                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                            >
                                {processing ? (
                                    <>
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        <DollarSign className="mr-2 h-5 w-5" />
                                        Pay ₹{rideDetails.fare.toFixed(2)}
                                    </>
                                )}
                            </button>
                            {paymentError && (
                                <p className="text-red-500 text-center mt-4">{paymentError}</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Payment;