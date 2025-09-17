import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema({
  gig: { type: mongoose.Schema.Types.ObjectId, ref: 'Gig', required: true },
  client: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  freelancer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  price: { type: Number, required: true },
  deliveryTime: { type: Number }, // days
  stripePaymentIntentId: { type: String, required: false },
  status: {
    type: String,
    enum: ['pending', 'delivered'],
    default: 'pending',
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  // Add any additional fields you want to track
});

OrderSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Order = mongoose.model('Order', OrderSchema);
export default Order;
