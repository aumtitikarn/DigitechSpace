import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  rathing: { type: Number, required: true },
  review: { type: String, required: true },
  projectId: { type: String, required: true },
  userEmail: { type: String, required: true },
  username: { type: String, required: true }, // ฟิลด์ username
});

const Review = mongoose.models.Review || mongoose.model('Review', reviewSchema);
export default Review;
