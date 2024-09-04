import { connectMongoDB } from '../../../../../lib/mongodb';
import StudentUser from '../../../../../models/StudentUser';
import NormalUser from '../../../../../models/NormalUser';
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  try {
    const { email } = params; // ดึงข้อมูลจาก params

    if (!email) {
      return NextResponse.json({ message: 'Email is required' }, { status: 400 });
    }

    // เชื่อมต่อกับ MongoDB
    await connectMongoDB();

    // ตรวจสอบข้อมูลใน NormalUser และ StudentUser
    let user = await NormalUser.findOne({ email });
    if (!user) {
      user = await StudentUser.findOne({ email });
    }

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json({ message: 'Error fetching user', error: error.message }, { status: 500 });
  }
}
