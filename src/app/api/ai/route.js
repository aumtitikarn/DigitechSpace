import { connectMongoDB } from '../../../../lib/mongodb';
import StudentUser from '../../../../models/StudentUser';
import NormalUser from '../../../../models/NormalUser';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    // เชื่อมต่อกับ MongoDB
    await connectMongoDB();
    console.log('Connected to MongoDB');

    // รับ session ของผู้ใช้
    const session = await getServerSession();
    console.log('Session:', session);

    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // รับข้อมูลจาก body ของ request
    const data = await req.json();
    console.log('Request Data:', data);

    const { roleai } = data;

    if (roleai === undefined ) {
      return NextResponse.json({ message: 'Invalid input' }, { status: 400 });
    }

    // ตรวจสอบว่าผู้ใช้มีอยู่ใน NormalUser หรือ StudentUser
    let updatedUser = await NormalUser.findOneAndUpdate(
      { email: session.user.email },
      {
        $set: {
          roleai,
        },
      },
      { new: true }
    );

    if (!updatedUser) {
      updatedUser = await StudentUser.findOneAndUpdate(
        { email: session.user.email },
        {
          $set: {
            roleai,
          },
        },
        { new: true }
      );
    }

    if (!updatedUser) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    console.log('Updated User:', updatedUser);

    return NextResponse.json(
      { message: 'User updated successfully', user: updatedUser },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      { message: 'Error updating user', error: error.message },
      { status: 500 }
    );
  }
}