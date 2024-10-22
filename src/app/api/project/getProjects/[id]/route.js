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

// export async function GET(req) {
//   try {
//     const session = await getServerSession(authOption);
//     if (!session || !session.user || !session.user.email) {
//       console.log('Session or user email is missing:', session);
//       return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
//     }

//     await connectMongoDB();

//     const userEmail = session.user.email;
//     console.log('Searching projects for email:', userEmail);

//     // ค้นหาโปรเจกต์โดยใช้ฟิลด์ 'email' แทน 'author'
//     const allUserProjects = await Project.find({ email: userEmail }).lean();
//     console.log(`Total projects found for ${userEmail}: ${allUserProjects.length}`);

//     // กรองเฉพาะโปรเจกต์ที่มี permission: true
//     const publishedProjects = allUserProjects.filter(project => project.permission === true);
//     console.log(`Published projects for ${userEmail}: ${publishedProjects.length}`);

//     // ดึงข้อมูลผู้ใช้
//     const user = await StudentUser.findOne({ email: userEmail }, 'name imageUrl').lean();

//     let authorName = 'Unknown Author';
//     let profileImage = null;

//     if (user) {
//       authorName = user.name;
//       if (user.imageUrl) {
//         profileImage = isValidHttpUrl(user.imageUrl)
//           ? useProxy(user.imageUrl)
//           : `/api/project/images/${user.imageUrl}`;
//       }
//     }

//     if (publishedProjects.length === 0) {
//       console.log(`No published projects found for email: ${userEmail}`);
//       if (allUserProjects.length > 0) {
//         console.log(`User has ${allUserProjects.length} unpublished projects.`);
//         return NextResponse.json({ 
//           message: 'No published projects found',
//           unpublishedCount: allUserProjects.length,
//           authorName,
//           profileImage
//         });
//       } else {
//         return NextResponse.json({ 
//           message: 'No projects found',
//           authorName,
//           profileImage
//         });
//       }
//     }

//     // เพิ่มข้อมูลผู้สร้างให้กับทุกโปรเจค
//     const projectsWithAuthorDetails = publishedProjects.map(project => ({
//       ...project,
//       authorName,
//       profileImage
//     }));

//     console.log(`Returning ${projectsWithAuthorDetails.length} published projects`);
//     return NextResponse.json(projectsWithAuthorDetails, { status: 200 });
//   } catch (error) {
//     console.error('Error in getProjects/user:', error);
//     return NextResponse.json({ message: 'Internal server error', error: error.toString() }, { status: 500 });
//   }
// }

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

    const username = User.email; // ใช้ชื่อผู้ใช้จาก session

    const postproject = await Project.findOne({ email: username });

    console.log("set email id : ",postproject)

    // ดึง Blog ที่โพสต์โดยผู้ใช้ที่มี username ตรงกับผู้ใช้ใน session
    const allUserProject = await Project.find({ email: username });

    const publishedProjects = allUserProject.filter(project => project.permission === true);
    console.log(`Published projects for ${publishedProjects.length}`);


    return NextResponse.json(publishedProjects, { status: 200 });
  } catch (error) {
    console.error('Error in getPosts/user:', error);
    return NextResponse.json({ message: 'Internal server error', error: error.toString() }, { status: 500 });
  }
}
