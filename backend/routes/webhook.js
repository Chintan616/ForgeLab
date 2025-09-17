import express from 'express';
import Stripe from 'stripe';
import Order from '../models/Order.js';

const router = express.Router();

// Stripe webhook secret from dashboard
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

router.post('/stripe', express.raw({ type: 'application/json' }), async (req, res) => {
  try {
    // Check if Stripe key is available
    if (!process.env.STRIPE_SECRET_KEY) {
      console.error('Stripe secret key not found');
      return res.status(500).json({ message: 'Stripe configuration error' });
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const sig = req.headers['stripe-signature'];
    let event;

    try {
      event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } catch (err) {
      console.error('Webhook signature verification failed:', err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === 'payment_intent.succeeded') {
      const paymentIntent = event.data.object;

      // Find order by PaymentIntent ID and update status to 'in_progress' or 'completed' as needed
      await Order.findOneAndUpdate(
        { stripePaymentIntentId: paymentIntent.id },
        { status: 'in_progress' }
      );
    }

    res.json({ received: true });
  } catch (err) {
    console.error('Webhook error:', err);
    res.status(500).json({ message: 'Webhook processing error' });
  }
});

export default router;
