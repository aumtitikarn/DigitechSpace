import { connectToDatabase } from 'path/to/database/connection';
import Project from '../../../../../models/project'; // โมเดลของ Project
import Review from '../../../../../models/review';   // โมเดลของ Review

export default async function handler(req, res) {
  const { projectId } = req.body;

  try {
    await connectToDatabase();

    // ดึงรีวิวทั้งหมดของโปรเจกต์นี้
    const reviews = await Review.find({ projectId });

    if (reviews.length === 0) {
      return res.status(404).json({ message: 'No reviews found for this project.' });
    }

    // คำนวณค่าเฉลี่ย rating จาก reviews
    const totalRating = reviews.reduce((sum, review) => sum + review.rathing, 0);
    const averageRating = totalRating / reviews.length;

    // ตรวจสอบว่าค่าเฉลี่ยไม่เกิน 5
    const finalRating = averageRating > 5 ? 5 : averageRating;

    // อัปเดตค่า rating ในโปรเจกต์
    const updatedProject = await Project.findByIdAndUpdate(
      projectId,
      { rathing: finalRating },  // อัปเดตฟิลด์ rating
      { new: true }
    );

    res.status(200).json({
      message: 'Rating updated successfully.',
      updatedProject,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating rating', error });
  }
}
