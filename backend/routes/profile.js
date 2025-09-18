import express from 'express';
import User from '../models/User.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Get logged-in user profile
router.get('/', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update logged-in user profile
router.put('/', authMiddleware, async (req, res) => {
  try {
    const updates = req.body;
    // Prevent password changes here for security - create a separate route for password changes if needed
    
    const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true }).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user profile by ID (public endpoint for viewing freelancer profiles)
router.get('/:id', async (req, res) => {
  try {
    console.log('Fetching profile for user ID:', req.params.id);
    
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      console.log('User not found for ID:', req.params.id);
      return res.status(404).json({ message: 'User not found' });
    }
    
    console.log('Found user:', { id: user._id, name: user.name, role: user.role });
    
    // Calculate additional stats for freelancers
    if (user.role === 'freelancer') {
      const Gig = (await import('../models/Gig.js')).default;
      const Order = (await import('../models/Order.js')).default;
      const GigRating = (await import('../models/GigRating.js')).default;
      
      console.log('Calculating stats for freelancer:', user._id);
      
      // Use ObjectId directly for comparison
      const freelancerId = user._id;
      console.log('Freelancer ID (ObjectId):', freelancerId);
      console.log('Freelancer ID type:', typeof freelancerId);
      
      // First, let's check if there are any gigs at all for this freelancer
      const allGigs = await Gig.find({ freelancer: freelancerId });
      console.log('All gigs found for freelancer:', allGigs.length);
      if (allGigs.length > 0) {
        console.log('Sample gig:', allGigs[0]);
        console.log('Gig freelancer ID:', allGigs[0].freelancer);
        console.log('Gig freelancer ID type:', typeof allGigs[0].freelancer);
        console.log('IDs match:', allGigs[0].freelancer.toString() === freelancerId.toString());
      } else {
        // Let's check if there are any gigs at all in the database
        const totalGigsInDB = await Gig.countDocuments();
        console.log('Total gigs in database:', totalGigsInDB);
        
        // Let's also check if there are any gigs with this freelancer ID as string
        const gigsWithStringId = await Gig.find({ freelancer: freelancerId.toString() });
        console.log('Gigs found with string ID:', gigsWithStringId.length);
        
        // Let's check all gigs to see what freelancer IDs exist
        const allGigsInDB = await Gig.find({}).select('freelancer');
        console.log('All freelancer IDs in database:', allGigsInDB.map(g => g.freelancer.toString()));
      }
      
      const [totalGigs, completedOrders, gigsWithRatings] = await Promise.all([
        Gig.countDocuments({ freelancer: freelancerId }),
        Order.countDocuments({ freelancer: freelancerId, status: 'delivered' }),
        Gig.find({ freelancer: freelancerId }).select('_id')
      ]);
      
      console.log('Stats calculated:', { 
        totalGigs, 
        completedOrders, 
        gigsFound: gigsWithRatings.length 
      });
      
      // Calculate average rating from all gigs
      const gigIds = gigsWithRatings.map(gig => gig._id);
      console.log('Gig IDs for rating calculation:', gigIds);
      
      const ratings = await GigRating.find({ gig: { $in: gigIds } });
      console.log('Ratings found:', ratings.length);
      if (ratings.length > 0) {
        console.log('Sample rating:', ratings[0]);
      }
      
      const totalRatings = ratings.length;
      const averageRating = totalRatings > 0 
        ? ratings.reduce((sum, rating) => sum + rating.rating, 0) / totalRatings
        : 0;
      
      console.log('Final stats:', { 
        totalGigs, 
        completedOrders, 
        averageRating, 
        totalRatings 
      });
      
      user.totalGigs = totalGigs;
      user.completedOrders = completedOrders;
      user.averageRating = Math.round(averageRating * 10) / 10;
      user.totalRatings = totalRatings;
    } else {
      // For non-freelancers, set default values
      user.totalGigs = 0;
      user.completedOrders = 0;
      user.averageRating = 0;
      user.totalRatings = 0;
    }
    
    console.log('Sending user data:', {
      id: user._id,
      name: user.name,
      role: user.role,
      totalGigs: user.totalGigs,
      completedOrders: user.completedOrders,
      averageRating: user.averageRating,
      totalRatings: user.totalRatings
    });
    
    res.json(user);
  } catch (err) {
    console.error('Error fetching user profile:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

export default router;
