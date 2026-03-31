import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import listingRoutes from './routes/listing.js';
import companyRoutes from './routes/company.js';
import inquiryRoutes from './routes/inquiry.js';
import userRoutes from './routes/user.js';
dotenv.config();

const app = express();


app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));


app.use(cookieParser());

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use('/api/auth', authRoutes);
app.use('/api/listings', listingRoutes);
app.use('/api/inquiries', inquiryRoutes);
app.use('/api/company', companyRoutes);
app.use('/api/users', userRoutes);


app.get('/', (req, res) => {
  res.json({ message: ' LuxEstate API is running' });
});


app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  res.status(statusCode).json({ success: false, statusCode, message });
});


mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/luxestate')
  .then(() => {
    console.log(' MongoDB Connected');
    app.listen(process.env.PORT || 5000, () => {
      console.log(` Server running on port ${process.env.PORT || 5000}`);
    });
  })
  .catch(err => console.error(' MongoDB connection error:', err));