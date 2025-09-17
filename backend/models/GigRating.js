import mongoose from 'mongoose';

const GigRatingSchema = new mongoose.Schema({
  gig: { type: mongoose.Schema.Types.ObjectId, ref: 'Gig', required: true },
  client: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  freelancer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  rating: { type: Number, min: 1, max: 5, required: true },
  comment: { type: String, maxlength: 500 },
  createdAt: { type: Date, default: Date.now },
});

// Prevent multiple ratings from same client for same gig
GigRatingSchema.index({ gig: 1, client: 1 }, { unique: true });

const GigRating = mongoose.model('GigRating', GigRatingSchema);
export default GigRating;
