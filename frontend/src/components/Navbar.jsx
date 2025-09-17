import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  HiBriefcase, 
  HiUser, 
  HiMenu, 
  HiX, 
  HiSearch,
  HiPlus,
  HiHeart,
  HiShoppingCart,
  HiChevronDown
} from 'react-icons/hi';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const userDropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target)) {
        setIsUserDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);


  const handleLogout = () => {
    logout();
    navigate('/');
    setIsOpen(false);
  };

  return (
    <nav className="bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-200/50 fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-4 group">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:scale-105">
              <HiBriefcase className="h-7 w-7 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent group-hover:from-purple-600 group-hover:to-blue-600 transition-all duration-300">
              ForgeLab
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            <Link 
              to="/gigs" 
              className="px-5 py-3 text-gray-700 font-medium rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-all duration-200 relative group"
            >
              Browse Gigs
              <span className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200"></span>
            </Link>
            
            {isAuthenticated && user?.role === 'freelancer' && (
              <>
                <Link 
                  to="/freelancer/gigs" 
                  className="px-5 py-3 text-gray-700 font-medium rounded-lg hover:bg-purple-50 hover:text-purple-600 transition-all duration-200 relative group"
                >
                  Manage Gigs
                  <span className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-purple-600 to-pink-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200"></span>
                </Link>
                <Link 
                  to="/freelancer/orders" 
                  className="px-5 py-3 text-gray-700 font-medium rounded-lg hover:bg-green-50 hover:text-green-600 transition-all duration-200 relative group"
                >
                  Orders
                  <span className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-green-600 to-blue-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200"></span>
                </Link>
              </>
            )}
            
            {isAuthenticated && user?.role === 'client' && (
              <Link 
                to="/client" 
                className="px-5 py-3 text-gray-700 font-medium rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-all duration-200 relative group"
              >
                Dashboard
                <span className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200"></span>
              </Link>
            )}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-6">
            {isAuthenticated ? (
              <>
                {user?.role === 'freelancer' && (
                  <Link
                    to="/freelancer/gigs/create"
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-4 focus:ring-blue-200 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center space-x-2"
                  >
                    <HiPlus className="h-4 w-4" />
                    <span>Create Gig</span>
                  </Link>
                )}
                
                <div className="flex items-center space-x-4">
                  {/* Show wishlist and cart only for clients */}
                  {user?.role === 'client' && (
                    <>
                      <Link
                        to="/wishlist"
                        className="p-3 text-gray-500 hover:text-red-500 transition-all duration-200 rounded-full hover:bg-red-50 transform hover:scale-110"
                        title="Wishlist"
                      >
                        <HiHeart className="h-6 w-6" />
                      </Link>
                      <Link
                        to="/client/orders"
                        className="p-3 text-gray-500 hover:text-blue-500 transition-all duration-200 rounded-full hover:bg-blue-50 transform hover:scale-110"
                        title="My Orders"
                      >
                        <HiShoppingCart className="h-6 w-6" />
                      </Link>
                    </>
                  )}
                  <div className="relative" ref={userDropdownRef}>
                    <button 
                      onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                      className="flex items-center space-x-3 p-3 rounded-xl hover:bg-gray-50 transition-all duration-200 border border-gray-200 hover:border-gray-300 hover:shadow-md"
                    >
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-md">
                        <span className="text-sm font-bold text-white">
                          {user?.name?.charAt(0) || 'U'}
                        </span>
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-semibold text-gray-900">{user?.name || 'User'}</p>
                        <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
                      </div>
                      <HiChevronDown className={`h-4 w-4 text-gray-500 transition-transform duration-200 ${isUserDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>
                    
                    {/* User Dropdown Menu */}
                    {isUserDropdownOpen && (
                      <div className="absolute right-0 mt-3 w-56 bg-white rounded-xl shadow-2xl py-2 z-50 border border-gray-200/50 backdrop-blur-sm">
                        <Link
                          to="/profile"
                          className="block px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:text-blue-600 transition-all duration-200 mx-2 rounded-lg"
                          onClick={() => setIsUserDropdownOpen(false)}
                        >
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                              <HiUser className="h-4 w-4 text-gray-600" />
                            </div>
                            <span>Profile Settings</span>
                          </div>
                        </Link>
                        <div className="border-t border-gray-100 my-2"></div>
                        <button
                          onClick={() => {
                            handleLogout();
                            setIsUserDropdownOpen(false);
                          }}
                          className="block w-full text-left px-4 py-3 text-sm font-medium text-red-600 hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 transition-all duration-200 mx-2 rounded-lg"
                        >
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                              <HiX className="h-4 w-4 text-red-600" />
                            </div>
                            <span>Sign Out</span>
                          </div>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link 
                  to="/login" 
                  className="px-5 py-3 text-gray-700 font-medium rounded-lg hover:bg-gray-50 hover:text-gray-900 transition-all duration-200"
                >
                  Sign In
                </Link>
                <Link 
                  to="/signup" 
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-4 focus:ring-blue-200 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  Join
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-3 rounded-xl text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200 transform hover:scale-105"
            >
              {isOpen ? <HiX className="h-7 w-7" /> : <HiMenu className="h-7 w-7" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden border-t border-gray-200/50 bg-white/95 backdrop-blur-md">
            <div className="px-6 pt-6 pb-8 space-y-3">
              <Link
                to="/gigs"
                className="block px-5 py-4 rounded-xl text-gray-700 font-medium hover:text-blue-600 hover:bg-blue-50 transition-all duration-200"
                onClick={() => setIsOpen(false)}
              >
                Browse Gigs
              </Link>
              
              {isAuthenticated && user?.role === 'freelancer' && (
                <>
                  <Link
                    to="/freelancer/gigs"
                    className="block px-5 py-4 rounded-xl text-gray-700 font-medium hover:text-purple-600 hover:bg-purple-50 transition-all duration-200"
                    onClick={() => setIsOpen(false)}
                  >
                    Manage Gigs
                  </Link>
                  <Link
                    to="/freelancer/orders"
                    className="block px-5 py-4 rounded-xl text-gray-700 font-medium hover:text-green-600 hover:bg-green-50 transition-all duration-200"
                    onClick={() => setIsOpen(false)}
                  >
                    Orders
                  </Link>
                </>
              )}
              
              {isAuthenticated && user?.role === 'client' && (
                <>
                  <Link
                    to="/client"
                    className="block px-5 py-4 rounded-xl text-gray-700 font-medium hover:text-blue-600 hover:bg-blue-50 transition-all duration-200"
                    onClick={() => setIsOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/wishlist"
                    className="block px-5 py-4 rounded-xl text-gray-700 font-medium hover:text-red-600 hover:bg-red-50 transition-all duration-200"
                    onClick={() => setIsOpen(false)}
                  >
                    Wishlist
                  </Link>
                  <Link
                    to="/client/orders"
                    className="block px-5 py-4 rounded-xl text-gray-700 font-medium hover:text-blue-600 hover:bg-blue-50 transition-all duration-200"
                    onClick={() => setIsOpen(false)}
                  >
                    My Orders
                  </Link>
                </>
              )}
              

              
              {isAuthenticated ? (
                <>
                  {user?.role === 'freelancer' && (
                    <Link
                      to="/freelancer/gigs/create"
                      className="block px-5 py-4 rounded-xl text-white font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-200 text-center"
                      onClick={() => setIsOpen(false)}
                    >
                      Create Gig
                    </Link>
                  )}
                  
                  <div className="border-t border-gray-200 my-6"></div>
                  
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-5 py-4 rounded-xl text-red-600 font-medium hover:bg-red-50 transition-all duration-200"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <div className="pt-6 space-y-4">
                  <Link
                    to="/login"
                    className="block px-5 py-4 rounded-xl text-gray-700 font-medium hover:text-gray-900 hover:bg-gray-50 transition-all duration-200"
                    onClick={() => setIsOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/signup"
                    className="block px-5 py-4 rounded-xl text-white font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-200 text-center"
                    onClick={() => setIsOpen(false)}
                  >
                    Join
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
