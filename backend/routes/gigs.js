import express from 'express';
import Gig from '../models/Gig.js';
import { authMiddleware, roleMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Create a new gig (Freelancer only)
router.post('/', authMiddleware, roleMiddleware('freelancer'), async (req, res) => {
  try {
    // Validate required fields first
    if (!req.body.title || !req.body.description || !req.body.category || !req.body.price || !req.body.deliveryTime) {
      return res.status(400).json({ message: 'All required fields must be provided' });
    }
    
    // Validate field lengths
    if (req.body.title.length < 10 || req.body.title.length > 100) {
      return res.status(400).json({ message: 'Title must be between 10 and 100 characters' });
    }
    
    if (req.body.description.length < 50 || req.body.description.length > 2000) {
      return res.status(400).json({ message: 'Description must be between 50 and 2000 characters' });
    }
    
    // Validate price
    if (req.body.price <= 0 || req.body.price > 10000) {
      return res.status(400).json({ message: 'Price must be between $1 and $10,000' });
    }
    
    // Validate delivery time
    if (req.body.deliveryTime <= 0 || req.body.deliveryTime > 365) {
      return res.status(400).json({ message: 'Delivery time must be between 1 and 365 days' });
    }
    
    const gigData = { ...req.body, freelancer: req.user.id };
    console.log('Creating gig with data:', gigData);
    const gig = await Gig.create(gigData);
    console.log('Created gig:', gig);
    res.status(201).json(gig);
  } catch (err) {
    console.error('Gig creation error:', err);
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: 'Validation error', details: err.message });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all active gigs with optional filters (for clients)
router.get('/', async (req, res) => {
  try {
    const gigs = await Gig.find({ isActive: true }).populate('freelancer', 'name profile');
    res.json(gigs);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get gigs for a specific freelancer (must come before /:id to avoid route conflicts)
router.get('/freelancer', authMiddleware, roleMiddleware('freelancer'), async (req, res) => {
  try {
    console.log('Fetching gigs for freelancer ID:', req.user.id);
    // Freelancers can see all their gigs (active and inactive) for management
    const gigs = await Gig.find({ freelancer: req.user.id });
    console.log('Found gigs:', gigs);
    res.json(gigs);
  } catch (err) {
    console.error('Error fetching freelancer gigs:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get gig by ID (only active gigs for clients)
router.get('/:id', async (req, res) => {
  try {
    console.log('Fetching gig by ID:', req.params.id);
    const gig = await Gig.findById(req.params.id).populate('freelancer', 'name profile');
    if (!gig) return res.status(404).json({ message: 'Gig not found' });
    
    // Check if gig is active (for client access)
    if (!gig.isActive) {
      return res.status(404).json({ message: 'Gig not found or inactive' });
    }
    
    console.log('Found gig:', gig);
    console.log('Gig freelancer:', gig.freelancer);
    res.json(gig);
  } catch (err) {
    console.error('Error fetching gig by ID:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Track gig view (increment view count)
router.post('/:id/view', async (req, res) => {
  try {
    console.log('View tracking request for gig ID:', req.params.id);
    const gig = await Gig.findById(req.params.id);
    if (!gig) return res.status(404).json({ message: 'Gig not found' });
    
    console.log('Current views before increment:', gig.views);
    
    // Increment view count
    gig.views += 1;
    await gig.save();
    
    console.log('Views after increment:', gig.views);
    
    res.json({ message: 'View tracked successfully', views: gig.views });
  } catch (err) {
    console.error('Error tracking gig view:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update gig (Freelancer only, owns the gig)
router.put('/:id', authMiddleware, roleMiddleware('freelancer'), async (req, res) => {
  try {
    const gig = await Gig.findOne({ _id: req.params.id, freelancer: req.user.id });
    if (!gig) return res.status(404).json({ message: 'Gig not found or not authorized' });

    // Validate required fields
    if (req.body.title) {
      if (req.body.title.trim().length < 10 || req.body.title.trim().length > 100) {
        return res.status(400).json({ message: 'Title must be between 10 and 100 characters' });
      }
    }
    
    if (req.body.description) {
      if (req.body.description.trim().length < 50 || req.body.description.trim().length > 2000) {
        return res.status(400).json({ message: 'Description must be between 50 and 2000 characters' });
      }
    }
    
    if (req.body.price) {
      if (req.body.price <= 0 || req.body.price > 10000) {
        return res.status(400).json({ message: 'Price must be between $1 and $10,000' });
      }
    }
    
    if (req.body.deliveryTime) {
      if (req.body.deliveryTime <= 0 || req.body.deliveryTime > 365) {
        return res.status(400).json({ message: 'Delivery time must be between 1 and 365 days' });
      }
    }

    Object.assign(gig, req.body);
    await gig.save();
    res.json(gig);
  } catch (err) {
    console.error('Gig update error:', err);
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: 'Validation error', details: err.message });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete gig (Freelancer only, owns the gig)
router.delete('/:id', authMiddleware, roleMiddleware('freelancer'), async (req, res) => {
  try {
    const gig = await Gig.findOneAndDelete({ _id: req.params.id, freelancer: req.user.id });
    if (!gig) return res.status(404).json({ message: 'Gig not found or not authorized' });
    res.json({ message: 'Gig deleted successfully' });
  } catch (err) {
    console.error('Gig deletion error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Toggle gig status (active/inactive)
router.patch('/:id/toggle-status', authMiddleware, roleMiddleware('freelancer'), async (req, res) => {
  try {
    const gig = await Gig.findOne({ _id: req.params.id, freelancer: req.user.id });
    if (!gig) return res.status(404).json({ message: 'Gig not found or not authorized' });
    
    gig.isActive = !gig.isActive;
    await gig.save();
    res.json({ 
      message: `Gig ${gig.isActive ? 'activated' : 'deactivated'} successfully`,
      gig 
    });
  } catch (err) {
    console.error('Gig status toggle error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
