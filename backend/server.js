import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import gigsRoutes from './routes/gigs.js';
import ordersRoutes from './routes/orders.js';
import webhookRoutes from './routes/webhook.js';
import reviewRoutes from './routes/reviews.js';
import wishlistRoutes from './routes/wishlist.js';
import profileRoutes from './routes/profile.js';
import authRoutes from './routes/auth.js';
import gigRatingsRoutes from './routes/gigRatings.js';
import uploadRoutes from './routes/upload.js';

const app = express();

app.use(cors());
app.use(express.json());

// Serve static files from uploads directory
app.use('/uploads', express.static('uploads'));

mongoose.connect(process.env.MONGODB_URI)
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

app.use('/api/webhook', webhookRoutes);

app.use('/api/auth', authRoutes);

app.use('/api/gigs', gigsRoutes);

app.use('/api/orders', ordersRoutes);

app.use('/api/reviews', reviewRoutes);

app.use('/api/wishlist', wishlistRoutes);

app.use('/api/profile', profileRoutes);

app.use('/api/gig-ratings', gigRatingsRoutes);

app.use('/api/upload', uploadRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
