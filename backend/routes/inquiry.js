import express from 'express';
import Inquiry from '../models/Inquiry.js';
import Listing from '../models/Listing.js';
import { optionalAuth, verifyToken } from '../middleware/auth.js';

const router = express.Router();

const countWords = (text = '') => {
  return text.trim().split(/\s+/).filter(Boolean).length;
};

router.post('/', optionalAuth, async (req, res) => {
  try {
    const { listingId, name, email, phone, message } = req.body;

    // Validate all fields are present
    if (!listingId || !name || !email || !phone || !message) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    // Validate message word count
    if (countWords(message) > 30) {
      return res.status(400).json({ message: 'Message must be 30 words or fewer.' });
    }

    // Find the listing and its owner
    const listing = await Listing.findById(listingId)
      .populate('owner', '_id username email phone');

    if (!listing) {
      return res.status(404).json({ message: 'Listing not found.' });
    }

    // Create the inquiry
    const inquiry = await Inquiry.create({
      listing:      listing._id,
      listingTitle: listing.title,
      recipient:    listing.owner?._id || null,
      senderUser:   req.user?.id || null,
      name,
      email,
      phone,
      message,
    });

    res.status(201).json({ message: 'Inquiry submitted successfully.', inquiry });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
router.get('/', verifyToken, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Unauthorized' });
  }

  try {
    const inquiries = await Inquiry.find()
      .sort({ createdAt: -1 })
      .populate('listing', 'title city state')
      .populate('recipient', 'username email phone')
      .populate('senderUser', 'username email phone');

    res.json(inquiries);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;