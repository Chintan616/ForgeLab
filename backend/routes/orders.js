import express from 'express';
import Stripe from 'stripe';
import Order from '../models/Order.js';
import Gig from '../models/Gig.js';
import { authMiddleware, roleMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Create a new order (Client only) - Stripe integration will be added later
router.post('/', authMiddleware, roleMiddleware('client'), async (req, res) => {
  try {
    const { gigId } = req.body;

    // Fetch gig to get price and freelancer
    const gig = await Gig.findById(gigId);
    if (!gig) return res.status(404).json({ message: 'Gig not found' });

    // Create order with status 'pending' (freelancer needs to mark as delivered)
    const order = await Order.create({
      gig: gig._id,
      client: req.user._id,
      freelancer: gig.freelancer,
      price: gig.price,
      deliveryTime: gig.deliveryTime,
      status: 'pending', // Set to 'pending' for freelancer to manage
      stripePaymentIntentId: 'temp_' + Date.now(), // Temporary placeholder
    });

    console.log('Order created successfully:', order);

    res.json({
      orderId: order._id,
      message: 'Order created successfully!'
    });
  } catch (err) {
    console.error('Order creation error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Get orders for the logged-in user
router.get('/', authMiddleware, async (req, res) => {
  try {
    let orders;
    if (req.user.role === 'client') {
      orders = await Order.find({ client: req.user._id })
        .populate({
          path: 'gig',
          populate: {
            path: 'freelancer',
            select: 'name email'
          }
        })
        .populate('freelancer', 'name email')
        .sort({ createdAt: -1 }); // Sort by newest first
      console.log('Client orders with populated data:', JSON.stringify(orders, null, 2));
    } else if (req.user.role === 'freelancer') {
      orders = await Order.find({ freelancer: req.user._id })
        .populate('gig')
        .populate('client', 'name email')
        .sort({ createdAt: -1 }); // Sort by newest first
    } else {
      return res.status(400).json({ message: 'Invalid user role' });
    }
    
    res.json({ orders });
  } catch (err) {
    console.error('Error fetching orders:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update order status (Freelancer only, owns the gig)
router.patch('/:id/status', authMiddleware, roleMiddleware('freelancer'), async (req, res) => {
  try {
    console.log('Status update request:', { 
      orderId: req.params.id, 
      newStatus: req.body.status, 
      userId: req.user._id,
      userRole: req.user.role 
    });
    
    const { status } = req.body;
    const order = await Order.findOne({ _id: req.params.id, freelancer: req.user._id });
    
    console.log('Found order:', order);
    
    if (!order) {
      console.log('Order not found or not authorized');
      return res.status(404).json({ message: 'Order not found or not authorized' });
    }

    // Validate status - only allow pending and delivered
    const validStatuses = ['pending', 'delivered'];
    if (!validStatuses.includes(status)) {
      console.log('Invalid status:', status);
      return res.status(400).json({ message: 'Invalid status. Only pending and delivered are allowed.' });
    }

    order.status = status;
    await order.save();

    console.log('Order status updated successfully:', order);

    res.json({ 
      message: 'Order status updated successfully',
      order 
    });
  } catch (err) {
    console.error('Order status update error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

export default router;
