import mongoose from 'mongoose';

// Delete the existing model from Mongoose if it exists to avoid caching issues
if (mongoose.models.Reportprojets) {
  delete mongoose.models.Reportprojets;
}

const reportprojetsSchema = new mongoose.Schema({
  name: { type: String, required: true },
  username: { type: String, required: true },
  email:{ type: String, required: true },
  more: { type: String, required: true },
  projectId: { type: String, required: true },
  author: { type: String, required: true }, // Ensure there's no enum constraint here
  report: {
    type: String,
    enum: [
      'ได้รับไฟล์ไม่ครบตามที่กำหนด',
      'ไฟล์ไม่ทำงานตามที่ควรจะเป็น',
      'เข้าใจยาก ไม่มีคู่มือการใช้',
      'โครงงานมีการละเมิดลิขสิทธิ์',
      'อื่นๆ',
    ],
    required: true,
  },
}, { timestamps: true });

const Reportprojets = mongoose.model('Reportprojets', reportprojetsSchema);

export default Reportprojets;
