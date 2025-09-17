import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { HiUser, HiMail, HiLocationMarker, HiBriefcase, HiStar, HiPencil, HiCheckCircle, HiX } from 'react-icons/hi';
import axios from 'axios';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
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
    }
  }, [user]);

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
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
            <p className="text-gray-600 mt-2">Manage your account settings and profile information.</p>
          </div>
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              <HiPencil className="h-4 w-4 mr-2" />
              Edit Profile
            </button>
          ) : (
            <div className="flex space-x-3">
              <button
                onClick={handleCancel}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                <HiX className="h-4 w-4 mr-2" />
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
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
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <HiUser className="h-4 w-4 inline mr-2" />
                Full Name
              </label>
              {isEditing ? (
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your full name"
                />
              ) : (
                <p className="text-gray-900">{user.name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <HiMail className="h-4 w-4 inline mr-2" />
                Email Address
              </label>
              <p className="text-gray-900">{user.email}</p>
              <p className="text-sm text-gray-500 mt-1">Email cannot be changed</p>
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <HiBriefcase className="h-4 w-4 inline mr-2" />
              Role
            </label>
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
              user.role === 'freelancer' 
                ? 'bg-blue-100 text-blue-800' 
                : 'bg-green-100 text-green-800'
            }`}>
              {user.role === 'freelancer' ? 'Freelancer' : 'Client'}
            </span>
          </div>
        </div>

        {/* Profile Details */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Profile Details</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <HiLocationMarker className="h-4 w-4 inline mr-2" />
                Location
              </label>
              {isEditing ? (
                <input
                  type="text"
                  name="profile.location"
                  value={formData.profile.location}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your location"
                />
              ) : (
                <p className="text-gray-900">{user.profile?.location || 'Not specified'}</p>
              )}
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bio
            </label>
            {isEditing ? (
              <textarea
                name="profile.bio"
                value={formData.profile.bio}
                onChange={handleChange}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Tell us about yourself..."
              />
            ) : (
              <p className="text-gray-900">{user.profile?.bio || 'No bio added yet.'}</p>
            )}
          </div>
        </div>

        {/* Skills */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Skills</h2>
          
          <div className="flex flex-wrap gap-2 mb-4">
            {formData.profile.skills.map((skill, index) => (
              <span
                key={index}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
              >
                {skill}
                {isEditing && (
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(skill)}
                    className="ml-2 inline-flex items-center justify-center w-4 h-4 rounded-full text-blue-400 hover:bg-blue-200 hover:text-blue-500"
                  >
                    <HiX className="w-3 h-3" />
                  </button>
                )}
              </span>
            ))}
          </div>

          {isEditing && (
            <div className="flex gap-2">
              <input
                type="text"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Add a skill..."
              />
              <button
                type="button"
                onClick={handleAddSkill}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Add
              </button>
            </div>
          )}
        </div>

        {/* Portfolio */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Portfolio</h2>
          
          <div className="space-y-2 mb-4">
            {formData.profile.portfolio.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                <span className="text-gray-900">{item}</span>
                {isEditing && (
                  <button
                    type="button"
                    onClick={() => handleRemovePortfolio(item)}
                    className="text-red-400 hover:text-red-600"
                  >
                    <HiX className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>

          {isEditing && (
            <div className="flex gap-2">
              <input
                type="text"
                value={newPortfolio}
                onChange={(e) => setNewPortfolio(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddPortfolio())}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Add portfolio item..."
              />
              <button
                type="button"
                onClick={handleAddPortfolio}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Add
              </button>
            </div>
          )}
        </div>

        {/* Account Statistics */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Account Statistics</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {user.role === 'freelancer' ? '0' : '0'}
              </div>
              <p className="text-sm text-gray-600">
                {user.role === 'freelancer' ? 'Gigs Created' : 'Orders Placed'}
              </p>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {user.role === 'freelancer' ? '0' : '0'}
              </div>
              <p className="text-sm text-gray-600">
                {user.role === 'freelancer' ? 'Completed Orders' : 'Completed Orders'}
              </p>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {user.role === 'freelancer' ? '0' : '0'}
              </div>
              <p className="text-sm text-gray-600">
                {user.role === 'freelancer' ? 'Total Earnings' : 'Total Spent'}
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Profile;
