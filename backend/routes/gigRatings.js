import express from 'express';
import GigRating from '../models/GigRating.js';
import Gig from '../models/Gig.js';
import { authMiddleware, roleMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Add a rating for a gig (Client only)
router.post('/:gigId', authMiddleware, roleMiddleware('client'), async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const gigId = req.params.gigId;

    // Validate rating
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    // Check if gig exists
    const gig = await Gig.findById(gigId);
    if (!gig) {
      return res.status(404).json({ message: 'Gig not found' });
    }

    // Check if user has already rated this gig
    const existingRating = await GigRating.findOne({ gig: gigId, client: req.user._id });
    if (existingRating) {
      return res.status(400).json({ message: 'You have already rated this gig' });
    }

    // Create the rating
    const gigRating = await GigRating.create({
      gig: gigId,
      client: req.user._id,
      freelancer: gig.freelancer,
      rating,
      comment
    });

    // Update gig's average rating
    const allRatings = await GigRating.find({ gig: gigId });
    const totalRating = allRatings.reduce((sum, r) => sum + r.rating, 0);
    const averageRating = totalRating / allRatings.length;

    await Gig.findByIdAndUpdate(gigId, {
      averageRating: Math.round(averageRating * 10) / 10, // Round to 1 decimal place
      totalRatings: allRatings.length
    });

    res.status(201).json({
      message: 'Rating added successfully',
      rating: gigRating,
      averageRating: Math.round(averageRating * 10) / 10,
      totalRatings: allRatings.length
    });
  } catch (err) {
    console.error('Error adding gig rating:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get ratings for a specific gig
router.get('/:gigId', async (req, res) => {
  try {
    const gigId = req.params.gigId;
    
    const ratings = await GigRating.find({ gig: gigId })
      .populate('client', 'name')
      .sort({ createdAt: -1 });

    res.json(ratings);
  } catch (err) {
    console.error('Error fetching gig ratings:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user's rating for a specific gig (if exists)
router.get('/:gigId/user-rating', authMiddleware, async (req, res) => {
  try {
    const gigId = req.params.gigId;
    
    const rating = await GigRating.findOne({ 
      gig: gigId, 
      client: req.user._id 
    });

    res.json(rating || null);
  } catch (err) {
    console.error('Error fetching user rating:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user's rating for a gig
router.put('/:gigId', authMiddleware, roleMiddleware('client'), async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const gigId = req.params.gigId;

    // Validate rating
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    // Find and update the rating
    const existingRating = await GigRating.findOne({ gig: gigId, client: req.user._id });
    if (!existingRating) {
      return res.status(404).json({ message: 'Rating not found' });
    }

    existingRating.rating = rating;
    existingRating.comment = comment;
    await existingRating.save();

    // Update gig's average rating
    const allRatings = await GigRating.find({ gig: gigId });
    const totalRating = allRatings.reduce((sum, r) => sum + r.rating, 0);
    const averageRating = totalRating / allRatings.length;

    await Gig.findByIdAndUpdate(gigId, {
      averageRating: Math.round(averageRating * 10) / 10,
      totalRatings: allRatings.length
    });

    res.json({
      message: 'Rating updated successfully',
      rating: existingRating,
      averageRating: Math.round(averageRating * 10) / 10,
      totalRatings: allRatings.length
    });
  } catch (err) {
    console.error('Error updating gig rating:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
