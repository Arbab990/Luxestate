import mongoose from 'mongoose';

const listingSchema = new mongoose.Schema({
  title:       { type: String, required: true },
  description: { type: String, required: true },
  address:     { type: String, required: true },
  city:        { type: String, required: true },
  state:       { type: String, required: true },
  zipCode:     { type: String },
  price:       { type: Number, required: true },
  category:    { type: String, enum: ['house', 'apartment', 'condo', 'villa', 'studio', 'commercial'], required: true },
  bedrooms:    { type: Number, required: true },
  bathrooms:   { type: Number, required: true },
  area:        { type: Number, required: true },
  parking:     { type: Boolean, default: false },
  furnished:   { type: Boolean, default: false },
  pool:        { type: Boolean, default: false },
  gym:         { type: Boolean, default: false },
  petFriendly: { type: Boolean, default: false },
  images:      [{ type: String }],
  owner:       { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  featured:    { type: Boolean, default: false },
  status:      { type: String, enum: ['active', 'sold', 'pending'], default: 'active' },
  views:       { type: Number, default: 0 },
  location: {
    lat: { type: Number },
    lng: { type: Number },
  },
}, { timestamps: true });
// Full-text search index — enables $text search across these fields
listingSchema.index({ city: 'text', title: 'text', description: 'text', address: 'text' });

// Compound indexes for common query patterns
listingSchema.index({ status: 1, createdAt: -1 });
listingSchema.index({ featured: 1, status: 1, createdAt: -1 });
listingSchema.index({ owner: 1, createdAt: -1 });
listingSchema.index({ status: 1, category: 1, price: 1 });
listingSchema.index({ status: 1, price: 1 });
listingSchema.index({ status: 1, views: -1 });

// Full-text search index — enables $text search across these fields
listingSchema.index({ city: 'text', title: 'text', description: 'text', address: 'text' });

// Compound indexes for common query patterns
listingSchema.index({ status: 1, createdAt: -1 });
listingSchema.index({ featured: 1, status: 1, createdAt: -1 });
listingSchema.index({ owner: 1, createdAt: -1 });
listingSchema.index({ status: 1, category: 1, price: 1 });
listingSchema.index({ status: 1, price: 1 });
listingSchema.index({ status: 1, views: -1 });

export default mongoose.model('Listing', listingSchema);