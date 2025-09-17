import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  HiStar, 
  HiClock, 
  HiCurrencyDollar, 
  HiUser, 
  HiHeart,
  HiShoppingCart,
  HiEye,
  HiLocationMarker
} from 'react-icons/hi';
import api from '../../utils/api';
import toast from 'react-hot-toast';

const GigDetail = () => {
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [gig, setGig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [orderLoading, setOrderLoading] = useState(false);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [ratings, setRatings] = useState([]);
  const [userRating, setUserRating] = useState(null);
  const [showRatingForm, setShowRatingForm] = useState(false);
  const [ratingForm, setRatingForm] = useState({ rating: 0, comment: '' });
  const [ratingLoading, setRatingLoading] = useState(false);

  useEffect(() => {
    fetchGig();
    checkWishlistStatus();
    fetchRatings();
    if (isAuthenticated) {
      fetchUserRating();
    }
  }, [id, isAuthenticated]);

  const fetchGig = async () => {
    try {
      const response = await api.get(`/gigs/${id}`);
      setGig(response.data);
      
      // Track the view if user is authenticated and is a client
      if (isAuthenticated && user?.role === 'client') {
        trackGigView();
      }
    } catch (error) {
      console.error('Error fetching gig:', error);
      toast.error('Failed to fetch gig details');
      navigate('/gigs');
    } finally {
      setLoading(false);
    }
  };

  const trackGigView = async () => {
    try {
      // Check if we've already tracked this view in this session
      const viewedGigs = JSON.parse(localStorage.getItem('viewedGigs') || '[]');
      if (viewedGigs.includes(id)) {
        return; // Already viewed in this session
      }
      
      await api.post(`/gigs/${id}/view`);
      
      // Mark this gig as viewed in this session
      viewedGigs.push(id);
      localStorage.setItem('viewedGigs', JSON.stringify(viewedGigs));
      
      console.log('View tracked for gig:', id);
    } catch (error) {
      console.error('Error tracking gig view:', error);
      // Don't show error to user as this is not critical
    }
  };

  const checkWishlistStatus = async () => {
    if (!isAuthenticated || user?.role !== 'client') return;
    
    try {
      const response = await api.get('/wishlist');
      const wishlist = response.data || [];
      setIsInWishlist(wishlist.some(item => item._id === id));
    } catch (error) {
      console.error('Error checking wishlist status:', error);
    }
  };

  const handleAddToWishlist = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to add items to wishlist');
      navigate('/login');
      return;
    }

    if (user?.role !== 'client') {
      toast.error('Only clients can add items to wishlist');
      return;
    }

    try {
      if (isInWishlist) {
        await api.delete(`/wishlist/${id}`);
        setIsInWishlist(false);
        toast.success('Removed from wishlist');
      } else {
        await api.post(`/wishlist/${id}`);
        setIsInWishlist(true);
        toast.success('Added to wishlist');
      }
    } catch (error) {
      console.error('Error updating wishlist:', error);
      toast.error('Failed to update wishlist');
    }
  };

  const handleOrderNow = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to place an order');
      navigate('/login');
      return;
    }

    if (user.role !== 'client') {
      toast.error('Only clients can place orders');
      return;
    }

    setOrderLoading(true);

    try {
      const response = await api.post('/orders', { gigId: id });
      const { orderId, message } = response.data;
      
      toast.success('Order placed successfully! The ForgeLab will be notified.');
      console.log('Order created:', { orderId, message });
      
      // Optionally redirect to client dashboard or orders page
      // navigate('/client/orders');
      
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to create order';
      toast.error(message);
    } finally {
      setOrderLoading(false);
    }
  };

  const fetchRatings = async () => {
    try {
      const response = await api.get(`/gig-ratings/${id}`);
      setRatings(response.data);
    } catch (error) {
      console.error('Error fetching ratings:', error);
    }
  };

  const fetchUserRating = async () => {
    try {
      const response = await api.get(`/gig-ratings/${id}/user-rating`);
      setUserRating(response.data);
    } catch (error) {
      console.error('Error fetching user rating:', error);
    }
  };

  const handleRatingSubmit = async (e) => {
    e.preventDefault();
    if (!ratingForm.rating || ratingForm.rating < 1) {
      toast.error('Please select a rating');
      return;
    }

    setRatingLoading(true);
    try {
      if (userRating) {
        // Update existing rating
        await api.put(`/gig-ratings/${id}`, ratingForm);
        toast.success('Rating updated successfully!');
      } else {
        // Add new rating
        await api.post(`/gig-ratings/${id}`, ratingForm);
        toast.success('Rating added successfully!');
      }
      
      // Refresh data
      fetchRatings();
      fetchUserRating();
      fetchGig(); // Refresh gig data to get updated average rating
      setShowRatingForm(false);
      setRatingForm({ rating: 0, comment: '' });
    } catch (error) {
      console.error('Error submitting rating:', error);
      toast.error(error.response?.data?.message || 'Failed to submit rating');
    } finally {
      setRatingLoading(false);
    }
  };

  const handleRatingChange = (newRating) => {
    setRatingForm(prev => ({ ...prev, rating: newRating }));
  };

  const renderStars = (rating, interactive = false, size = 'h-5 w-5') => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type={interactive ? 'button' : undefined}
            onClick={interactive ? () => handleRatingChange(star) : undefined}
            className={`${interactive ? 'cursor-pointer' : 'cursor-default'} ${
              star <= rating ? 'text-yellow-400' : 'text-gray-300'
            } ${size} transition-colors`}
          >
            <HiStar className="fill-current" />
          </button>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!gig) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Gig not found</h2>
          <p className="text-gray-600 mt-2">The gig you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="flex mb-8" aria-label="Breadcrumb">
        <ol className="inline-flex items-center space-x-1 md:space-x-3">
          <li className="inline-flex items-center">
            <a href="/" className="text-gray-700 hover:text-blue-600">
              Home
            </a>
          </li>
          <li>
            <div className="flex items-center">
              <span className="mx-2 text-gray-400">/</span>
              <a href="/gigs" className="text-gray-700 hover:text-blue-600">
                Gigs
              </a>
            </div>
          </li>
          <li aria-current="page">
            <div className="flex items-center">
              <span className="mx-2 text-gray-400">/</span>
              <span className="text-gray-500">{gig.title}</span>
            </div>
          </li>
        </ol>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* Gig Image - First */}
          {gig.images && gig.images.length > 0 && (
            <div className="bg-white rounded-lg shadow p-6 mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Gig Image</h2>
              
              <div className="aspect-video rounded-lg overflow-hidden bg-gray-100">
                <img
                  src={gig.images[0].startsWith('http') ? gig.images[0] : `http://localhost:5001${gig.images[0]}`}
                  alt={`${gig.title} - Image`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    console.error('Image failed to load:', e.target.src);
                    e.target.style.display = 'none';
                  }}
                />
              </div>
              
            </div>
          )}

          {/* Gig Title and Basic Info */}
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{gig.title}</h1>
            
            <div className="flex items-center space-x-6 text-sm text-gray-500 mb-4">
              <span className="flex items-center">
                <HiEye className="h-4 w-4 mr-1" />
                {gig.views || 0} views
              </span>
              <span className="flex items-center">
                <HiStar className="h-4 w-4 mr-1" />
                {gig.averageRating || 0} rating
              </span>
              <span className="flex items-center">
                <HiClock className="h-4 w-4 mr-1" />
                {gig.deliveryTime} days delivery
              </span>
            </div>

            <p className="text-gray-700 text-lg leading-relaxed">{gig.description}</p>
          </div>

          {/* ForgeLab Information */}
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">About the ForgeLab</h2>
            
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-semibold text-xl">
                  {gig.freelancer?.name?.charAt(0) || 'F'}
                </span>
              </div>
              
              <div className="flex-1">
                <h3 className="text-lg font-medium text-gray-900">
                  {gig.freelancer?.name || 'ForgeLab'}
                </h3>
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <span className="flex items-center">
                    <HiStar className="h-4 w-4 text-yellow-400 mr-1" />
                    {gig.averageRating || 0} ({gig.totalRatings || 0} reviews)
                  </span>
                  <span className="flex items-center">
                    <HiLocationMarker className="h-4 w-4 mr-1" />
                    {gig.freelancer?.profile?.location || 'Location not specified'}
                  </span>
                </div>
              </div>
            </div>

            {gig.freelancer?.profile?.bio && (
              <p className="text-gray-600 mt-4">{gig.freelancer.profile.bio}</p>
            )}

            {gig.freelancer?.profile?.skills && gig.freelancer.profile.skills.length > 0 && (
              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Skills:</h4>
                <div className="flex flex-wrap gap-2">
                  {gig.freelancer.profile.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Tags */}
          {gig.tags && gig.tags.length > 0 && (
            <div className="bg-white rounded-lg shadow p-6 mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Tags</h2>
              <div className="flex flex-wrap gap-2">
                {gig.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Ratings Section */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Ratings & Reviews</h2>
              {isAuthenticated && user?.role === 'client' && (
                <button
                  onClick={() => setShowRatingForm(!showRatingForm)}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  <HiStar className="h-4 w-4 mr-2" />
                  {userRating ? 'Update Rating' : 'Add Rating'}
                </button>
              )}
            </div>

            {/* Rating Summary */}
            <div className="flex items-center space-x-6 mb-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900">{gig.averageRating || 0}</div>
                <div className="flex items-center justify-center mt-1">
                  {renderStars(gig.averageRating || 0, false, 'h-4 w-4')}
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  {gig.totalRatings || 0} {gig.totalRatings === 1 ? 'rating' : 'ratings'}
                </div>
              </div>
            </div>

            {/* Rating Form */}
            {showRatingForm && isAuthenticated && user?.role === 'client' && (
              <div className="border-t border-gray-200 pt-6 mb-6">
                <form onSubmit={handleRatingSubmit}>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Your Rating
                    </label>
                    {renderStars(ratingForm.rating, true, 'h-6 w-6')}
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Comment (optional)
                    </label>
                    <textarea
                      value={ratingForm.comment}
                      onChange={(e) => setRatingForm(prev => ({ ...prev, comment: e.target.value }))}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Share your experience with this gig..."
                      maxLength={500}
                    />
                  </div>
                  <div className="flex space-x-3">
                    <button
                      type="submit"
                      disabled={ratingLoading}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                    >
                      {ratingLoading ? 'Submitting...' : (userRating ? 'Update Rating' : 'Submit Rating')}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowRatingForm(false);
                        setRatingForm({ rating: 0, comment: '' });
                      }}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* User's Current Rating */}
            {userRating && !showRatingForm && (
              <div className="border-t border-gray-200 pt-6 mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-3">Your Rating</h3>
                <div className="flex items-center space-x-4">
                  {renderStars(userRating.rating, false, 'h-5 w-5')}
                  <span className="text-sm text-gray-600">
                    {userRating.comment || 'No comment provided'}
                  </span>
                </div>
              </div>
            )}

            {/* All Ratings */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">All Reviews</h3>
              {ratings.length > 0 ? (
                ratings.map((rating) => (
                  <div key={rating._id} className="border-t border-gray-100 pt-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-semibold text-sm">
                          {rating.client?.name?.charAt(0) || 'C'}
                        </span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-gray-900">
                            {rating.client?.name || 'Anonymous'}
                          </span>
                          {renderStars(rating.rating, false, 'h-4 w-4')}
                        </div>
                        {rating.comment && (
                          <p className="text-gray-600 mt-1">{rating.comment}</p>
                        )}
                        <p className="text-sm text-gray-500 mt-1">
                          {new Date(rating.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">No reviews yet. Be the first to review this gig!</p>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar - Order Card */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow p-6 sticky top-24">
            <div className="text-center mb-6">
              <div className="text-3xl font-bold text-gray-900 mb-2">
                ${gig.price}
              </div>
              <p className="text-gray-600">One-time project</p>
            </div>

            <div className="space-y-4 mb-6">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Delivery time</span>
                <span className="font-medium">{gig.deliveryTime} days</span>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Category</span>
                <span className="font-medium">{gig.category}</span>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Views</span>
                <span className="font-medium">{gig.views || 0}</span>
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={handleOrderNow}
                disabled={orderLoading || !isAuthenticated || user?.role !== 'client'}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-md font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {orderLoading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  <>
                    <HiShoppingCart className="h-5 w-5 mr-2" />
                    Order Now
                  </>
                )}
              </button>

              {/* Show wishlist button only for clients */}
              {user?.role === 'client' && (
                <button
                  onClick={handleAddToWishlist}
                  className={`w-full py-3 px-4 rounded-md font-medium border-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                    isInWishlist
                      ? 'border-red-300 text-red-600 bg-red-50 hover:bg-red-100'
                      : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
                  } flex items-center justify-center`}
                >
                  <HiHeart className={`h-5 w-5 mr-2 ${isInWishlist ? 'fill-current' : ''}`} />
                  {isInWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
                </button>
              )}
            </div>

            {!isAuthenticated && (
              <div className="mt-4 p-3 bg-blue-50 rounded-md">
                <p className="text-sm text-blue-800 text-center">
                  Please <a href="/login" className="font-medium underline">login</a> to place orders
                </p>
              </div>
            )}

            {isAuthenticated && user?.role !== 'client' && (
              <div className="mt-4 p-3 bg-yellow-50 rounded-md">
                <p className="text-sm text-yellow-800 text-center">
                  Only clients can place orders
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GigDetail;
