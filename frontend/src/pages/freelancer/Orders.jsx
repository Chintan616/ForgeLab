import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  HiBriefcase, 
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

const FreelancerOrders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      console.log('Fetching orders for freelancer...');
      const response = await api.get('/orders');
      console.log('Orders response:', response);
      const ordersData = response.data.orders || [];
      console.log('Orders data:', ordersData);
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
      case 'delivered':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending':
        return 'Pending';
      case 'delivered':
        return 'Delivered';
      default:
        return status;
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      console.log('Updating order status:', { orderId, newStatus });
      const response = await api.patch(`/orders/${orderId}/status`, { status: newStatus });
      console.log('Status update response:', response);
      toast.success('Order status updated successfully');
      fetchOrders(); // Refresh the orders list
    } catch (error) {
      console.error('Error updating order status:', error);
      console.error('Error response:', error.response);
      const errorMessage = error.response?.data?.message || 'Failed to update order status';
      toast.error(errorMessage);
    }
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
        <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
        <p className="text-gray-600 mt-2">Manage and track all your incoming orders.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <HiBriefcase className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Orders</p>
              <p className="text-2xl font-semibold text-gray-900">{orders.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <HiCurrencyDollar className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Earnings</p>
              <p className="text-2xl font-semibold text-gray-900">
                ${orders.filter(order => order.status === 'delivered').reduce((total, order) => total + (order.price || 0), 0).toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <HiClock className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending Orders</p>
              <p className="text-2xl font-semibold text-gray-900">
                {orders.filter(order => order.status === 'pending').length}
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
              <p className="text-sm font-medium text-gray-600">Delivered</p>
              <p className="text-2xl font-semibold text-gray-900">
                {orders.filter(order => order.status === 'delivered').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <HiCurrencyDollar className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending Earnings</p>
              <p className="text-2xl font-semibold text-gray-900">
                ${orders.filter(order => order.status === 'pending').reduce((total, order) => total + (order.price || 0), 0).toFixed(2)}
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
                ? 'bg-green-100 text-green-700'
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
                    Client
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
                      {/* Client */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm">
                              {order.client?.name?.charAt(0)?.toUpperCase() || 'C'}
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {order.client?.name || 'Unknown Client'}
                            </div>
                            <div className="text-sm text-gray-500">
                              {order.client?.email || 'No email'}
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
                          
                          {/* Status Update Buttons */}
                          {order.status === 'pending' && (
                            <button
                              onClick={() => handleStatusUpdate(order._id, 'delivered')}
                              className="text-green-600 hover:text-green-900 transition-colors"
                              title="Mark as delivered"
                            >
                              <HiCheck className="h-4 w-4" />
                            </button>
                          )}
                          
                          {order.status === 'delivered' && (
                            <button
                              onClick={() => handleStatusUpdate(order._id, 'pending')}
                              className="text-yellow-600 hover:text-yellow-900 transition-colors"
                              title="Mark as pending"
                            >
                              <HiX className="h-4 w-4" />
                            </button>
                          )}
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
          <HiBriefcase className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            {filter === 'all' ? 'No orders yet' : `No ${filter} orders`}
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            {filter === 'all' 
              ? 'You haven\'t received any orders yet. Keep promoting your gigs!'
              : `You don't have any ${filter} orders at the moment.`
            }
          </p>
        </div>
      )}
    </div>
  );
};

export default FreelancerOrders;
