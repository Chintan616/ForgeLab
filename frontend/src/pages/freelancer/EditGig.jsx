import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { HiPlus, HiX } from 'react-icons/hi';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import ImageUpload from '../../components/ImageUpload';

const EditGig = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    price: '',
    deliveryTime: '',
    tags: [],
    images: []
  });
  const [errors, setErrors] = useState({});
  const [newTag, setNewTag] = useState('');

  const categories = [
    'Web Development',
    'Mobile App Development',
    'Graphic Design',
    'Content Writing & Copywriting',
    'Digital Marketing & SEO',
    'Video Editing & Animation',
    'UI/UX Design',
    'Data Science & Machine Learning',
    'Business & Finance Consulting',
    'Virtual Assistance & Admin Support',
    'Other'
  ];

  useEffect(() => {
    fetchGig();
  }, [id]);

  const fetchGig = async () => {
    try {
      console.log('Fetching gig with ID:', id);
      console.log('Current user:', user);
      
      const response = await api.get(`/gigs/${id}`);
      const gig = response.data;
      console.log('Fetched gig:', gig);
      
      // Check if user owns this gig
      // Handle both populated freelancer object and string ID
      const gigFreelancerId = gig.freelancer._id || gig.freelancer;
      if (gigFreelancerId !== user._id) {
        console.log('User does not own this gig. Gig freelancer ID:', gigFreelancerId, 'User ID:', user._id);
        console.log('Gig freelancer object:', gig.freelancer);
        toast.error('You can only edit your own gigs');
        navigate('/freelancer/gigs');
        return;
      }

      setFormData({
        title: gig.title || '',
        description: gig.description || '',
        category: gig.category || '',
        price: gig.price || '',
        deliveryTime: gig.deliveryTime || '',
        tags: gig.tags || []
      });
    } catch (error) {
      console.error('Error fetching gig:', error);
      toast.error('Failed to fetch gig');
      navigate('/freelancer/gigs');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };



  const validateForm = () => {
    console.log('Validating edit form data:', formData);
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.length < 10) {
      newErrors.title = 'Title must be at least 10 characters';
    } else if (formData.title.length > 100) {
      newErrors.title = 'Title must be less than 100 characters';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.length < 50) {
      newErrors.description = 'Description must be at least 50 characters';
    } else if (formData.description.length > 2000) {
      newErrors.description = 'Description must be less than 2000 characters';
    }

    if (!formData.category) {
      newErrors.category = 'Category is required';
    }

    if (!formData.price) {
      newErrors.price = 'Price is required';
    } else if (isNaN(formData.price) || parseFloat(formData.price) <= 0) {
      newErrors.price = 'Price must be a positive number';
    } else if (parseFloat(formData.price) > 10000) {
      newErrors.price = 'Price must be less than $10,000';
    }

    if (!formData.deliveryTime) {
      newErrors.deliveryTime = 'Delivery time is required';
    } else if (isNaN(formData.deliveryTime) || parseInt(formData.deliveryTime) <= 0) {
      newErrors.deliveryTime = 'Delivery time must be a positive number';
    } else if (parseInt(formData.deliveryTime) > 365) {
      newErrors.deliveryTime = 'Delivery time must be less than 365 days';
    }

    if (formData.tags.length > 10) {
      newErrors.tags = 'Maximum 10 tags allowed';
    }
    // Make tags optional for now to help with debugging

    setErrors(newErrors);
    const isValid = Object.keys(newErrors).length === 0;
    console.log('Edit validation result:', isValid, 'Errors:', newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Edit form submitted, validating...');
    console.log('Current user:', user);
    console.log('Gig ID:', id);
    
    if (!user) {
      console.log('No user found, redirecting to login');
      toast.error('Please log in to edit a gig');
      navigate('/login');
      return;
    }
    
    if (!validateForm()) {
      console.log('Edit validation failed, errors:', errors);
      return;
    }

    console.log('Edit validation passed, submitting gig data:', formData);
    setSaving(true);

    try {
      const gigData = {
        ...formData,
        price: parseFloat(formData.price),
        deliveryTime: parseInt(formData.deliveryTime)
      };

      console.log('Making API call to update gig:', id, 'with data:', gigData);
      const response = await api.put(`/gigs/${id}`, gigData);
      console.log('Edit API response:', response);
      toast.success('Gig updated successfully!');
      navigate('/freelancer/gigs');
    } catch (error) {
      console.error('Gig update error:', error);
      let message = 'Failed to update gig';
      
      if (error.response?.data?.message) {
        message = error.response.data.message;
      } else if (error.response?.data?.details) {
        message = `Validation error: ${error.response.data.details}`;
      } else if (error.message) {
        message = error.message;
      }
      
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading gig details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8">
      <div className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl mb-6 shadow-lg">
            <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Edit{' '}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Your Gig
            </span>
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Update your gig information and settings to keep your services current and attractive to clients.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-200/50 p-8">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-sm">1</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Basic Information</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label htmlFor="title" className="block text-sm font-semibold text-gray-700 mb-3">
                  Gig Title *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className={`w-full px-4 py-4 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 text-gray-700 placeholder-gray-400 ${
                    errors.title ? 'border-red-300 focus:ring-red-100 focus:border-red-500' : 'border-gray-200'
                  }`}
                  placeholder="e.g., Professional Logo Design for Your Brand"
                />
                {errors.title && <p className="mt-2 text-sm text-red-600 font-medium">{errors.title}</p>}
              </div>

              <div>
                <label htmlFor="category" className="block text-sm font-semibold text-gray-700 mb-3">
                  Category *
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className={`w-full px-4 py-4 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 text-gray-700 ${
                    errors.category ? 'border-red-300 focus:ring-red-100 focus:border-red-500' : 'border-gray-200'
                  }`}
                >
                  <option value="">Select a category</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
                {errors.category && <p className="mt-2 text-sm text-red-600 font-medium">{errors.category}</p>}
              </div>
            </div>

            <div className="mt-8">
              <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-3">
                Description *
              </label>
              <textarea
                id="description"
                name="description"
                rows={6}
                value={formData.description}
                onChange={handleChange}
                className={`w-full px-4 py-4 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 text-gray-700 placeholder-gray-400 resize-none ${
                  errors.description ? 'border-red-300 focus:ring-red-100 focus:border-red-500' : 'border-gray-200'
                }`}
                placeholder="Describe what you offer, your process, and what clients can expect..."
              />
              {errors.description && <p className="mt-2 text-sm text-red-600 font-medium">{errors.description}</p>}
              <div className="mt-2 flex justify-between items-center">
                <p className="text-sm text-gray-500">
                  {formData.description.length}/2000 characters
                </p>
                <div className="text-xs text-gray-400">
                  Minimum 50 characters required
                </div>
              </div>
            </div>
          </div>

          {/* Pricing & Delivery */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-200/50 p-8">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-sm">2</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Pricing & Delivery</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label htmlFor="price" className="block text-sm font-semibold text-gray-700 mb-3">
                  Price (USD) *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <span className="text-gray-500 text-lg font-semibold">$</span>
                  </div>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    min="1"
                    step="0.01"
                    className={`w-full pl-10 pr-4 py-4 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-green-100 focus:border-green-500 transition-all duration-200 text-gray-700 placeholder-gray-400 ${
                      errors.price ? 'border-red-300 focus:ring-red-100 focus:border-red-500' : 'border-gray-200'
                    }`}
                    placeholder="0.00"
                  />
                </div>
                {errors.price && <p className="mt-2 text-sm text-red-600 font-medium">{errors.price}</p>}
                <p className="mt-2 text-xs text-gray-500">Minimum $1, Maximum $10,000</p>
              </div>

              <div>
                <label htmlFor="deliveryTime" className="block text-sm font-semibold text-gray-700 mb-3">
                  Delivery Time (Days) *
                </label>
                <input
                  type="number"
                  id="deliveryTime"
                  name="deliveryTime"
                  value={formData.deliveryTime}
                  onChange={handleChange}
                  min="1"
                  className={`w-full px-4 py-4 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-green-100 focus:border-green-500 transition-all duration-200 text-gray-700 placeholder-gray-400 ${
                    errors.deliveryTime ? 'border-red-300 focus:ring-red-100 focus:border-red-500' : 'border-gray-200'
                  }`}
                  placeholder="e.g., 3"
                />
                {errors.deliveryTime && <p className="mt-2 text-sm text-red-600 font-medium">{errors.deliveryTime}</p>}
                <p className="mt-2 text-xs text-gray-500">Minimum 1 day, Maximum 365 days</p>
              </div>
            </div>
          </div>

          {/* Tags */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-200/50 p-8">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-sm">3</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Tags</h2>
            </div>
            
            <div className="flex flex-wrap gap-3 mb-6">
              {formData.tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-gradient-to-r from-purple-100 to-blue-100 text-purple-800 border border-purple-200"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="ml-2 inline-flex items-center justify-center w-5 h-5 rounded-full text-purple-500 hover:bg-purple-200 hover:text-purple-700 transition-colors duration-200"
                  >
                    <HiX className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>

            <div className="flex gap-3">
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                className="flex-1 px-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-100 focus:border-purple-500 transition-all duration-200 text-gray-700 placeholder-gray-400"
                placeholder="Add a tag..."
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="px-6 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:from-purple-700 hover:to-blue-700 focus:outline-none focus:ring-4 focus:ring-purple-200 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <HiPlus className="w-5 h-5" />
              </button>
            </div>
            {errors.tags && <p className="mt-2 text-sm text-red-600 font-medium">{errors.tags}</p>}
            <p className="mt-3 text-xs text-gray-500">Maximum 10 tags allowed</p>
          </div>

          {/* Images */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-200/50 p-8">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-sm">4</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Gig Image</h2>
            </div>
            <p className="text-gray-600 mb-6">
              Upload an image to showcase your work and attract more clients. High-quality images help clients understand what you offer.
            </p>

            <ImageUpload
              images={formData.images}
              onImagesChange={(images) => setFormData(prev => ({ ...prev, images }))}
              maxImages={1}
            />
            
            {errors.images && <p className="mt-2 text-sm text-red-600 font-medium">{errors.images}</p>}
            <p className="mt-3 text-xs text-gray-500">Optional: Upload 1 image (PNG, JPG, JPEG up to 20MB)</p>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center space-x-6 pt-8">
            <button
              type="button"
              onClick={() => navigate('/freelancer/gigs')}
              className="px-8 py-4 border-2 border-gray-300 rounded-xl text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-4 focus:ring-gray-200 transition-all duration-200 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              onClick={() => console.log('Edit submit button clicked!')}
              className="px-12 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-4 focus:ring-blue-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl font-bold text-lg"
            >
              {saving ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Saving...</span>
                </div>
              ) : (
                'Save Changes'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditGig;
