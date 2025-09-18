import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { HiSearch, HiFilter, HiStar, HiCurrencyDollar, HiClock, HiHeart } from 'react-icons/hi';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import FreelancerModal from '../../components/FreelancerModal';

const BrowseGigs = () => {
  const { user } = useAuth();
  const [gigs, setGigs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [sortBy, setSortBy] = useState('newest');
  const [wishlist, setWishlist] = useState([]);
  const [freelancerModal, setFreelancerModal] = useState({ isOpen: false, freelancerId: null });

  const categories = [
    'All Categories',
    'Graphics & Design',
    'Digital Marketing',
    'Writing & Translation',
    'Video & Animation',
    'Music & Audio',
    'Programming & Tech',
    'Business',
    'Lifestyle'
  ];

  useEffect(() => {
    fetchGigs();
    if (user?.role === 'client') {
      fetchWishlist();
    }
  }, [user]);

  const fetchGigs = async () => {
    try {
      const response = await api.get('/gigs');
      setGigs(response.data.gigs || response.data || []);
    } catch (error) {
      console.error('Error fetching gigs:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchWishlist = async () => {
    try {
      const response = await api.get('/wishlist');
      setWishlist(response.data || []);
    } catch (error) {
      console.error('Error fetching wishlist:', error);
    }
  };

  const filteredGigs = gigs.filter(gig => {
    const matchesSearch = gig.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         gig.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         gig.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = !selectedCategory || selectedCategory === 'All Categories' || 
                           gig.category === selectedCategory;
    
    const matchesPrice = (!priceRange.min || gig.price >= parseFloat(priceRange.min)) &&
                        (!priceRange.max || gig.price <= parseFloat(priceRange.max));
    
    return matchesSearch && matchesCategory && matchesPrice;
  });

  const sortedGigs = [...filteredGigs].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'newest':
        return new Date(b.createdAt) - new Date(a.createdAt);
      case 'oldest':
        return new Date(a.createdAt) - new Date(b.createdAt);
      default:
        return 0;
    }
  });

  const addToWishlist = async (gigId) => {
    if (user?.role !== 'client') {
      toast.error('Only clients can add items to wishlist');
      return;
    }
    
    const isInWishlist = wishlist.some(item => item._id === gigId);
    
    try {
      if (isInWishlist) {
        await api.delete(`/wishlist/${gigId}`);
        toast.success('Removed from wishlist');
      } else {
        await api.post(`/wishlist/${gigId}`);
        toast.success('Added to wishlist');
      }
      fetchWishlist(); // Refresh wishlist state
    } catch (error) {
      console.error('Error updating wishlist:', error);
      toast.error('Failed to update wishlist');
    }
  };

  const handleFreelancerClick = (freelancerId) => {
    setFreelancerModal({ isOpen: true, freelancerId });
  };

  const closeFreelancerModal = () => {
    setFreelancerModal({ isOpen: false, freelancerId: null });
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
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
          Browse Gigs
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Discover talented ForgeLab and amazing services that bring your ideas to life.
        </p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 mb-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Search */}
          <div className="relative">
            <HiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search gigs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 text-gray-700 placeholder-gray-400"
            />
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 text-gray-700 bg-white"
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          {/* Price Range */}
          <div className="flex space-x-3">
            <input
              type="number"
              placeholder="Min $"
              value={priceRange.min}
              onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-green-100 focus:border-green-500 transition-all duration-200 text-gray-700 placeholder-gray-400"
            />
            <input
              type="number"
              placeholder="Max $"
              value={priceRange.max}
              onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-green-100 focus:border-green-500 transition-all duration-200 text-gray-700 placeholder-gray-400"
            />
          </div>

          {/* Sort */}
          <div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-100 focus:border-purple-500 transition-all duration-200 text-gray-700 bg-white"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-8">
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 border border-blue-100">
          <p className="text-gray-700 font-medium">
            <span className="text-blue-600 font-bold">{sortedGigs.length}</span> of <span className="text-purple-600 font-bold">{gigs.length}</span> gigs found
          </p>
        </div>
      </div>

      {/* Gigs Grid */}
      {sortedGigs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sortedGigs.map((gig) => (
            <div key={gig._id} className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 overflow-hidden">
              {/* Gig Image - First */}
              {gig.images && gig.images.length > 0 && (
                <div className="aspect-video overflow-hidden bg-gray-100">
                  <img
                    src={gig.images[0].startsWith('http') ? gig.images[0] : `http://localhost:5001${gig.images[0]}`}
                    alt={gig.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      console.error('Image failed to load:', e.target.src);
                      e.target.style.display = 'none';
                    }}
                  />
                </div>
              )}

              {/* Gig Details Card */}
              <div className="p-6">
                {/* ForgeLab Info */}
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-md">
                    <span className="text-white font-bold text-sm">
                      {gig.freelancer?.name?.charAt(0) || 'F'}
                    </span>
                  </div>
                  <div className="ml-3 flex-1">
                    <button
                      onClick={() => handleFreelancerClick(gig.freelancer?._id)}
                      className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition-colors hover:underline cursor-pointer text-left"
                    >
                      {gig.freelancer?.name || 'ForgeLab'}
                    </button>
                    <div className="flex items-center text-sm text-gray-500">
                      <div className="flex items-center">
                        <HiStar className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                        <span className="font-medium">{gig.averageRating || 0}</span>
                      </div>
                      <span className="mx-2 text-gray-300">•</span>
                      <span>{gig.totalRatings || 0} reviews</span>
                    </div>
                  </div>
                </div>

                {/* Gig Title */}
                <Link to={`/gigs/${gig._id}`}>
                  <h3 className="text-xl font-bold text-gray-900 mb-3 hover:text-blue-600 transition-colors line-clamp-2 leading-tight">
                    {gig.title}
                  </h3>
                </Link>

                {/* Gig Description */}
                <p className="text-gray-600 text-sm mb-4 line-clamp-3 leading-relaxed">
                  {gig.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-5">
                  {gig.tags?.slice(0, 3).map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 text-xs font-medium rounded-full border border-blue-100 hover:from-blue-100 hover:to-purple-100 transition-all duration-200"
                    >
                      {tag}
                    </span>
                  ))}
                  {gig.tags?.length > 3 && (
                    <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full border border-gray-200">
                      +{gig.tags.length - 3} more
                    </span>
                  )}
                </div>

                {/* Gig Details */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex items-center space-x-6">
                    <div className="flex items-center bg-green-50 px-3 py-1.5 rounded-full">
                      <HiCurrencyDollar className="h-4 w-4 mr-1.5 text-green-600" />
                      <span className="text-sm font-bold text-green-700">${gig.price}</span>
                    </div>
                    <div className="flex items-center bg-blue-50 px-3 py-1.5 rounded-full">
                      <HiClock className="h-4 w-4 mr-1.5 text-blue-600" />
                      <span className="text-sm font-medium text-blue-700">{gig.deliveryTime} days</span>
                    </div>
                  </div>
                  
                  {/* Show wishlist button only for clients */}
                  {user?.role === 'client' && (
                    <button
                      onClick={() => addToWishlist(gig._id)}
                      className={`p-2.5 rounded-full transition-all duration-200 transform hover:scale-110 ${
                        wishlist.some(item => item._id === gig._id)
                          ? 'bg-red-100 text-red-500 hover:bg-red-200'
                          : 'bg-gray-100 text-gray-400 hover:bg-red-100 hover:text-red-500'
                      }`}
                      title={wishlist.some(item => item._id === gig._id) ? 'Remove from wishlist' : 'Add to wishlist'}
                    >
                      <HiHeart className={`h-5 w-5 ${wishlist.some(item => item._id === gig._id) ? 'fill-current' : ''}`} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <HiSearch className="h-10 w-10 text-blue-500" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No gigs found</h3>
          <p className="text-gray-500 mb-6 max-w-md mx-auto">
            Try adjusting your search criteria or browse all categories to discover amazing services.
          </p>
          <button 
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('');
              setPriceRange({ min: '', max: '' });
            }}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-full hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            Clear Filters
          </button>
        </div>
      )}

      {/* Load More Button */}
      {sortedGigs.length > 0 && sortedGigs.length < gigs.length && (
        <div className="text-center mt-12">
          <button className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-full hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-4 focus:ring-blue-200 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl">
            Load More Gigs
          </button>
        </div>
      )}

      {/* Freelancer Modal */}
      <FreelancerModal
        isOpen={freelancerModal.isOpen}
        onClose={closeFreelancerModal}
        freelancerId={freelancerModal.freelancerId}
      />
    </div>
  );
};

export default BrowseGigs;
