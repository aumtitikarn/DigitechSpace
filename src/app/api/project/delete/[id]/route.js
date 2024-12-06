import { NextResponse } from 'next/server';
import { connectMongoDB } from '../../../../../../lib/mongodb';
import Project from '../../../../../../models/project';
import Favorites from '../../../../../../models/favorites';
import { ObjectId } from 'mongodb';

export async function DELETE(req, { params }) {
  const { id } = params; // ดึง projectId จาก URL

  try {
    const { client, imgbucket, filebucket } = await connectMongoDB();
    
    // Convert id to ObjectId
    const objectId = new ObjectId(id);
    
    // Find the project first to get file and image IDs
    const project = await Project.findOne({ _id: objectId });

    if (!project) {
      return NextResponse.json({ message: "Project not found" }, { status: 404 });
    }

    // Delete files from filebucket (GridFS)
    if (project.filesUrl && project.filesUrl.length > 0) {
      for (const fileName of project.filesUrl) {
        const file = await filebucket.find({ filename: fileName }).toArray();
        if (file.length > 0) {
          const fileId = file[0]._id;

          // Delete file from files and chunks collection
          await filebucket.delete(fileId);
          await client.collection('files.chunks').deleteMany({ files_id: fileId });
        }
      }
    }

    // Delete images from imgbucket (GridFS)
    if (project.imageUrl && project.imageUrl.length > 0) {
      for (const imageName of project.imageUrl) {
        const image = await imgbucket.find({ filename: imageName }).toArray();
        if (image.length > 0) {
          const imageId = image[0]._id;

          // Delete image from images and chunks collection
          await imgbucket.delete(imageId);
          await client.collection('images.chunks').deleteMany({ files_id: imageId });
        }
      }
    }

    // Delete the project
    const result = await Project.deleteOne({ _id: objectId });

    // Remove projectId from favorites of all users
    const deletedFavorites = await Favorites.updateMany(
      {}, // ไม่มีเงื่อนไขเพิ่มเติมเพื่ออัปเดต favorites ของทุก user
      { $pull: { projectId: id } } // ใช้ projectId ที่เป็น string
    );
    console.log("Updated favorites:", deletedFavorites.modifiedCount);

    if (result.deletedCount === 0) {
      return NextResponse.json({ message: "Failed to delete project" }, { status: 500 });
    }

    return NextResponse.json({ 
      message: "Project and associated files/images successfully deleted" 
    }, { status: 200 });

  } catch (error) {
    console.error("Error deleting project:", error);
    return NextResponse.json({ 
      message: "Error deleting project", 
      error: error.message 
    }, { status: 500 });
  }
}
