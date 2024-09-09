import mongoose from 'mongoose';

// Delete the existing model from Mongoose if it exists to avoid caching issues
if (mongoose.models.Reportprojets) {
  delete mongoose.models.Reportprojets;
}

const reportprojetsSchema = new mongoose.Schema({
  name: { type: String, required: true },
  username: { type: String, required: true },
  more: { type: String, required: true }, // Ensure there's no enum constraint here
  report: {
    type: String,
    enum: [
      'profanity',
      'off-topic',
      'illegal-ads',
      'unrelated',
      'other',
    ],
    required: true,
  },
}, { timestamps: true });

const Reportprojets = mongoose.model('Reportprojets', reportprojetsSchema);

export default Reportprojets;
