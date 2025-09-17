import express from 'express';
import User from '../models/User.js';
import { authMiddleware, roleMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Get wishlist (Client only)
router.get('/', authMiddleware, roleMiddleware('client'), async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate({
        path: 'wishlist',
        populate: {
          path: 'freelancer',
          select: 'name email'
        }
      });
    res.json(user.wishlist);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Add gig to wishlist (Client only)
router.post('/:gigId', authMiddleware, roleMiddleware('client'), async (req, res) => {
  try {
    const gigId = req.params.gigId;
    const user = await User.findById(req.user._id);

    if (user.wishlist.includes(gigId)) {
      return res.status(400).json({ message: 'Gig already in wishlist' });
    }

    user.wishlist.push(gigId);
    await user.save();
    res.json({ message: 'Gig added to wishlist' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Remove gig from wishlist (Client only)
router.delete('/:gigId', authMiddleware, roleMiddleware('client'), async (req, res) => {
  try {
    const gigId = req.params.gigId;
    const user = await User.findById(req.user._id);

    user.wishlist = user.wishlist.filter(id => id.toString() !== gigId);
    await user.save();
    res.json({ message: 'Gig removed from wishlist' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
