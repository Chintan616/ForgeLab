import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  role: { type: String, enum: ['client', 'freelancer'], required: true },
  wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Gig' }],
  profile: {
    skills: [String],
    portfolio: [String],
    bio: { type: String },
    location: { type: String },
    // Add other profile fields as needed
  }
}, { timestamps: true });

const User = mongoose.model('User', UserSchema);
export default User;
