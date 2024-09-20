import { connectMongoDB } from "../../../../lib/mongodb"; // Update with your MongoDB connection utility
import Review from '../../../../models/review'; 
import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth";
import { authOptions } from '../../../app/api/auth/[...nextauth]/route'; // ตรวจสอบชื่อให้ถูกต้อง

export async function POST(req) {
  // ดึงเซสชัน
  const session = await getServerSession(authOptions);
  const userEmail = session?.user?.email;

  try {
    await connectMongoDB();
    const data = await req.json(); // อ่านข้อมูลจาก req หนึ่งครั้ง
    
    console.log("Received data:", data); // Log received data to check its correctness

    const { rating, review, projectId } = data; // ใช้ข้อมูลที่อ่านได้

    // ตรวจสอบข้อมูลที่ขาดหาย
    if (!rating || !review || !projectId || !userEmail) {
      return NextResponse.json({ message: 'Missing data' }, { status: 400 });
    }

    // สร้างรีวิวใหม่
    const newReview = new Review({
      rating,
      review,
      projectId,
      userEmail, // ใช้อีเมลผู้ใช้จากเซสชัน
    });

    await newReview.save(); // บันทึกรีวิว
    return NextResponse.json({ message: 'Review saved successfully' });
  } catch (error) {
    console.error('Error saving review:', error);
    return NextResponse.json({ message: 'Failed to save review', error: error.message }, { status: 500 });
  }
}
