import mongoose from 'mongoose';

const inquirySchema = new mongoose.Schema({
  listing:      { type: mongoose.Schema.Types.ObjectId, ref: 'Listing', required: true },
  listingTitle: { type: String, required: true, trim: true },
  recipient:    { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  senderUser:   { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  name:         { type: String, required: true, trim: true },
  email:        { type: String, required: true, trim: true, lowercase: true },
  phone:        { type: String, required: true, trim: true },
  message:      { type: String, required: true, trim: true },
}, { timestamps: true });

export default mongoose.model('Inquiry', inquirySchema);