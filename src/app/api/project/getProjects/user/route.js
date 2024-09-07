import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth";
import { connectMongoDB } from '../../../../../../lib/mongodb';
import Project from '../../../../../../models/project';
import { authOption } from '../../../../../app/api/auth/[...nextauth]/route';

export async function GET(req) {
  try {
    const session = await getServerSession(authOption);
    if (!session || !session.user || !session.user.email) {
      console.log('Session or user email is missing:', session);
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await connectMongoDB();

    const userEmail = session.user.email;
    console.log('Searching projects for email:', userEmail);

    // ค้นหาโปรเจกต์โดยใช้ฟิลด์ 'email' แทน 'author'
    const allUserProjects = await Project.find({ email: userEmail });
    console.log(`Total projects found for ${userEmail}: ${allUserProjects.length}`);

    // กรองเฉพาะโปรเจกต์ที่มี permission: true
    const publishedProjects = allUserProjects.filter(project => project.permission === true);
    console.log(`Published projects for ${userEmail}: ${publishedProjects.length}`);

    if (publishedProjects.length === 0) {
      console.log(`No published projects found for email: ${userEmail}`);
      if (allUserProjects.length > 0) {
        console.log(`User has ${allUserProjects.length} unpublished projects.`);
        return NextResponse.json({ 
          message: 'No published projects found',
          unpublishedCount: allUserProjects.length
        }, { status: 404 });
      } else {
        return NextResponse.json({ message: 'No projects found' }, { status: 404 });
      }
    }

    console.log(`Returning ${publishedProjects.length} published projects`);
    return NextResponse.json(publishedProjects, { status: 200 });
  } catch (error) {
    console.error('Error in getProjects/user:', error);
    return NextResponse.json({ message: 'Internal server error', error: error.toString() }, { status: 500 });
  }
}