import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  HiSearch, 
  HiShoppingCart, 
  HiCurrencyDollar, 
  HiStar, 
  HiClock,
  HiEye,
  HiTrendingUp,
  HiCalendar,
  HiHeart
} from 'react-icons/hi';
import api from '../../utils/api';
import toast from 'react-hot-toast';

const ClientDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalOrders: 0,
    activeOrders: 0,
    totalSpent: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch client's orders
      const ordersResponse = await api.get('/orders');
      const orders = ordersResponse.data.orders || [];
      
      // Fetch wishlist using dedicated endpoint
      const wishlistResponse = await api.get('/wishlist');
      const wishlistData = wishlistResponse.data || [];
      
      // Calculate stats
      const totalOrders = orders.length;
      const activeOrders = orders.filter(order => 
        ['pending', 'in_progress', 'delivered'].includes(order.status)
      ).length;
      
      // Mock data for now - you can integrate with your backend stats
      setStats({
        totalOrders,
        activeOrders,
        totalSpent: 850
      });
      
      setRecentOrders(orders.slice(0, 3));
      setWishlist(wishlistData.slice(0, 3));
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'delivered':
        return 'bg-purple-100 text-purple-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    return status.replace('_', ' ').charAt(0).toUpperCase() + status.replace('_', ' ').slice(1);
  };

  const removeFromWishlist = async (gigId) => {
    try {
      await api.delete(`/wishlist/${gigId}`);
      setWishlist(wishlist.filter(gig => gig._id !== gigId));
      toast.success('Gig removed from wishlist!');
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      toast.error('Failed to remove gig from wishlist.');
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
        <p className="text-gray-600 mt-2">Track your orders and discover amazing ForgeLab.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <HiShoppingCart className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Orders</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.totalOrders}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <HiClock className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Orders</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.activeOrders}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <HiCurrencyDollar className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Spent</p>
              <p className="text-2xl font-semibold text-gray-900">${stats.totalSpent}</p>
            </div>
          </div>
        </div>
      </div>



      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Orders */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
              <Link
                to="/client/orders"
                className="text-sm text-blue-600 hover:text-blue-500 font-medium"
              >
                View all
              </Link>
            </div>
          </div>
          
          <div className="divide-y divide-gray-200">
            {recentOrders.length > 0 ? (
              recentOrders.map((order) => (
                <div key={order._id} className="px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-medium text-gray-900">
                        {order.gig?.title || 'Gig Title'}
                      </h3>
                      <div className="flex items-center mt-2 space-x-4 text-sm text-gray-500">
                        <span className="flex items-center">
                          <HiCurrencyDollar className="h-4 w-4 mr-1" />
                          ${order.price}
                        </span>
                        <span className="flex items-center">
                          <HiCalendar className="h-4 w-4 mr-1" />
                          {order.deliveryTime} days
                        </span>
                      </div>
                      <div className="mt-2">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                          {getStatusText(order.status)}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Link
                        to="/client/orders"
                        className="p-2 text-gray-400 hover:text-blue-600"
                        title="View all orders"
                      >
                        <HiEye className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="px-6 py-12 text-center">
                <HiShoppingCart className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No orders yet</h3>
                <p className="mt-1 text-sm text-gray-500">Start by browsing available gigs.</p>
                <div className="mt-6">
                  <Link
                    to="/gigs"
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                  >
                    <HiSearch className="h-4 w-4 mr-2" />
                    Browse Gigs
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Wishlist */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Wishlist</h2>
              <Link
                to="/wishlist"
                className="text-sm text-blue-600 hover:text-blue-500 font-medium"
              >
                View all
              </Link>
            </div>
          </div>
          
          <div className="divide-y divide-gray-200">
            {wishlist.length > 0 ? (
              wishlist.map((gig) => (
                <div key={gig._id} className="px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-medium text-gray-900">{gig.title}</h3>
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
                          <HiStar className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                          {gig.averageRating || 0} ({gig.totalRatings || 0})
                        </span>
                      </div>

                    </div>
                    <div className="flex items-center space-x-2">
                      <Link
                        to={`/gigs/${gig._id}`}
                        className="p-2 text-gray-400 hover:text-blue-600"
                      >
                        <HiEye className="h-4 w-4" />
                      </Link>
                      <button
                        onClick={() => removeFromWishlist(gig._id)}
                        className="p-2 text-red-400 hover:text-red-600"
                      >
                        <HiHeart className="h-4 w-4 fill-current" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="px-6 py-12 text-center">
                <HiHeart className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">Wishlist is empty</h3>
                <p className="mt-1 text-sm text-gray-500">Save gigs you like for later.</p>
                <div className="mt-6">
                  <Link
                    to="/gigs"
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                  >
                    <HiSearch className="h-4 w-4 mr-2" />
                    Browse Gigs
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tips Section */}
      <div className="mt-8 bg-blue-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-2">💡 Pro Tips</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Provide clear project requirements to get better proposals</li>
          <li>• Check ForgeLab reviews and portfolios before hiring</li>
          <li>• Communicate regularly throughout the project</li>
          <li>• Leave honest reviews to help the community</li>
        </ul>
      </div>
    </div>
  );
};

export default ClientDashboard;
