import express from 'express';
import Review from '../models/Review.js';
import Order from '../models/Order.js';
import { authMiddleware, roleMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Add a review (Client only)
router.post('/', authMiddleware, roleMiddleware('client'), async (req, res) => {
  const { orderId, rating, comment } = req.body;
  try {
    // Verify if the order exists and belongs to client
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (order.client.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized to review this order' });
    }
    // Prevent multiple reviews for same order
    const existingReview = await Review.findOne({ order: orderId });
    if (existingReview) return res.status(400).json({ message: 'Review already exists for this order' });

    const review = await Review.create({
      order: orderId,
      client: req.user._id,
      freelancer: order.freelancer,
      rating,
      comment,
    });

    res.status(201).json(review);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get reviews for freelancer
router.get('/freelancer/:freelancerId', async (req, res) => {
  try {
    const reviews = await Review.find({ freelancer: req.params.freelancerId })
      .populate('client', 'name')
      .sort({ createdAt: -1 });

    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
