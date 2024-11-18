import { NextResponse } from "next/server";
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
    
    // ค้นหา project เดิม
    const existingProject = await Project.findById(id);
    if (!existingProject) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // เก็บค่า iduser และ email จาก project เดิม
    const { iduser, email } = existingProject;

    // จัดการรูปภาพที่จะลบ
    const imagesToDelete = formData.getAll("imagesToDelete");
    const imagesForDeletion = existingProject.imageUrl.filter(img => imagesToDelete.includes(img));
    for (const imageToDelete of imagesForDeletion) {
      const imgFile = await imgbucket.find({ filename: imageToDelete }).toArray();
      if (imgFile.length > 0) {
        const imageId = imgFile[0]._id;
        try {
          await imgbucket.delete(imageId);
          await client.collection('images.chunks').deleteMany({ files_id: imageId });
        } catch (error) {
          console.error(`Failed to delete image ${imageToDelete}:`, error);
        }
      }
    }
    const remainingImages = existingProject.imageUrl.filter(img => !imagesToDelete.includes(img));

    // จัดการรูปภาพใหม่
    const newImages = formData.getAll("newImageUrl");
    const uploadedImages = [];
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
        uploadedImages.push(imageName);
      }
    }

    // จัดการไฟล์ที่จะลบ
    const filesToDelete = formData.getAll("filesToDelete");
    const filesForDeletion = existingProject.filesUrl.filter(file => filesToDelete.includes(file));
    for (const fileToDelete of filesForDeletion) {
      const file = await filebucket.find({ filename: fileToDelete }).toArray();
      if (file.length > 0) {
        const fileId = file[0]._id;
        try {
          await filebucket.delete(fileId);
          await client.collection('files.chunks').deleteMany({ files_id: fileId });
        } catch (error) {
          console.error(`Failed to delete file ${fileToDelete}:`, error);
        }
      }
    }
    const remainingFiles = existingProject.filesUrl.filter(file => !filesToDelete.includes(file));

    // จัดการไฟล์ใหม่
    const newFiles = formData.getAll("newFilesUrl");
    const uploadedFiles = [];
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
        uploadedFiles.push(fileName);
      }
    }

    // อัพเดทโดยใช้ findOneAndUpdate แทน replaceOne
    const updatedProject = await Project.findOneAndUpdate(
      { _id: id },
      {
        $set: {
          projectname: formData.get("projectname"),
          description: formData.get("description"),
          receive: JSON.parse(formData.get("receive")),
          category: formData.get("category"),
          price: formData.get("price"),
          permission: formData.get("permission") === "true",
          status: "pending",
          imageUrl: [...remainingImages, ...uploadedImages],
          filesUrl: [...remainingFiles, ...uploadedFiles],
          iduser: iduser,
          email: email
        }
      },
      { 
        new: true,
        runValidators: true
      }
    );

    if (!updatedProject) {
      return NextResponse.json({ error: "Failed to update project" }, { status: 400 });
    }

    return NextResponse.json({ 
      message: "Project updated successfully", 
      project: updatedProject 
    }, { status: 200 });

  } catch (error) {
    console.error("Error updating project:", error);
    return NextResponse.json({ 
      error: "Internal server error", 
      details: error.message 
    }, { status: 500 });
  }
}