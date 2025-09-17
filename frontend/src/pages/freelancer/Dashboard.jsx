import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  HiPlus, 
  HiBriefcase, 
  HiCurrencyDollar, 
  HiStar, 
  HiEye, 
  HiPencil, 
  HiTrash,
  HiTrendingUp,
  HiCalendar
} from 'react-icons/hi';
import api from '../../utils/api';

const ForgeLabDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalGigs: 0,
    activeGigs: 0,
    totalEarnings: 0,
    totalOrders: 0,
    averageRating: 0
  });
  const [recentGigs, setRecentGigs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      console.log('Fetching dashboard data...');
      console.log('Current user:', user);
      console.log('User ID:', user?._id);
      
      // Fetch freelancer's gigs
      const gigsResponse = await api.get('/gigs/freelancer');
      console.log('Gigs response:', gigsResponse);
      const gigs = gigsResponse.data || [];
      console.log('Gigs data:', gigs);
      
      // Calculate stats
      const totalGigs = gigs.length;
      const activeGigs = gigs.filter(gig => gig.isActive !== false).length;
      const totalViews = gigs.reduce((sum, gig) => sum + (gig.views || 0), 0);
      
      // Calculate average rating from all gigs
      const gigsWithRatings = gigs.filter(gig => gig.averageRating > 0);
      const averageRating = gigsWithRatings.length > 0 
        ? gigsWithRatings.reduce((sum, gig) => sum + gig.averageRating, 0) / gigsWithRatings.length
        : 0;
      
      // Mock data for now - you can integrate with your backend stats
      setStats({
        totalGigs,
        activeGigs,
        totalEarnings: 1250,
        totalOrders: 8,
        averageRating: Math.round(averageRating * 10) / 10,
        totalViews
      });
      
      setRecentGigs(gigs.slice(0, 5));
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteGig = async (gigId) => {
    if (window.confirm('Are you sure you want to delete this gig?')) {
          try {
      await api.delete(`/gigs/${gigId}`);
      fetchDashboardData(); // Refresh data
    } catch (error) {
      console.error('Error deleting gig:', error);
    }
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
        <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user?.name}!</h1>
        <p className="text-gray-600 mt-2">Here's what's happening with your freelance business today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <HiBriefcase className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Gigs</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.totalGigs}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <HiTrendingUp className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Gigs</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.activeGigs}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <HiCurrencyDollar className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Earnings</p>
              <p className="text-2xl font-semibold text-gray-900">${stats.totalEarnings}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <HiStar className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Average Rating</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.averageRating}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <HiEye className="h-6 w-6 text-indigo-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Views</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.totalViews}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions - Removed buttons as requested */}
      {/* <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-4">
          <Link
            to="/freelancer/gigs/create"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            <HiPlus className="h-4 w-4 mr-2" />
            Create New Gig
          </Link>
          <Link
            to="/freelancer/gigs"
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            <HiBriefcase className="h-4 w-4 mr-2" />
            Manage Gigs
          </Link>
          <Link
            to="/profile"
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            <HiPencil className="h-4 w-4 mr-2" />
            Update Profile
          </Link>
        </div>
      </div> */}

      {/* Recent Gigs */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Recent Gigs</h2>
            <Link
              to="/freelancer/gigs"
              className="text-sm text-blue-600 hover:text-blue-500 font-medium"
            >
              View all
            </Link>
          </div>
        </div>
        
        <div className="divide-y divide-gray-200">
          {recentGigs.length > 0 ? (
            recentGigs.map((gig) => (
              <div key={gig._id} className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-gray-900">{gig.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{gig.description.substring(0, 100)}...</p>
                    <div className="flex items-center mt-2 space-x-4 text-sm text-gray-500">
                      <span className="flex items-center">
                        <HiCurrencyDollar className="h-4 w-4 mr-1" />
                        ${gig.price}
                      </span>
                      <span className="flex items-center">
                        <HiCalendar className="h-4 w-4 mr-1" />
                        {gig.deliveryTime} days
                      </span>
                      <span className="flex items-center">
                        <HiEye className="h-4 w-4 mr-1" />
                        {gig.views || 0} views
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Link
                      to={`/freelancer/gigs/edit/${gig._id}`}
                      className="p-2 text-gray-400 hover:text-blue-600"
                    >
                      <HiPencil className="h-4 w-4" />
                    </Link>
                    <button
                      onClick={() => handleDeleteGig(gig._id)}
                      className="p-2 text-gray-400 hover:text-red-600"
                    >
                      <HiTrash className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="px-6 py-12 text-center">
              <HiBriefcase className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No gigs yet</h3>
              <p className="mt-1 text-sm text-gray-500">Get started by creating your first gig.</p>
              <div className="mt-6">
                <Link
                  to="/freelancer/gigs/create"
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  <HiPlus className="h-4 w-4 mr-2" />
                  Create Gig
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Tips Section */}
      <div className="mt-8 bg-blue-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-2">💡 Pro Tips</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Use high-quality images and detailed descriptions for your gigs</li>
          <li>• Respond quickly to client inquiries to increase your chances of getting hired</li>
          <li>• Set competitive pricing based on your skills and market rates</li>
          <li>• Keep your portfolio updated with your latest work</li>
        </ul>
      </div>
    </div>
  );
};

export default ForgeLabDashboard;
