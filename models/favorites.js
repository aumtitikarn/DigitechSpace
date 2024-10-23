import mongoose from 'mongoose';

// สร้าง schema สำหรับ favorite
const FavoritesSchema = new mongoose.Schema({
  email: { type: String, required: true }, // อีเมลของผู้ใช้ที่ทำการ favorite
  projectId: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true }], // ID ของโปรเจกต์ที่ถูก favorite
  status: {
    type: String,
    enum: ['pending', 'favorites'], // กำหนดค่า enum ให้รองรับ 'pending' และ 'favorites'
    default: 'favorites' // กำหนดค่าเริ่มต้นเป็น 'favorites'
  },  
  addedAt: { type: Date, default: Date.now }, // เวลาที่ทำการ favorite โปรเจกต์
});

export default mongoose.models.Favorites || mongoose.model('Favorites', FavoritesSchema);
