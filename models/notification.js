import mongoose from 'mongoose';

// สร้าง schema สำหรับ notification
const notificationSchema = new mongoose.Schema({
  email: { type: String, required: true }, 
  notifications: { type: [String], default: [] }, // ใช้ default เป็นอาเรย์ว่าง
  addedAt: { type: Date, default: Date.now }, 
}, { timestamps: true }); // เพิ่ม timestamps

export default mongoose.models.Notification || mongoose.model('Notification', notificationSchema);
