import express from 'express';
import { upload } from '../config/cloudinary.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// Upload image to Cloudinary
router.post('/image', verifyToken, upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    
    console.log('File uploaded successfully:', req.file);
    
    // Return the Cloudinary URL
    res.status(200).json({ 
      url: req.file.path,
      message: 'Image uploaded successfully' 
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;