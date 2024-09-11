import { NextResponse } from 'next/server';
import { connectMongoDB } from '../../../../../lib/mongodb';
import Project from '../../../../../models/project';
import { ObjectId } from 'mongodb'; // Import ObjectId

export async function GET(req, { params }) {
  const { id } = params;

  // Check if id is a valid ObjectId
  if (!ObjectId.isValid(id) || id.length !== 24) {
    return NextResponse.json({ msg: "Invalid project ID format" }, { status: 400 });
  }

  try {
    await connectMongoDB();
    // Convert id to ObjectId
    const post = await Project.findOne({ _id: new ObjectId(id) });

    if (!post) {
      // Return 404 if no project is found
      return NextResponse.json({ msg: "Project not found" }, { status: 404 });
    }

    return NextResponse.json({ post }, { status: 200 });
  } catch (error) {
    console.error("Error fetching project:", error);
    return NextResponse.json({ msg: "Error fetching project" }, { status: 500 });
  }
}
