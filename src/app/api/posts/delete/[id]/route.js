import { NextResponse } from 'next/server';
import { connectMongoDB } from '../../../../../../lib/mongodb';
import Post from '../../../../../../models/post';
import { ObjectId } from 'mongodb';

export async function DELETE(req, { params }) {
    const { id } = params;
  
    try {
      const { client, imgbucket, filebucket } = await connectMongoDB();
      
      console.log("idแรก :",id)

      // Convert id to ObjectId
      const objectId = new ObjectId(id);

      console.log("idสอง :",objectId)
      
      // Find the blog first to get file and image IDs
      const blog = await Post.findOne({ _id: objectId });
  
      if (!blog) {
        return NextResponse.json({ message: "blog not found" }, { status: 404 });
      }
  
      // Delete images from imgbucket (GridFS)
      if (blog.imageUrl && blog.imageUrl.length > 0) {
        for (const imageName of blog.imageUrl) {
          const image = await imgbucket.find({ filename: imageName }).toArray();
          
          if (image.length > 0) {
            const imageId = image[0]._id;
  
            // Delete image from images and chunks collection
            await imgbucket.delete(imageId);
            await client.collection('images.chunks').deleteMany({ files_id: imageId });
          }
        }
      }
  
      // Delete the blog
      const result = await blog.deleteOne({ _id: objectId });
  
      if (result.deletedCount === 0) {
        return NextResponse.json({ message: "Failed to delete blog" }, { status: 500 });
      }
  
      return NextResponse.json({ message: "blog and associated files/images successfully deleted" }, { status: 200 });
  
    } catch (error) {
      console.error("Error deleting blog:", error);
      return NextResponse.json({ message: "Error deleting blog", error: error.message }, { status: 500 });
    }
  }