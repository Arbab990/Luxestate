import mongoose from 'mongoose';

const articleSchema = new mongoose.Schema({
  title:       { type: String, required: true },
  content:     { type: String, required: true },
  type:        { type: String, enum: ['blog', 'press'], required: true },
  image:       { type: String, required: true },
  author:      { type: String, default: 'LuxEstate Team' },
  publishedAt: { type: Date, default: Date.now },
}, { timestamps: true });

export default mongoose.model('Article', articleSchema);