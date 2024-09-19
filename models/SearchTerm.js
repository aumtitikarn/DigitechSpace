// models/SearchTerm.js
import mongoose from 'mongoose';

const SearchTermSchema = new mongoose.Schema({
  term: { type: String, required: true, unique: true },
  count: { type: Number, default: 1 },
  lastSearched: { type: Date, default: Date.now }
});

SearchTermSchema.index({ term: 1 });
SearchTermSchema.index({ count: -1 });
SearchTermSchema.index({ lastSearched: 1 });

export default mongoose.models.SearchTerm || mongoose.model('SearchTerm', SearchTermSchema);