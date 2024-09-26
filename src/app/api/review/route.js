import { connectMongoDB } from "../../../../lib/mongodb"; // Update with your MongoDB connection utility
import Review from '../../../../models/review'; 
import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth";
import { authOptions } from '../../../app/api/auth/[...nextauth]/route'; // ตรวจสอบชื่อให้ถูกต้อง

export async function POST(req) {
  const session = await getServerSession(authOptions);
  
  // Handle unauthorized access
  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const username = session.user?.name;
  const userEmail = session.user?.email;

  try {
    await connectMongoDB();
    const data = await req.json();
    
    console.log("Received data:", JSON.stringify(data, null, 2));

    const { rathing, review, projectId } = data;

    if (!rathing || !review || !projectId || !userEmail || !username) {
      return NextResponse.json({ message: 'Missing data' }, { status: 400 });
    }

    const newReview = new Review({
      rathing,
      review,
      projectId,
      userEmail,
      username
    });
    
    console.log("New Review to save:", newReview); // ตรวจสอบค่าก่อนบันทึก
    
    await newReview.save();
    return NextResponse.json({ message: 'Review saved successfully' });
  } catch (error) {
    console.error('Error saving review:', error);
    return NextResponse.json({ message: 'Failed to save review', error: error.message }, { status: 500 });
  }
}


export async function GET(req) {
  try {
    await connectMongoDB(); // เชื่อมต่อกับ MongoDB
    const reviews = await Review.find(); // ดึงข้อมูลทั้งหมดจากฐานข้อมูล

    console.log('Fetched reviews:', reviews); // Log the reviews to check if they are fetched

    return NextResponse.json({ message: 'Reviews fetched successfully', data: reviews });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json({ message: 'Failed to fetch reviews', error: error.message }, { status: 500 });
  }
}
