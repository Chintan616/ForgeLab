import express from 'express';
import upload from '../middleware/upload.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Upload single image
router.post('/single', authMiddleware, upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image file provided' });
    }

    // Return the file path relative to the uploads directory
    const imagePath = `/uploads/gigs/${req.file.filename}`;
    
    res.json({
      message: 'Image uploaded successfully',
      imagePath: imagePath,
      filename: req.file.filename
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: 'Error uploading image' });
  }
});

// Upload multiple images
router.post('/multiple', authMiddleware, upload.array('images', 5), (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No image files provided' });
    }

    // Return array of file paths
    const imagePaths = req.files.map(file => `/uploads/gigs/${file.filename}`);
    
    res.json({
      message: 'Images uploaded successfully',
      imagePaths: imagePaths,
      filenames: req.files.map(file => file.filename)
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: 'Error uploading images' });
  }
});

export default router;