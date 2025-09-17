import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import FreelancerDashboard from './pages/freelancer/Dashboard';
import FreelancerGigs from './pages/freelancer/Gigs';
import FreelancerOrders from './pages/freelancer/Orders';
import CreateGig from './pages/freelancer/CreateGig';
import EditGig from './pages/freelancer/EditGig';
import ClientDashboard from './pages/client/Dashboard';
import ClientOrders from './pages/client/Orders';
import BrowseGigs from './pages/client/BrowseGigs';
import GigDetail from './pages/client/GigDetail';
import Wishlist from './pages/client/Wishlist';
import Profile from './pages/Profile';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <main className="pt-16">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/gigs" element={<BrowseGigs />} />
              <Route path="/gigs/:id" element={<GigDetail />} />
              
              {/* Protected Routes */}
              <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
              
              {/* Freelancer Routes */}
              <Route path="/freelancer" element={<ProtectedRoute><FreelancerDashboard /></ProtectedRoute>} />
              <Route path="/freelancer/gigs" element={<ProtectedRoute><FreelancerGigs /></ProtectedRoute>} />
              <Route path="/freelancer/orders" element={<ProtectedRoute><FreelancerOrders /></ProtectedRoute>} />
              <Route path="/freelancer/gigs/create" element={<ProtectedRoute><CreateGig /></ProtectedRoute>} />
              <Route path="/freelancer/gigs/edit/:id" element={<ProtectedRoute><EditGig /></ProtectedRoute>} />
              
              {/* Client Routes */}
              <Route path="/client" element={<ProtectedRoute><ClientDashboard /></ProtectedRoute>} />
              <Route path="/client/orders" element={<ProtectedRoute><ClientOrders /></ProtectedRoute>} />
              <Route path="/wishlist" element={<ProtectedRoute><Wishlist /></ProtectedRoute>} />
            </Routes>
          </main>
          <Toaster position="top-right" />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
