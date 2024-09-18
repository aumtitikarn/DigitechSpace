import mongoose from 'mongoose';


// สร้าง schema สำหรับ favorite
const FavoritesSchema = new mongoose.Schema({
  username: { type: String, required: true }, // ชื่อผู้ใช้ที่ทำการ favorite
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true }, // ID ของโปรเจกต์ที่ถูก favorite
  projectname: { type: String , required: true }, // ชื่อโปรเจกต์
  description: { type: String, required: true  }, // คำบรรยายโปรเจกต์
  receive: [{ type: String , required: true }], // รายการที่ได้รับ
  price: { type: Number, required: true  }, // ราคา
  review: { type: Number , required: true }, // จำนวนรีวิว
  sold: { type: Number, required: true  }, // จำนวนที่ขายไป
  rathing: { type: Number, required: true  }, // การให้คะแนน
  imageUrl: [{ type: String , required: true }], // URL ของรูปภาพ
  author: { type: String , required: true }, // ผู้เขียน
  addedAt: { type: Date, default: Date.now } // เวลาที่ทำการ favorite โปรเจกต์
});

// ตรวจสอบว่ามีการสร้างโมเดล Favorites หรือยัง ถ้ายังไม่มีก็สร้าง
export default mongoose.models.Favorites || mongoose.model('Favorites', FavoritesSchema);
