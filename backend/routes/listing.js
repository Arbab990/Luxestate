import express from 'express';
import Listing from '../models/Listing.js';
import { verifyToken, optionalAuth } from '../middleware/auth.js';

const router = express.Router();
router.get('/', optionalAuth, async (req, res) => {
  try {
    const {
      search, category, city, minPrice, maxPrice,
      bedrooms, bathrooms, furnished, parking, pool, gym, petFriendly, featured,
      sort = 'createdAt', order = 'desc', page = 1, limit = 12
    } = req.query;

    // Base query — only active listings for public users
    const query = { status: 'active' };

    // Admins can see all listings regardless of status
    if (req.user?.role === 'admin') delete query.status;

    // Full-text search across title, description, city, address
    if (search) query.$text = { $search: search };

    // Exact or partial filters
    if (category && category !== 'all') query.category = category;
    if (city) query.city = { $regex: city, $options: 'i' };

    // Price range
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // Minimum bedroom/bathroom filters
    if (bedrooms && bedrooms !== 'any') query.bedrooms = { $gte: Number(bedrooms) };
    if (bathrooms && bathrooms !== 'any') query.bathrooms = { $gte: Number(bathrooms) };

    // Boolean amenity filters
    if (furnished === 'true') query.furnished = true;
    if (parking === 'true') query.parking = true;
    if (pool === 'true') query.pool = true;
    if (gym === 'true') query.gym = true;
    if (petFriendly === 'true') query.petFriendly = true;
    if (featured === 'true') query.featured = true;

    // Pagination
    const skip = (Number(page) - 1) * Number(limit);
    const sortObj = { [sort]: order === 'asc' ? 1 : -1 };

    // Run both queries in parallel — listings + total count
    const [listings, total] = await Promise.all([
      Listing.find(query)
        .sort(sortObj)
        .skip(skip)
        .limit(Number(limit))
        .populate('owner', 'username avatar email phone')
        .lean(),
      Listing.countDocuments(query)
    ]);

    res.json({
      listings,
      total,
      pages: Math.ceil(total / Number(limit)),
      page: Number(page)
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
router.get('/featured', async (req, res) => {
  try {
    const listings = await Listing.find({ featured: true, status: 'active' })
      .sort({ createdAt: -1 })
      .limit(6)
      .populate('owner', 'username avatar')
      .lean();

    res.json(listings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const listing = await Listing.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    )
      .populate('owner', 'username avatar email phone bio')
      .lean();

    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }

    res.json(listing);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
router.post('/', verifyToken, async (req, res) => {
  try {
    const listing = new Listing({
      ...req.body,
      owner: req.user.id
    });

    await listing.save();
    res.status(201).json(listing);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }

    // Only the owner or an admin can update
    if (listing.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const updated = await Listing.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }

    if (listing.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    await Listing.findByIdAndDelete(req.params.id);
    res.json({ message: 'Listing deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
router.get('/user/:userId', async (req, res) => {
  try {
    const listings = await Listing.find({ owner: req.params.userId })
      .sort({ createdAt: -1 })
      .lean();

    res.json(listings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;

