import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  HiShoppingCart, 
  HiCurrencyDollar, 
  HiClock, 
  HiStar,
  HiEye,
  HiCalendar,
  HiUser,
  HiCheck,
  HiX
} from 'react-icons/hi';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import FreelancerModal from '../../components/FreelancerModal';

const ClientOrders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [freelancerModal, setFreelancerModal] = useState({ isOpen: false, freelancerId: null });

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      console.log('Fetching orders for client...');
      const response = await api.get('/orders');
      console.log('Orders response:', response);
      const ordersData = response.data.orders || [];
      console.log('Orders data:', ordersData);
      console.log('First order freelancer data:', ordersData[0]?.freelancer);
      setOrders(ordersData);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to fetch orders');
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

  const handleFreelancerClick = (freelancerId) => {
    setFreelancerModal({ isOpen: true, freelancerId });
  };

  const closeFreelancerModal = () => {
    setFreelancerModal({ isOpen: false, freelancerId: null });
  };

  const filteredOrders = orders.filter(order => {
    if (filter === 'all') return true;
    return order.status === filter;
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
            <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
            <p className="text-gray-600 mt-2">Track and manage your orders.</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <HiShoppingCart className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Orders</p>
              <p className="text-2xl font-semibold text-gray-900">{orders.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <HiClock className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-semibold text-gray-900">
                {orders.filter(order => order.status === 'pending').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <HiCheck className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Delivered</p>
              <p className="text-2xl font-semibold text-gray-900">
                {orders.filter(order => order.status === 'delivered').length}
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
            All ({orders.length})
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-3 py-1 rounded-md text-sm font-medium ${
              filter === 'pending'
                ? 'bg-yellow-100 text-yellow-700'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Pending ({orders.filter(order => order.status === 'pending').length})
          </button>
          <button
            onClick={() => setFilter('delivered')}
            className={`px-3 py-1 rounded-md text-sm font-medium ${
              filter === 'delivered'
                ? 'bg-purple-100 text-purple-700'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Delivered ({orders.filter(order => order.status === 'delivered').length})
          </button>
        </div>
      </div>

      {/* Orders Table */}
      {filteredOrders.length > 0 ? (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-auto max-h-96">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50 sticky top-0 z-10">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Freelancer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Service Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Delivery Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredOrders.map((order) => {
                  const orderDate = new Date(order.createdAt);
                  const deliveryDate = new Date(orderDate.getTime() + (order.deliveryTime * 24 * 60 * 60 * 1000));
                  const isOverdue = deliveryDate < new Date() && order.status === 'pending';
                  
                  return (
                    <tr key={order._id} className="hover:bg-gray-50">
                      {/* Freelancer */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-gradient-to-r from-green-500 to-blue-600 flex items-center justify-center text-white font-semibold text-sm">
                              {(order.freelancer?.name || order.gig?.freelancer?.name || 'F').charAt(0).toUpperCase()}
                            </div>
                          </div>
                          <div className="ml-4">
                            <button
                              onClick={() => handleFreelancerClick(order.freelancer?._id || order.gig?.freelancer?._id)}
                              className="text-sm font-medium text-gray-900 hover:text-blue-600 hover:underline cursor-pointer text-left"
                            >
                              {order.freelancer?.name || order.gig?.freelancer?.name || 'Unknown Freelancer'}
                            </button>
                            <div className="text-sm text-gray-500">
                              {order.freelancer?.email || order.gig?.freelancer?.email || 'No email'}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Service Title */}
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">
                          {order.gig?.title || 'Gig Title Not Available'}
                        </div>
                        <div className="text-sm text-gray-500">
                          {order.gig?.category || 'No category'}
                        </div>
                      </td>

                      {/* Order Date */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {orderDate.toLocaleDateString('en-US', { 
                          day: 'numeric', 
                          month: 'long', 
                          year: 'numeric' 
                        })}
                      </td>

                      {/* Delivery Date */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <span className={`text-sm ${isOverdue ? 'text-red-600' : 'text-gray-900'}`}>
                            {deliveryDate.toLocaleDateString('en-US', { 
                              day: 'numeric', 
                              month: 'long', 
                              year: 'numeric' 
                            })}
                          </span>
                          {isOverdue && (
                            <HiClock className="ml-2 h-4 w-4 text-red-500" title="Overdue" />
                          )}
                        </div>
                      </td>

                      {/* Amount */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        ${order.price?.toFixed(2) || '0.00'}
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                          {getStatusText(order.status)}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <Link
                            to={`/gigs/${order.gig?._id}`}
                            className="text-blue-600 hover:text-blue-900 transition-colors"
                            title="View gig"
                          >
                            <HiEye className="h-4 w-4" />
                          </Link>
                          
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <HiShoppingCart className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            {filter === 'all' ? 'No orders yet' : `No ${filter} orders`}
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            {filter === 'all' 
              ? 'Start by browsing available gigs and placing your first order.'
              : `You don't have any ${filter} orders at the moment.`
            }
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

      {/* Freelancer Modal */}
      <FreelancerModal
        isOpen={freelancerModal.isOpen}
        onClose={closeFreelancerModal}
        freelancerId={freelancerModal.freelancerId}
      />
    </div>
  );
};

export default ClientOrders;
