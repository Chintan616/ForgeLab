import mongoose from 'mongoose';

const GigSchema = new mongoose.Schema({
  freelancer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  deliveryTime: { type: Number, required: true }, // days
  tags: [String],
  images: [String], // URLs of images or files
  isActive: { type: Boolean, default: true },
  views: { type: Number, default: 0 },
  averageRating: { type: Number, default: 0 },
  totalRatings: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

const Gig = mongoose.model('Gig', GigSchema);
export default Gig;
