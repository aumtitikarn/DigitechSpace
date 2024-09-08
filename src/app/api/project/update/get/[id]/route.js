import { NextResponse } from "next/server";
import { Readable } from "stream";
import { connectMongoDB } from "../../../../../../../lib/mongodb";
import Project from "../../../../../../../models/project";
import { ObjectId } from 'mongodb';

export async function GET(req, { params }) {
  const { id } = params;

  if (!id) {
    return NextResponse.json({ error: "Project ID is required" }, { status: 400 });
  }

  try {
    await connectMongoDB();
    
    let objectId;
    try {
      objectId = new ObjectId(id);
    } catch (error) {
      return NextResponse.json({ error: "Invalid project ID format" }, { status: 400 });
    }

    const project = await Project.findOne({ _id: objectId });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // Send the project data directly, not wrapped in another object
    return NextResponse.json(project, { status: 200 });
  } catch (error) {
    console.error("Error fetching project:", error);
    return NextResponse.json({ error: "Error fetching project", details: error.message }, { status: 500 });
  }
}