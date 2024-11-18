import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth";
import { connectMongoDB } from '../../../../../../lib/mongodb';
import Post from '../../../../../../models/post'; // Model ของ Blog Post
import NormalUser from "../../../../../../models/NormalUser";
import StudentUser from "../../../../../../models/StudentUser";
import { authOptions } from '../../../auth/auth.config';

export async function GET(req,{ params }) {
  const { id } = params;

  try {
    
    const session = await getServerSession(authOptions);

    // ตรวจสอบว่ามี session ของผู้ใช้หรือไม่
    if (!session || !session.user || !session.user.name) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }



    // เชื่อมต่อกับ MongoDB
    await connectMongoDB();

    const normalUser = await NormalUser.findOne({ _id: id });
    const studentUser = await StudentUser.findOne({ _id: id });

    const User = studentUser || normalUser;

    console.log("email id : ",User.email)

    const username = User.email; // ใช้ชื่อผู้ใช้จาก session

    const postblog = await Post.findOne({ email: username });

    console.log("set email id : ",postblog)

    // ดึง Blog ที่โพสต์โดยผู้ใช้ที่มี username ตรงกับผู้ใช้ใน session
    const allUserBlog = await Post.find({ email: username });

    return NextResponse.json(allUserBlog, { status: 200 });
  } catch (error) {
    console.error('Error in getPosts/user:', error);
    return NextResponse.json({ message: 'Internal server error', error: error.toString() }, { status: 500 });
  }
}
