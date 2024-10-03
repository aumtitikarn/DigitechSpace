import { NextResponse } from 'next/server';
import { connectMongoDB } from "../../../../../lib/mongodb";
import Project from "../../../../../models/project";
import StudentUser from "../../../../../models/StudentUser";
import NormalUser from "../../../../../models/NormalUser";

export async function GET(request) {
  try {
    await connectMongoDB();

    const projects = await Project.find({}).lean();

    const populatedProjects = await Promise.all(projects.map(async (project) => {
      let user = await StudentUser.findOne({ email: project.author }, 'name').lean();
      if (!user) {
        user = await NormalUser.findOne({ email: project.author }, 'name').lean();
      }
      return {
        ...project,
        authorName: user ? user.name : 'Unknown Author'
      };
    }));

    return NextResponse.json(populatedProjects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}