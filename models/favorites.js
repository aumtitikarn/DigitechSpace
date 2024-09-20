import mongoose from 'mongoose';

// สร้าง schema สำหรับ favorite
const FavoritesSchema = new mongoose.Schema({
  email: { type: String, required: true }, // อีเมลของผู้ใช้ที่ทำการ favorite
  projectId: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true }], // ID ของโปรเจกต์ที่ถูก favorite
  addedAt: { type: Date, default: Date.now }, // เวลาที่ทำการ favorite โปรเจกต์
});

// ตรวจสอบว่ามีการสร้างโมเดล Favorites หรือยัง ถ้ายังไม่มีก็สร้าง
export default mongoose.models.Favorites || mongoose.model('Favorites', FavoritesSchema);
