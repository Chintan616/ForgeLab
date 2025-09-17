import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  HiPlus, 
  HiBriefcase, 
  HiStar, 
  HiEye, 
  HiPencil, 
  HiTrash,
  HiCurrencyDollar,
  HiClock,
  HiTrendingUp
} from 'react-icons/hi';
import api from '../../utils/api';
import toast from 'react-hot-toast';

const ForgeLabGigs = () => {
  const { user } = useAuth();
  const [gigs, setGigs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, active, inactive

  useEffect(() => {
    fetchGigs();
  }, []);

  const fetchGigs = async () => {
    try {
      console.log('Fetching gigs for ForgeLab...');
      const response = await api.get('/gigs/freelancer');
      console.log('Gigs response:', response);
      const gigsData = response.data.gigs || response.data || [];
      console.log('Gigs data:', gigsData);
      setGigs(gigsData);
    } catch (error) {
      console.error('Error fetching gigs:', error);
      toast.error('Failed to fetch gigs');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteGig = async (gigId) => {
    if (window.confirm('Are you sure you want to delete this gig? This action cannot be undone.')) {
      try {
        const response = await api.delete(`/gigs/${gigId}`);
        toast.success(response.data?.message || 'Gig deleted successfully');
        fetchGigs(); // Refresh the list
      } catch (error) {
        console.error('Error deleting gig:', error);
        const message = error.response?.data?.message || 'Failed to delete gig';
        toast.error(message);
      }
    }
  };

  const handleToggleStatus = async (gigId, currentStatus) => {
    try {
      const newStatus = currentStatus ? false : true;
      const response = await api.patch(`/gigs/${gigId}/toggle-status`);
      toast.success(response.data?.message || `Gig ${newStatus ? 'activated' : 'deactivated'} successfully`);
      fetchGigs(); // Refresh the list
    } catch (error) {
      console.error('Error toggling gig status:', error);
      const message = error.response?.data?.message || 'Failed to update gig status';
      toast.error(message);
    }
  };

  const filteredGigs = gigs.filter(gig => {
    if (filter === 'active') return gig.isActive !== false;
    if (filter === 'inactive') return gig.isActive === false;
    return true;
  });

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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Gigs</h1>
            <p className="text-gray-600 mt-2">Manage your service offerings and track their performance.</p>
          </div>
          <Link
            to="/freelancer/gigs/create"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            <HiPlus className="h-4 w-4 mr-2" />
            Create New Gig
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <HiBriefcase className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Gigs</p>
              <p className="text-2xl font-semibold text-gray-900">{gigs.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <HiEye className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Gigs</p>
              <p className="text-2xl font-semibold text-gray-900">
                {gigs.filter(gig => gig.isActive !== false).length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <HiCurrencyDollar className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Views</p>
              <p className="text-2xl font-semibold text-gray-900">
                {gigs.reduce((total, gig) => total + (gig.views || 0), 0)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <HiStar className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Avg Rating</p>
              <p className="text-2xl font-semibold text-gray-900">
                {gigs.length > 0 
                  ? (() => {
                      const gigsWithRatings = gigs.filter(gig => gig.averageRating > 0);
                      return gigsWithRatings.length > 0 
                        ? (gigsWithRatings.reduce((total, gig) => total + gig.averageRating, 0) / gigsWithRatings.length).toFixed(1)
                        : '0.0';
                    })()
                  : '0.0'
                }
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <HiTrendingUp className="h-6 w-6 text-indigo-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Ratings</p>
              <p className="text-2xl font-semibold text-gray-900">
                {gigs.reduce((total, gig) => total + (gig.totalRatings || 0), 0)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <div className="flex items-center space-x-4">
          <span className="text-sm font-medium text-gray-700">Filter by:</span>
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1 rounded-md text-sm font-medium ${
              filter === 'all'
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            All ({gigs.length})
          </button>
          <button
            onClick={() => setFilter('active')}
            className={`px-3 py-1 rounded-md text-sm font-medium ${
              filter === 'active'
                ? 'bg-green-100 text-green-700'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Active ({gigs.filter(gig => gig.isActive !== false).length})
          </button>
          <button
            onClick={() => setFilter('inactive')}
            className={`px-3 py-1 rounded-md text-sm font-medium ${
              filter === 'inactive'
                ? 'bg-gray-100 text-gray-700'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Inactive ({gigs.filter(gig => gig.isActive === false).length})
          </button>
        </div>
      </div>

      {/* Gigs Cards Grid */}
      {filteredGigs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGigs.map((gig) => (
            <div key={gig._id} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
              <div className="p-6">
                {/* Header with title and status */}
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 flex-1 mr-3">{gig.title}</h3>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium flex-shrink-0 ${
                    gig.isActive !== false
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {gig.isActive !== false ? 'Active' : 'Inactive'}
                  </span>
                </div>
                
                {/* Description */}
                <p className="text-gray-600 mb-4 line-clamp-3 text-sm">{gig.description}</p>
                
                {/* Gig Image */}
                {gig.images && gig.images.length > 0 && (
                  <div className="mb-4">
                    <div className="aspect-video rounded-lg overflow-hidden bg-gray-100">
                      <img
                        src={gig.images[0].startsWith('http') ? gig.images[0] : `http://localhost:5001${gig.images[0]}`}
                        alt={gig.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          console.error('Image failed to load:', e.target.src);
                          e.target.style.display = 'none';
                        }}
                      />
                    </div>
                  </div>
                )}
                
                {/* Gig Details */}
                <div className="grid grid-cols-2 gap-3 mb-4 text-sm text-gray-500">
                  <div className="flex items-center">
                    <HiCurrencyDollar className="h-4 w-4 mr-1" />
                    <span>${gig.price}</span>
                  </div>
                  <div className="flex items-center">
                    <HiClock className="h-4 w-4 mr-1" />
                    <span>{gig.deliveryTime} days</span>
                  </div>
                  <div className="flex items-center">
                    <HiEye className="h-4 w-4 mr-1" />
                    <span>{gig.views || 0} views</span>
                  </div>
                  <div className="flex items-center">
                    <HiStar className="h-4 w-4 mr-1" />
                    <span>{gig.averageRating || 0} rating</span>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1 mb-4">
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
                      +{gig.tags.length - 3}
                    </span>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex items-center space-x-1">
                    <Link
                      to={`/gigs/${gig._id}`}
                      className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                      title="View gig"
                    >
                      <HiEye className="h-4 w-4" />
                    </Link>
                    
                    <Link
                      to={`/freelancer/gigs/edit/${gig._id}`}
                      className="p-2 text-gray-400 hover:text-green-600 transition-colors"
                      title="Edit gig"
                    >
                      <HiPencil className="h-4 w-4" />
                    </Link>
                    
                    <button
                      onClick={() => handleToggleStatus(gig._id, gig.isActive)}
                      className={`p-2 transition-colors ${
                        gig.isActive !== false
                          ? 'text-green-400 hover:text-green-600'
                          : 'text-gray-400 hover:text-green-600'
                      }`}
                      title={gig.isActive !== false ? 'Deactivate gig' : 'Activate gig'}
                    >
                      <HiBriefcase className="h-4 w-4" />
                    </button>
                    
                    <button
                      onClick={() => handleDeleteGig(gig._id)}
                      className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                      title="Delete gig"
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
          <HiBriefcase className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            {filter === 'all' ? 'No gigs yet' : `No ${filter} gigs`}
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            {filter === 'all' 
              ? 'Get started by creating your first gig to showcase your skills.'
              : `You don't have any ${filter} gigs at the moment.`
            }
          </p>
          <div className="mt-6">
            <Link
              to="/freelancer/gigs/create"
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              <HiPlus className="h-4 w-4 mr-2" />
              Create Your First Gig
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default ForgeLabGigs;
