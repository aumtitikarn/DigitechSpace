// src/models/Review.ts

import mongoose from 'mongoose';

const ReviewSchema = new mongoose.Schema({
  rating: {
    type: Number,
    required: true,
  },
  review: {
    type: String,
    required: true,
  },
  projectId: {
    type: String,
    required: true,
  },
  userEmail: {
    type: String,
    required: true,
  },
}, { timestamps: true });

export default mongoose.models.Review || mongoose.model('Review', ReviewSchema);
