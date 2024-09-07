import { NextResponse } from "next/server";
import { Readable } from "stream";
import { connectMongoDB } from "../../../../../../lib/mongodb";
import Project from "../../../../../../models/project";
import { ObjectId } from 'mongodb';

export async function PUT(req, { params }) {
  const { id } = params;

  if (!ObjectId.isValid(id)) {
    return NextResponse.json({ error: "Invalid project ID" }, { status: 400 });
  }

  try {
    const { client, imgbucket, filebucket } = await connectMongoDB();

    const formData = await req.formData();
    
    const projectname = formData.get("projectname");
    const description = formData.get("description");
    const receive = JSON.parse(formData.get("receive"));
    const category = formData.get("category");
    const price = formData.get("price");
    const permission = formData.get("permission") === "true";
    const imagesToDelete = formData.getAll("imagesToDelete");
    const filesToDelete = formData.getAll("filesToDelete");

    const existingProject = await Project.findById(id);
    if (!existingProject) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // Handle image deletion
    existingProject.imageUrl = existingProject.imageUrl.filter(img => !imagesToDelete.includes(img));
    for (const imageToDelete of imagesToDelete) {
      try {
        await imgbucket.delete(imageToDelete);
      } catch (error) {
        console.error(`Failed to delete image ${imageToDelete}:`, error);
      }
    }

    // Handle new image uploads
    const newImages = formData.getAll("newImageUrl");
    for (const image of newImages) {
      if (image instanceof Blob) {
        const imageName = `${Date.now()}_${image.name}`;
        const buffer = Buffer.from(await image.arrayBuffer());
        const uploadStream = imgbucket.openUploadStream(imageName);
        await new Promise((resolve, reject) => {
          uploadStream.end(buffer, (error) => {
            if (error) reject(error);
            else resolve();
          });
        });
        existingProject.imageUrl.push(imageName);
      }
    }

    // Handle file deletion
    existingProject.filesUrl = existingProject.filesUrl.filter(file => !filesToDelete.includes(file));
    for (const fileToDelete of filesToDelete) {
      try {
        await filebucket.delete(fileToDelete);
      } catch (error) {
        console.error(`Failed to delete file ${fileToDelete}:`, error);
      }
    }

    // Handle new file uploads
    const newFiles = formData.getAll("newFilesUrl");
    for (const file of newFiles) {
      if (file instanceof Blob) {
        const fileName = `${file.name}`;
        const buffer = Buffer.from(await file.arrayBuffer());
        const uploadStream = filebucket.openUploadStream(fileName);
        await new Promise((resolve, reject) => {
          uploadStream.end(buffer, (error) => {
            if (error) reject(error);
            else resolve();
          });
        });
        existingProject.filesUrl.push(fileName);
      }
    }

    // Update other fields
    existingProject.projectname = projectname;
    existingProject.description = description;
    existingProject.receive = receive;
    existingProject.category = category;
    existingProject.price = price;
    existingProject.permission = permission;

    // Save the updated project
    await existingProject.save();

    return NextResponse.json({ message: "Project updated successfully", project: existingProject }, { status: 200 });
  } catch (error) {
    console.error("Error updating project:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}