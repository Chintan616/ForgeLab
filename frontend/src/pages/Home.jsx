import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  HiBriefcase, 
  HiUsers, 
  HiLightningBolt, 
  HiArrowRight,
  HiStar,
  HiGlobe,
  HiShieldCheck,
  HiClock
} from 'react-icons/hi';

const Home = () => {
  const { user, isAuthenticated, isFreelancer, isClient } = useAuth();

  const getHeroButtons = () => {
    if (!isAuthenticated) {
      return (
        <div className="flex flex-col sm:flex-row gap-6 justify-center">
          <Link 
            to="/signup" 
            className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-lg rounded-xl hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-4 focus:ring-blue-200 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl text-center"
          >
            Get Started
          </Link>
          <Link 
            to="/gigs" 
            className="px-8 py-4 bg-white text-gray-700 font-semibold text-lg rounded-xl border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl text-center"
          >
            Browse Gigs
          </Link>
        </div>
      );
    }
    
    if (isFreelancer) {
      return (
        <div className="flex flex-col sm:flex-row gap-6 justify-center">
          <Link 
            to="/freelancer/gigs/create" 
            className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-lg rounded-xl hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-4 focus:ring-blue-200 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl text-center"
          >
            Create New Gig
          </Link>
          <Link 
            to="/freelancer" 
            className="px-8 py-4 bg-white text-gray-700 font-semibold text-lg rounded-xl border-2 border-gray-200 hover:border-purple-300 hover:bg-purple-50 hover:text-purple-600 focus:outline-none focus:ring-4 focus:ring-purple-100 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl text-center"
          >
            View Dashboard
          </Link>
        </div>
      );
    }
    
    if (isClient) {
      return (
        <div className="flex flex-col sm:flex-row gap-6 justify-center">
          <Link 
            to="/gigs" 
            className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-lg rounded-xl hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-4 focus:ring-blue-200 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl text-center"
          >
            Find Services
          </Link>
          <Link 
            to="/client" 
            className="px-8 py-4 bg-white text-gray-700 font-semibold text-lg rounded-xl border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl text-center"
          >
            View Dashboard
          </Link>
        </div>
      );
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 bg-gradient-to-br from-blue-50 via-white to-purple-50 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5"></div>
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-200/20 rounded-full blur-3xl"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-5xl mx-auto">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-8 leading-tight">
              Find the Perfect{' '}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Freelancer
              </span>
              <br />
              or Get Hired
            </h1>
            <p className="text-gray-600 text-xl md:text-2xl mb-12 leading-relaxed max-w-4xl mx-auto">
              Connect with talented professionals worldwide. Whether you need work done or want to offer your skills, 
              ForgeLab is your marketplace for success.
            </p>
            {getHeroButtons()}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center group">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 mb-4 group-hover:shadow-lg transition-all duration-300">
                <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent mb-2">50K+</div>
                <div className="text-gray-600 font-medium">Active Freelancers</div>
              </div>
            </div>
            <div className="text-center group">
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 mb-4 group-hover:shadow-lg transition-all duration-300">
                <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-purple-700 bg-clip-text text-transparent mb-2">100K+</div>
                <div className="text-gray-600 font-medium">Projects Completed</div>
              </div>
            </div>
            <div className="text-center group">
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 mb-4 group-hover:shadow-lg transition-all duration-300">
                <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent mb-2">95%</div>
                <div className="text-gray-600 font-medium">Satisfaction Rate</div>
              </div>
            </div>
            <div className="text-center group">
              <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-6 mb-4 group-hover:shadow-lg transition-all duration-300">
                <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-orange-600 to-orange-700 bg-clip-text text-transparent mb-2">24/7</div>
                <div className="text-gray-600 font-medium">Support Available</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 md:py-24 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Why Choose{' '}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                ForgeLab?
              </span>
            </h2>
            <p className="text-gray-600 text-xl max-w-3xl mx-auto leading-relaxed">
              We provide the tools and platform you need to succeed in the freelance world.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="group bg-white rounded-2xl p-8 text-center shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
              <div className="w-20 h-20 bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <HiStar className="h-10 w-10 text-yellow-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Quality Work</h3>
              <p className="text-gray-600 leading-relaxed">
                Access to verified freelancers with proven track records and portfolio showcases.
              </p>
            </div>
            
            <div className="group bg-white rounded-2xl p-8 text-center shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <HiGlobe className="h-10 w-10 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Global Talent</h3>
              <p className="text-gray-600 leading-relaxed">
                Connect with professionals from around the world, bringing diverse perspectives and skills.
              </p>
            </div>
            
            <div className="group bg-white rounded-2xl p-8 text-center shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-purple-200 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <HiLightningBolt className="h-10 w-10 text-purple-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Fast Delivery</h3>
              <p className="text-gray-600 leading-relaxed">
                Quick turnaround times with clear milestones and communication throughout the process.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              How It{' '}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Works
              </span>
            </h2>
            <p className="text-gray-600 text-xl max-w-3xl mx-auto leading-relaxed">
              Simple steps to get started with ForgeLab
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto">
            <div className="text-center group">
              <div className="relative mb-8">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto text-white text-3xl font-bold shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:scale-110">
                  1
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                  <HiUsers className="h-4 w-4 text-white" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Create Account</h3>
              <p className="text-gray-600 text-lg leading-relaxed">
                Sign up as a client or freelancer and complete your profile with skills and portfolio.
              </p>
            </div>
            
            <div className="text-center group">
              <div className="relative mb-8">
                <div className="w-24 h-24 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center mx-auto text-white text-3xl font-bold shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:scale-110">
                  2
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                  <HiBriefcase className="h-4 w-4 text-white" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Browse or Create</h3>
              <p className="text-gray-600 text-lg leading-relaxed">
                Find the perfect gig or create your own service offering to attract clients.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 md:py-24 bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20"></div>
        <div className="absolute top-10 left-10 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-white text-4xl md:text-5xl font-bold mb-6">
            Ready to Get{' '}
            <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
              Started?
            </span>
          </h2>
          <p className="text-white/90 text-xl mb-12 max-w-3xl mx-auto leading-relaxed">
            Join thousands of freelancers and clients who trust ForgeLab for their success
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link 
              to="/signup" 
              className="px-8 py-4 bg-white text-blue-600 hover:bg-gray-50 font-bold text-lg rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              Start Now
            </Link>
            <Link 
              to="/gigs" 
              className="px-8 py-4 border-2 border-white text-white hover:bg-white hover:text-blue-600 font-bold text-lg rounded-xl transition-all duration-200 transform hover:scale-105"
            >
              Explore Services
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
