import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Star, MessageSquare, ThumbsUp, User, Car, MapPin } from 'lucide-react';
import Navbar from '../components/Navbar';
import { useAuth } from '../contexts/AuthContext'; // Import useAuth
import API from '../api/axios'; // Import axios instance

const Rating = () => {
  const { rideId } = useParams();
  const navigate = useNavigate();
  const location = useLocation(); // To access state passed from Payment
  const { userToken, currentUser } = useAuth(); // Get userToken and currentUser

  const [rideDetails, setRideDetails] = useState(location.state?.rideDetails || null); // Initialize with passed state or null
  const [loadingRideDetails, setLoadingRideDetails] = useState(!rideDetails); // Start loading if no initial details
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [ratingError, setRatingError] = useState(null);

  // Hardcoded positive tags (no API for these)
  const positiveTags = [
    'Professional', 'On Time', 'Clean Car', 'Safe Driving',
    'Friendly', 'Quiet Ride', 'Good Music', 'Helpful'
  ];
  const [selectedTags, setSelectedTags] = useState([]); // Kept for future use if tags are sent to API

  const handleTagToggle = (tag) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  // Fetch ride details if not passed via navigation state
  useEffect(() => {
    const fetchRideDetails = async () => {
      if (!rideId || !userToken) {
        setLoadingRideDetails(false);
        setRatingError('Ride ID or user token missing.');
        return;
      }
      if (rideDetails) { // If details were passed via state, no need to fetch
        setLoadingRideDetails(false);
        return;
      }

      setLoadingRideDetails(true);
      try {
        // ASSUMPTION: GET /api/rides/{rideId} endpoint exists (same as Payment.jsx)
        const response = await API.get(`/rides/data/${rideId}`, {
          headers: { Authorization: `Bearer ${userToken}` },
        });
        const fetchedRide = response.data; // Adjust based on your API response structure for a single ride

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
          driver: driverName,
          driverId: fetchedRide.driverId, // Store driverId for rating submission
          vehicle: driverVehicle,
        });
      } catch (error) {
        console.error('Failed to fetch ride details for rating:', error.response?.data || error.message);
        setRatingError('Could not load ride details. Please try again.');
      } finally {
        setLoadingRideDetails(false);
      }
    };

    fetchRideDetails();
  }, [rideId, userToken, rideDetails]); // Depend on rideId and userToken, and rideDetails

  const handleSubmit = async () => {
    if (rating === 0) {
      alert('Please select a rating.');
      return;
    }
    if (!currentUser || !currentUser.userId) { // Ensure currentUser and their ID are available
      alert('User information missing. Cannot submit rating.');
      return;
    }
    if (!rideDetails || !rideDetails.driverId) {
      alert('Ride or driver information missing. Cannot submit rating.');
      return;
    }

    setSubmitting(true);
    setRatingError(null);

    try {
      const ratingPayload = {
        rideId: rideDetails.id,
        fromUserId: currentUser.userId, // User ID from AuthContext
        toUserId: rideDetails.driverId, // Driver ID from fetched ride details
        score: rating,
        comments: comment,
        // tags: selectedTags // If your API supports tags
      };

      const response = await API.post('/ratings', ratingPayload, {
        headers: { Authorization: `Bearer ${userToken}` },
      });
      console.log('Rating submitted successfully:', response.data);

      alert('Rating submitted successfully!');
      navigate('/user/dashboard'); // Navigate back to user dashboard

    } catch (error) {
      console.error('Failed to submit rating:', error.response?.data || error.message);
      setRatingError(error.response?.data?.message || 'Failed to submit rating. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingRideDetails) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="animate-spin rounded-full h-20 w-20 border-t-2 border-b-2 border-blue-500"></div>
        <p className="ml-4 text-lg text-gray-700">Loading ride details...</p>
      </div>
    );
  }

  if (!rideDetails) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center p-4">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200 p-8 text-center">
            <p className="text-red-500 text-lg mb-4">Error: Ride details could not be loaded for rating.</p>
            <Link to="/user/dashboard" className="text-blue-600 hover:underline">Back to Dashboard</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-grow flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
        <div className="max-w-2xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Rate Your Ride</h1>
            <p className="text-gray-600">Help us improve by sharing your experience</p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200 p-8">
            {/* Driver Info */}
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="h-10 w-10 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{rideDetails.driver}</h2>
              <p className="text-gray-600 flex items-center justify-center">
                <Car className="h-4 w-4 mr-2" />
                {rideDetails.vehicle}
              </p>
            </div>

            {/* Trip Summary */}
            <div className="bg-gray-50 rounded-xl p-4 mb-8">
              <h3 className="font-semibold mb-2">Trip Details</h3>
              <p className="text-sm text-gray-600">
                {rideDetails.from} → {rideDetails.from}
              </p>
            </div>

            {/* Rating Stars */}
            <div className="text-center mb-8">
              <h3 className="text-lg font-semibold mb-4">How was your ride?</h3>
              <div className="flex justify-center space-x-2 mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    className="transition-all duration-200 transform hover:scale-110"
                  >
                    <Star
                      className={`h-12 w-12 ${
                        star <= rating
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300 hover:text-yellow-200'
                      }`}
                    />
                  </button>
                ))}
              </div>
              {rating > 0 && (
                <p className="text-gray-600">
                  {rating === 1 && 'Poor'}
                  {rating === 2 && 'Fair'}
                  {rating === 3 && 'Good'}
                  {rating === 4 && 'Very Good'}
                  {rating === 5 && 'Excellent'}
                </p>
              )}
            </div>

            {/* Additional Comments */}
            <div className="mb-8">
              <label className="block text-lg font-semibold mb-4">
                <MessageSquare className="h-5 w-5 inline mr-2" />
                Additional Comments
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                rows={4}
                placeholder="Share any additional feedback about your ride..."
              />
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={rating === 0 || submitting}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Submitting...
                </div>
              ) : (
                'Submit Rating'
              )}
            </button>

            <button
              onClick={() => navigate('/user/dashboard')}
              className="w-full mt-4 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Skip for now
            </button>
            {ratingError && (
              <p className="text-red-500 text-center mt-4">{ratingError}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Rating;