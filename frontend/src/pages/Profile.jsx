import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { HiUser, HiMail, HiLocationMarker, HiBriefcase, HiStar, HiPencil, HiCheckCircle, HiX } from 'react-icons/hi';
import api from '../utils/api';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [statsLoading, setStatsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalGigs: 0,
    totalOrders: 0,
    completedOrders: 0,
    totalEarnings: 0,
    totalSpent: 0
  });
  const [formData, setFormData] = useState({
    name: '',
    profile: {
      bio: '',
      location: '',
      skills: [],
      portfolio: []
    }
  });
  const [newSkill, setNewSkill] = useState('');
  const [newPortfolio, setNewPortfolio] = useState('');

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        profile: {
          bio: user.profile?.bio || '',
          location: user.profile?.location || '',
          skills: user.profile?.skills || [],
          portfolio: user.profile?.portfolio || []
        }
      });
      fetchUserStats();
    }
  }, [user]);

  const fetchUserStats = async () => {
    try {
      setStatsLoading(true);
      
      if (user?.role === 'freelancer') {
        // Fetch freelancer's gigs and orders
        const [gigsResponse, ordersResponse] = await Promise.all([
          api.get('/gigs/freelancer'),
          api.get('/orders')
        ]);
        
        const gigs = gigsResponse.data || [];
        const orders = ordersResponse.data.orders || [];
        
        // Calculate freelancer stats
        const totalGigs = gigs.length;
        const totalOrders = orders.length;
        const completedOrders = orders.filter(order => order.status === 'delivered').length;
        const totalEarnings = orders
          .filter(order => order.status === 'delivered')
          .reduce((sum, order) => sum + (order.price || 0), 0);
        
        setStats({
          totalGigs,
          totalOrders,
          completedOrders,
          totalEarnings,
          totalSpent: 0 // Freelancers don't spend, they earn
        });
        
      } else if (user?.role === 'client') {
        // Fetch client's orders
        const ordersResponse = await api.get('/orders');
        const orders = ordersResponse.data.orders || [];
        
        // Calculate client stats
        const totalOrders = orders.length;
        const completedOrders = orders.filter(order => order.status === 'delivered').length;
        const totalSpent = orders
          .filter(order => order.status === 'delivered')
          .reduce((sum, order) => sum + (order.price || 0), 0);
        
        setStats({
          totalGigs: 0, // Clients don't create gigs
          totalOrders,
          completedOrders,
          totalEarnings: 0, // Clients don't earn, they spend
          totalSpent
        });
      }
      
    } catch (error) {
      console.error('Error fetching user stats:', error);
      toast.error('Failed to load statistics');
    } finally {
      setStatsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleAddSkill = () => {
    if (newSkill.trim() && !formData.profile.skills.includes(newSkill.trim())) {
      setFormData(prev => ({
        ...prev,
        profile: {
          ...prev.profile,
          skills: [...prev.profile.skills, newSkill.trim()]
        }
      }));
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setFormData(prev => ({
      ...prev,
      profile: {
        ...prev.profile,
        skills: prev.profile.skills.filter(skill => skill !== skillToRemove)
      }
    }));
  };

  const handleAddPortfolio = () => {
    if (newPortfolio.trim() && !formData.profile.portfolio.includes(newPortfolio.trim())) {
      setFormData(prev => ({
        ...prev,
        profile: {
          ...prev.profile,
          portfolio: [...prev.profile.portfolio, newPortfolio.trim()]
        }
      }));
      setNewPortfolio('');
    }
  };

  const handleRemovePortfolio = (portfolioToRemove) => {
    setFormData(prev => ({
      ...prev,
      profile: {
        ...prev.profile,
        portfolio: prev.profile.portfolio.filter(item => item !== portfolioToRemove)
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await updateProfile(formData);
      if (result.success) {
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Profile update error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user.name || '',
      profile: {
        bio: user.profile?.bio || '',
        location: user.profile?.location || '',
        skills: user.profile?.skills || [],
        portfolio: user.profile?.portfolio || []
      }
    });
    setIsEditing(false);
  };

  if (!user) {
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
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Profile Settings
            </h1>
            <p className="text-gray-600 mt-2">Manage your account settings and profile information.</p>
          </div>
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-4 focus:ring-blue-200 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <HiPencil className="h-4 w-4 mr-2" />
              Edit Profile
            </button>
          ) : (
            <div className="flex space-x-3">
              <button
                onClick={handleCancel}
                className="inline-flex items-center px-6 py-3 border border-gray-300 text-sm font-medium rounded-xl text-gray-700 bg-white hover:bg-gray-50 transition-all duration-200 hover:shadow-md"
              >
                <HiX className="h-4 w-4 mr-2" />
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white font-semibold rounded-xl hover:from-green-700 hover:to-blue-700 focus:outline-none focus:ring-4 focus:ring-green-200 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:transform-none"
              >
                <HiCheckCircle className="h-4 w-4 mr-2" />
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          )}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <div className="bg-white/95 backdrop-blur-sm shadow-xl rounded-2xl p-8 border border-gray-200/50">
          <div className="flex items-center mb-6">
            <div className="p-3 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl mr-4">
              <HiUser className="h-6 w-6 text-blue-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Basic Information</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg mr-3">
                    <HiUser className="h-4 w-4 text-blue-600" />
                  </div>
                  Full Name
                </div>
              </label>
              {isEditing ? (
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all duration-200 bg-white/50 backdrop-blur-sm"
                  placeholder="Enter your full name"
                />
              ) : (
                <div className="px-4 py-3 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl border border-gray-200">
                  <p className="text-gray-900 font-medium">{user.name}</p>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg mr-3">
                    <HiMail className="h-4 w-4 text-green-600" />
                  </div>
                  Email Address
                </div>
              </label>
              <div className="px-4 py-3 bg-gradient-to-r from-gray-50 to-green-50 rounded-xl border border-gray-200">
                <p className="text-gray-900 font-medium">{user.email}</p>
                <p className="text-sm text-gray-500 mt-1">Email cannot be changed</p>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg mr-3">
                  <HiBriefcase className="h-4 w-4 text-purple-600" />
                </div>
                Account Role
              </div>
            </label>
            <span className={`inline-flex items-center px-4 py-2 rounded-xl text-sm font-semibold shadow-md ${
              user.role === 'freelancer' 
                ? 'bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 border border-blue-200' 
                : 'bg-gradient-to-r from-green-100 to-blue-100 text-green-800 border border-green-200'
            }`}>
              {user.role === 'freelancer' ? '🎨 Freelancer' : '👤 Client'}
            </span>
          </div>
        </div>

        {/* Profile Details */}
        <div className="bg-white/95 backdrop-blur-sm shadow-xl rounded-2xl p-8 border border-gray-200/50">
          <div className="flex items-center mb-6">
            <div className="p-3 bg-gradient-to-br from-green-100 to-blue-100 rounded-xl mr-4">
              <HiLocationMarker className="h-6 w-6 text-green-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Profile Details</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                <div className="flex items-center">
                  <div className="p-2 bg-orange-100 rounded-lg mr-3">
                    <HiLocationMarker className="h-4 w-4 text-orange-600" />
                  </div>
                  Location
                </div>
              </label>
              {isEditing ? (
                <input
                  type="text"
                  name="profile.location"
                  value={formData.profile.location}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-orange-200 focus:border-orange-500 transition-all duration-200 bg-white/50 backdrop-blur-sm"
                  placeholder="Enter your location"
                />
              ) : (
                <div className="px-4 py-3 bg-gradient-to-r from-gray-50 to-orange-50 rounded-xl border border-gray-200">
                  <p className="text-gray-900 font-medium">{user.profile?.location || 'Not specified'}</p>
                </div>
              )}
            </div>
          </div>

          <div className="mt-8">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              <div className="flex items-center">
                <div className="p-2 bg-indigo-100 rounded-lg mr-3">
                  <HiUser className="h-4 w-4 text-indigo-600" />
                </div>
                Bio
              </div>
            </label>
            {isEditing ? (
              <textarea
                name="profile.bio"
                value={formData.profile.bio}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-indigo-200 focus:border-indigo-500 transition-all duration-200 bg-white/50 backdrop-blur-sm resize-none"
                placeholder="Tell us about yourself..."
              />
            ) : (
              <div className="px-4 py-3 bg-gradient-to-r from-gray-50 to-indigo-50 rounded-xl border border-gray-200 min-h-[100px]">
                <p className="text-gray-900 font-medium">{user.profile?.bio || 'No bio added yet.'}</p>
              </div>
            )}
          </div>
        </div>

        {/* Skills */}
        <div className="bg-white/95 backdrop-blur-sm shadow-xl rounded-2xl p-8 border border-gray-200/50">
          <div className="flex items-center mb-6">
            <div className="p-3 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl mr-4">
              <HiStar className="h-6 w-6 text-purple-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Skills & Expertise</h2>
          </div>
          
          <div className="flex flex-wrap gap-3 mb-6">
            {formData.profile.skills.map((skill, index) => (
              <span
                key={index}
                className="inline-flex items-center px-4 py-2 rounded-xl text-sm font-semibold bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 border border-purple-200 shadow-sm hover:shadow-md transition-all duration-200"
              >
                {skill}
                {isEditing && (
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(skill)}
                    className="ml-2 inline-flex items-center justify-center w-5 h-5 rounded-full text-purple-400 hover:bg-purple-200 hover:text-purple-600 transition-all duration-200"
                  >
                    <HiX className="w-3 h-3" />
                  </button>
                )}
              </span>
            ))}
          </div>

          {isEditing && (
            <div className="flex gap-3">
              <input
                type="text"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-200 focus:border-purple-500 transition-all duration-200 bg-white/50 backdrop-blur-sm"
                placeholder="Add a skill..."
              />
              <button
                type="button"
                onClick={handleAddSkill}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-4 focus:ring-purple-200 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Add
              </button>
            </div>
          )}
        </div>

        {/* Portfolio */}
        <div className="bg-white/95 backdrop-blur-sm shadow-xl rounded-2xl p-8 border border-gray-200/50">
          <div className="flex items-center mb-6">
            <div className="p-3 bg-gradient-to-br from-indigo-100 to-blue-100 rounded-xl mr-4">
              <HiBriefcase className="h-6 w-6 text-indigo-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Portfolio & Work</h2>
          </div>
          
          <div className="space-y-3 mb-6">
            {formData.profile.portfolio.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-indigo-50 rounded-xl border border-gray-200 hover:shadow-md transition-all duration-200">
                <span className="text-gray-900 font-medium">{item}</span>
                {isEditing && (
                  <button
                    type="button"
                    onClick={() => handleRemovePortfolio(item)}
                    className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                  >
                    <HiX className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>

          {isEditing && (
            <div className="flex gap-3">
              <input
                type="text"
                value={newPortfolio}
                onChange={(e) => setNewPortfolio(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddPortfolio())}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-indigo-200 focus:border-indigo-500 transition-all duration-200 bg-white/50 backdrop-blur-sm"
                placeholder="Add portfolio item..."
              />
              <button
                type="button"
                onClick={handleAddPortfolio}
                className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-semibold rounded-xl hover:from-indigo-700 hover:to-blue-700 focus:outline-none focus:ring-4 focus:ring-indigo-200 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Add
              </button>
            </div>
          )}
        </div>

        {/* Account Statistics */}
        <div className="bg-white/95 backdrop-blur-sm shadow-xl rounded-2xl p-8 border border-gray-200/50">
          <div className="flex items-center mb-6">
            <div className="p-3 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-xl mr-4">
              <HiStar className="h-6 w-6 text-yellow-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Account Statistics</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl border border-blue-200 hover:shadow-lg transition-all duration-200">
              <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                {statsLoading ? (
                  <div className="animate-pulse bg-gray-300 h-8 w-16 rounded mx-auto"></div>
                ) : (
                  user.role === 'freelancer' ? stats.totalGigs : stats.totalOrders
                )}
              </div>
              <p className="text-sm font-semibold text-gray-700">
                {user.role === 'freelancer' ? '🎨 Gigs Created' : '📦 Orders Placed'}
              </p>
            </div>
            
            <div className="text-center p-6 bg-gradient-to-br from-green-50 to-blue-50 rounded-xl border border-green-200 hover:shadow-lg transition-all duration-200">
              <div className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-2">
                {statsLoading ? (
                  <div className="animate-pulse bg-gray-300 h-8 w-16 rounded mx-auto"></div>
                ) : (
                  stats.completedOrders
                )}
              </div>
              <p className="text-sm font-semibold text-gray-700">
                ✅ Completed Orders
              </p>
            </div>
            
            <div className="text-center p-6 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl border border-yellow-200 hover:shadow-lg transition-all duration-200">
              <div className="text-3xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent mb-2">
                {statsLoading ? (
                  <div className="animate-pulse bg-gray-300 h-8 w-20 rounded mx-auto"></div>
                ) : (
                  user.role === 'freelancer' ? `$${stats.totalEarnings}` : `$${stats.totalSpent}`
                )}
              </div>
              <p className="text-sm font-semibold text-gray-700">
                {user.role === 'freelancer' ? '💰 Total Earnings' : '💸 Total Spent'}
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Profile;
