import { NextResponse } from 'next/server';
import { connectMongoDB } from "../../../../../lib/mongodb";
import StudentUser from "../../../../../models/StudentUser";
import StudentUser from "../../../../../models/StudentUser";

export async function POST(request) {
  try {
    const { author } = await request.json();

    if (!author) {
      return NextResponse.json({ message: 'Author is required' }, { status: 400 });
    }

    await connectMongoDB();

    let user = await StudentUser.findOne({ email: email });
    let role = 'student';

    if (!user) {
      user = await NormalUser.findOne({ email: email });
      role = 'normal';
    }

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      name: user.name,
      email: user.email,
      role: role,
      username: user.username,
      imageUrl: user.imageUrl
    });

  } catch (error) {
    console.error('Error fetching user details:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}