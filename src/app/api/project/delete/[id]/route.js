import { NextResponse } from 'next/server';
import { connectMongoDB } from '../../../../../../lib/mongodb';
import Project from '../../../../../../models/project';
import { ObjectId } from 'mongodb';

export async function DELETE(req, { params }) {
  const { id } = params;

  try {
    await connectMongoDB();
    
    // Convert id to ObjectId
    const objectId = new ObjectId(id);
    
    // Attempt to delete the project
    const result = await Project.deleteOne({ _id: objectId });

    if (result.deletedCount === 0) {
      // No project was deleted, likely because it wasn't found
      return NextResponse.json({ message: "Project not found" }, { status: 404 });
    }

    // Project was successfully deleted
    return NextResponse.json({ message: "Project successfully deleted" }, { status: 200 });

  } catch (error) {
    console.error("Error deleting project:", error);
    return NextResponse.json({ message: "Error deleting project", error: error.message }, { status: 500 });
  }
}