import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, MessageSquare, ThumbsUp, User, Car } from 'lucide-react';
import Navbar from '../components/Navbar';

const Rating = () => {
  const { rideId } = useParams();
  const navigate = useNavigate();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const rideDetails = {
    id: rideId,
    driver: 'Mike Johnson',
    vehicle: 'Toyota Camry - ABC123',
    from: 'Downtown Mall',
    to: 'Airport Terminal 1'
  };

  const positiveTags = [
    'Professional', 'On Time', 'Clean Car', 'Safe Driving',
    'Friendly', 'Quiet Ride', 'Good Music', 'Helpful'
  ];

  const handleTagToggle = (tag) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const handleSubmit = async () => {
    if (rating === 0) {
      alert('Please select a rating');
      return;
    }

    setSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setSubmitting(false);
      navigate('/user/dashboard');
    }, 2000);
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
              {rideDetails.from} → {rideDetails.to}
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

          {/* Tags */}
          {rating >= 4 && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <ThumbsUp className="h-5 w-5 mr-2 text-green-500" />
                What went well?
              </h3>
              <div className="flex flex-wrap gap-2">
                {positiveTags.map(tag => (
                  <button
                    key={tag}
                    onClick={() => handleTagToggle(tag)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                      selectedTags.includes(tag)
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Comment */}
          <div className="mb-8">
            <label className="block text-lg font-semibold mb-4">
              <MessageSquare className="h-5 w-5 inline mr-2" />
              Additional Comments (Optional)
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
        </div>
      </div>
    </div>
  );
};

export default Rating;