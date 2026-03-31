import express from 'express';
import User from '../models/User.js';
import Listing from '../models/Listing.js';
import Article from '../models/Article.js';
import Job from '../models/Job.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/stats', async (req, res) => {
  try {
    const totalListings = await Listing.countDocuments({ status: 'active' });
    const totalUsers = await User.countDocuments();

    res.json({
      propertiesListed: totalListings,
      familiesHoused:   totalUsers,
      yearsTrust:       15,
      clientSatisfaction: 98,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/blog', async (req, res) => {
  try {
    const blogs = await Article.find({ type: 'blog' })
      .sort({ publishedAt: -1 });
    res.json(blogs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/press', async (req, res) => {
  try {
    const press = await Article.find({ type: 'press' })
      .sort({ publishedAt: -1 });
    res.json(press);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/article/:id', async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) {
      return res.status(404).json({ message: 'Article not found' });
    }
    res.json(article);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/article', verifyToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin only.' });
    }

    const { title, content, type, image } = req.body;

    if (!title || !content || !type || !image) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    const article = new Article({ title, content, type, image });
    const saved = await article.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put('/article/:id', verifyToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin only.' });
    }

    const { title, content, type, image } = req.body;

    const updated = await Article.findByIdAndUpdate(
      req.params.id,
      { title, content, type, image },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: 'Article not found' });
    }

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete('/article/:id', verifyToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin only.' });
    }

    const article = await Article.findByIdAndDelete(req.params.id);
    if (!article) {
      return res.status(404).json({ message: 'Article not found' });
    }

    res.json({ message: 'Article deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/careers', async (req, res) => {
  try {
    const jobs = await Job.find({ isActive: true })
      .sort({ createdAt: -1 });
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/careers/all', verifyToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin only.' });
    }

    const jobs = await Job.find()
      .sort({ isActive: -1, createdAt: -1 });

    res.json(jobs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/career/:id', async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    res.json(job);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/career', verifyToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin only.' });
    }

    const { title, department, location, type, description } = req.body;

    if (!title || !department || !location || !type || !description) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    const job = new Job({ title, department, location, type, description });
    const saved = await job.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put('/career/:id', verifyToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin only.' });
    }

    const { title, department, location, type, description, isActive } = req.body;

    const updated = await Job.findByIdAndUpdate(
      req.params.id,
      { title, department, location, type, description, isActive },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: 'Job not found' });
    }

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete('/career/:id', verifyToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin only.' });
    }

    const job = await Job.findByIdAndDelete(req.params.id);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    res.json({ message: 'Job deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
