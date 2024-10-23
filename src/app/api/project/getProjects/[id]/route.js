import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth";
import { connectMongoDB } from '../../../../../../lib/mongodb';
import Project from '../../../../../../models/project';
import StudentUser from '../../../../../../models/StudentUser';
import NormalUser from "../../../../../../models/NormalUser";
import { authOption } from '../../../../../app/api/auth/[...nextauth]/route';

const isValidHttpUrl = (string) => {
  let url;
  try {
    url = new URL(string);
  } catch (_) {
    return false;
  }
  return url.protocol === "http:" || url.protocol === "https:";
};

const useProxy = (url) => `/api/proxy?url=${encodeURIComponent(url)}`;

export async function GET(req,{ params }) {
  const { id } = params;

  try {
    
    const session = await getServerSession(authOption);

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

    const username = User.email; 

    const postproject = await Project.findOne({ email: username });

    console.log("set email id : ",postproject)

    const allUserProject = await Project.find({ email: username });

    const publishedProjects = allUserProject.filter(project => project.permission === true);
    console.log(`Published projects for ${publishedProjects.length}`);


    return NextResponse.json(publishedProjects, { status: 200 });
  } catch (error) {
    console.error('Error in getPosts/user:', error);
    return NextResponse.json({ message: 'Internal server error', error: error.toString() }, { status: 500 });
  }
}
