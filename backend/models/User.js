import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email:    { type: String, required: true, unique: true },
  password: { type: String, required: true },
  avatar:   { type: String, default: 'https://api.dicebear.com/7.x/avataaars/svg?seed=default' },
  role:     { type: String, enum: ['admin'], default: 'admin' },
  phone:    { type: String },
  bio:      { type: String },
}, { timestamps: true });

export default mongoose.model('User', userSchema);