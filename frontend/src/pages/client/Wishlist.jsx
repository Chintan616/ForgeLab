import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  HiHeart, 
  HiStar, 
  HiCurrencyDollar, 
  HiClock, 
  HiEye,
  HiTrash,
  HiUser
} from 'react-icons/hi';
import api from '../../utils/api';
import toast from 'react-hot-toast';

const Wishlist = () => {
  const { user } = useAuth();
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      const response = await api.get('/wishlist');
      setWishlist(response.data || []);
    } catch (error) {
      console.error('Error fetching wishlist:', error);
      toast.error('Failed to fetch wishlist');
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = async (gigId) => {
    try {
      await api.delete(`/wishlist/${gigId}`);
      toast.success('Removed from wishlist');
      fetchWishlist(); // Refresh the wishlist
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      toast.error('Failed to remove from wishlist');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <HiHeart className="h-8 w-8 text-red-500" />
          <h1 className="text-3xl font-bold text-gray-900">My Wishlist</h1>
        </div>
        <p className="text-gray-600">Your saved gigs and favorite services.</p>
      </div>

      {/* Wishlist Content */}
      {wishlist.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlist.map((gig) => (
            <div key={gig._id} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
              {/* Gig Content */}
              <div className="p-6">
                {/* Freelancer Info */}
                <div className="flex items-center mb-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-semibold text-sm">
                      {gig.freelancer?.name?.charAt(0) || 'F'}
                    </span>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">
                      {gig.freelancer?.name || 'Freelancer'}
                    </p>
                    <div className="flex items-center text-sm text-gray-500">
                      <HiStar className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                      <span>{gig.averageRating || 0}</span>
                      <span className="mx-1">•</span>
                      <span>{gig.totalRatings || 0} reviews</span>
                    </div>
                  </div>
                </div>

                {/* Gig Title */}
                <Link to={`/gigs/${gig._id}`}>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 hover:text-blue-600 transition-colors">
                    {gig.title}
                  </h3>
                </Link>

                {/* Gig Description */}
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {gig.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {gig.tags?.slice(0, 3).map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                  {gig.tags?.length > 3 && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                      +{gig.tags.length - 3} more
                    </span>
                  )}
                </div>

                {/* Gig Details */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span className="flex items-center">
                      <HiCurrencyDollar className="h-4 w-4 mr-1" />
                      ${gig.price}
                    </span>
                    <span className="flex items-center">
                      <HiClock className="h-4 w-4 mr-1" />
                      {gig.deliveryTime} days
                    </span>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex items-center space-x-2">
                    <Link
                      to={`/gigs/${gig._id}`}
                      className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                      title="View gig"
                    >
                      <HiEye className="h-4 w-4" />
                    </Link>
                    <button
                      onClick={() => removeFromWishlist(gig._id)}
                      className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                      title="Remove from wishlist"
                    >
                      <HiTrash className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <HiHeart className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Your wishlist is empty</h3>
          <p className="mt-1 text-sm text-gray-500">
            Start exploring gigs and add your favorites to your wishlist.
          </p>
          <div className="mt-6">
            <Link
              to="/gigs"
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              Browse Gigs
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Wishlist;

