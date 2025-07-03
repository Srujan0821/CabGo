import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CreditCard, Smartphone, Wallet, Shield, CheckCircle, MapPin } from 'lucide-react';
import Navbar from '../components/Navbar';

const Payment = () => {
  const { rideId } = useParams();
  const navigate = useNavigate();
  const [selectedMethod, setSelectedMethod] = useState('card');
  const [processing, setProcessing] = useState(false);
  const [paymentComplete, setPaymentComplete] = useState(false);

  const rideDetails = {
    id: rideId,
    from: 'Downtown Mall',
    to: 'Airport Terminal 1',
    driver: 'Mike Johnson',
    vehicle: 'Toyota Camry - ABC123',
    fare: 45.50,
    distance: '12.5 miles',
    duration: '35 min'
  };

  const paymentMethods = [
    {
      id: 'card',
      name: 'Credit/Debit Card',
      description: 'Pay securely with your card',
      icon: CreditCard,
      available: true
    },
    {
      id: 'digital',
      name: 'Digital Wallet',
      description: 'Apple Pay, Google Pay, PayPal',
      icon: Smartphone,
      available: true
    },
    {
      id: 'wallet',
      name: 'RideEasy Wallet',
      description: 'Balance: $25.00',
      icon: Wallet,
      available: false
    }
  ];

  const handlePayment = async () => {
    setProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setProcessing(false);
      setPaymentComplete(true);
      
      // Navigate to rating page after a short delay
      setTimeout(() => {
        navigate(`/rating/${rideId}`);
      }, 2000);
    }, 3000);
  };

  if (paymentComplete) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="max-w-md mx-auto px-4 py-16">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200 p-8 text-center">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Payment Successful!</h2>
            <p className="text-gray-600 mb-6">Thank you for choosing RideEasy</p>
            <div className="bg-gray-100 rounded-lg p-4 text-left">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">Ride ID:</span>
                <span className="font-medium">#{rideId}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Amount Paid:</span>
                <span className="font-bold text-green-600">${rideDetails.fare}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (processing) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="max-w-md mx-auto px-4 py-16">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200 p-8 text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-500 mx-auto mb-6"></div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Processing Payment</h2>
            <p className="text-gray-600 mb-6">Please wait while we process your payment securely...</p>
            <div className="bg-gray-100 rounded-lg p-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Amount:</span>
                <span className="font-bold">${rideDetails.fare}</span>
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Complete Payment</h1>
          <p className="text-gray-600">Secure payment for your ride</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Trip Summary */}
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
                <span className="text-2xl font-bold text-green-600">${rideDetails.fare}</span>
              </div>
            </div>
          </div>

          {/* Payment Methods */}
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
                        <span className="text-xs text-gray-500">Insufficient funds</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {selectedMethod === 'card' && (
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Card Number
                  </label>
                  <input
                    type="text"
                    placeholder="1234 5678 9012 3456"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Expiry Date
                    </label>
                    <input
                      type="text"
                      placeholder="MM/YY"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      CVV
                    </label>
                    <input
                      type="text"
                      placeholder="123"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="flex items-center space-x-2 mb-6 text-sm text-gray-600">
              <Shield className="h-4 w-4" />
              <span>Your payment information is secure and encrypted</span>
            </div>

            <button
              onClick={handlePayment}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105"
            >
              Pay ${rideDetails.fare}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;