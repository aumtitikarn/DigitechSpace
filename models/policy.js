import mongoose from "mongoose";

const policySchema = new mongoose.Schema({
  type: { type: String, required: true, unique: true },
  policy: { type: String, required: true },
  creator : { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});


export default mongoose.models.Policy || mongoose.model("Policy", policySchema);