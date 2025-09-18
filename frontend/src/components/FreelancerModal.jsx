import { useState, useEffect } from 'react';
import { HiX, HiUser, HiMail, HiCheckCircle } from 'react-icons/hi';
import api from '../utils/api';
import toast from 'react-hot-toast';

const FreelancerModal = ({ isOpen, onClose, freelancerId }) => {
  const [freelancer, setFreelancer] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && freelancerId) {
      fetchFreelancerDetails();
    }
  }, [isOpen, freelancerId]);

  const fetchFreelancerDetails = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/profile/${freelancerId}`);
      setFreelancer(response.data);
    } catch (error) {
      console.error('Error fetching freelancer details:', error);
      toast.error('Failed to load freelancer information');
    } finally {
      setLoading(false);
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Freelancer Profile
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
            >
              <HiX className="h-6 w-6 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : freelancer ? (
            <div className="space-y-6">
              {/* Name */}
              <div className="text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg mx-auto mb-4">
                  <span className="text-white font-bold text-2xl">
                    {freelancer.name?.charAt(0)?.toUpperCase() || 'F'}
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{freelancer.name}</h3>
              </div>

              {/* Email */}
              {freelancer.email && (
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 border border-blue-100">
                  <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                    <HiMail className="h-5 w-5 text-blue-600 mr-2" />
                    Email
                  </h4>
                  <p className="text-gray-700">{freelancer.email}</p>
                </div>
              )}

              {/* Bio */}
              {freelancer.profile?.bio && (
                <div className="bg-white border border-gray-200 rounded-xl p-4">
                  <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                    <HiUser className="h-5 w-5 text-green-600 mr-2" />
                    About
                  </h4>
                  <p className="text-gray-700 leading-relaxed">{freelancer.profile.bio}</p>
                </div>
              )}

              {/* Skills */}
              {freelancer.profile?.skills && freelancer.profile.skills.length > 0 && (
                <div className="bg-white border border-gray-200 rounded-xl p-4">
                  <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                    <HiCheckCircle className="h-5 w-5 text-purple-600 mr-2" />
                    Skills & Expertise
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {freelancer.profile.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 text-sm font-medium rounded-full border border-purple-200"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">Failed to load freelancer information</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 px-6 py-4 rounded-b-2xl border-t border-gray-200">
          <button
            onClick={onClose}
            className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-4 focus:ring-blue-200 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default FreelancerModal;
