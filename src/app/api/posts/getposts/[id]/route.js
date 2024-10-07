import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth";
import { connectMongoDB } from '../../../../../../lib/mongodb';
import Post from '../../../../../../models/post'; // Model ของ Blog Post
import NormalUser from "../../../../../models/NormalUser";
import StudentUser from "../../../../../models/StudentUser";
import { authOption } from '../../../auth/[...nextauth]/route';

export async function GET(req) {
  const { id } = params;

  try {
    
    const session = await getServerSession(authOption);

    // ตรวจสอบว่ามี session ของผู้ใช้หรือไม่
    if (!session || !session.user || !session.user.name) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // เชื่อมต่อกับ MongoDB
    await connectMongoDB();
    const postblog = await Post.findOne({ _id: id });

    console.log("email id : ",postblog.email)

    const username = postblog.email; // ใช้ชื่อผู้ใช้จาก session

    console.log("set email id : ",username)

    // ดึง Blog ที่โพสต์โดยผู้ใช้ที่มี username ตรงกับผู้ใช้ใน session
    const allUserBlog = await Post.find({ email: username });

    return NextResponse.json(allUserBlog, { status: 200 });
  } catch (error) {
    console.error('Error in getPosts/user:', error);
    return NextResponse.json({ message: 'Internal server error', error: error.toString() }, { status: 500 });
  }
}
