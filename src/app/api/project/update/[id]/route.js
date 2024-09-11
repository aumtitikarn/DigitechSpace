// import { NextResponse } from "next/server";
// import { Readable } from "stream";
// import { connectMongoDB } from "../../../../../../lib/mongodb";
// import Project from "../../../../../../models/project";
// import { ObjectId } from 'mongodb';

// export async function PUT(req, { params }) {
//   const { id } = params;

//   if (!ObjectId.isValid(id)) {
//     return NextResponse.json({ error: "Invalid project ID" }, { status: 400 });
//   }

//   try {
//     const { client, imgbucket, filebucket } = await connectMongoDB();

//     const formData = await req.formData();
    
//     const projectname = formData.get("projectname");
//     const description = formData.get("description");
//     const receive = JSON.parse(formData.get("receive"));
//     const category = formData.get("category");
//     const price = formData.get("price");
//     const permission = formData.get("permission") === "true";
//     const imagesToDelete = formData.getAll("imagesToDelete");
//     const filesToDelete = formData.getAll("filesToDelete");

//     const existingProject = await Project.findById(id);
//     if (!existingProject) {
//       return NextResponse.json({ error: "Project not found" }, { status: 404 });
//     }

//     // Handle image deletion
//     existingProject.imageUrl = existingProject.imageUrl.filter(img => !imagesToDelete.includes(img));
//     for (const imageToDelete of imagesToDelete) {
//       try {
//         await imgbucket.delete(imageToDelete);
//       } catch (error) {
//         console.error(`Failed to delete image ${imageToDelete}:`, error);
//       }
//     }

//     // Handle new image uploads
//     const newImages = formData.getAll("newImageUrl");
//     for (const image of newImages) {
//       if (image instanceof Blob) {
//         const imageName = `${Date.now()}_${image.name}`;
//         const buffer = Buffer.from(await image.arrayBuffer());
//         const uploadStream = imgbucket.openUploadStream(imageName);
//         await new Promise((resolve, reject) => {
//           uploadStream.end(buffer, (error) => {
//             if (error) reject(error);
//             else resolve();
//           });
//         });
//         existingProject.imageUrl.push(imageName);
//       }
//     }

//     // Handle file deletion
//     existingProject.filesUrl = existingProject.filesUrl.filter(file => !filesToDelete.includes(file));
//     for (const fileToDelete of filesToDelete) {
//       try {
//         await filebucket.delete(fileToDelete);
//       } catch (error) {
//         console.error(`Failed to delete file ${fileToDelete}:`, error);
//       }
//     }

//     // Handle new file uploads
//     const newFiles = formData.getAll("newFilesUrl");
//     for (const file of newFiles) {
//       if (file instanceof Blob) {
//         const fileName = `${file.name}`;
//         const buffer = Buffer.from(await file.arrayBuffer());
//         const uploadStream = filebucket.openUploadStream(fileName);
//         await new Promise((resolve, reject) => {
//           uploadStream.end(buffer, (error) => {
//             if (error) reject(error);
//             else resolve();
//           });
//         });
//         existingProject.filesUrl.push(fileName);
//       }
//     }

//     // Update other fields
//     existingProject.projectname = projectname;
//     existingProject.description = description;
//     existingProject.receive = receive;
//     existingProject.category = category;
//     existingProject.price = price;
//     existingProject.permission = permission;

//     // Save the updated project
//     await existingProject.save();

//     return NextResponse.json({ message: "Project updated successfully", project: existingProject }, { status: 200 });
//   } catch (error) {
//     console.error("Error updating project:", error);
//     return NextResponse.json({ error: "Internal server error" }, { status: 500 });
//   }
// }
import { NextResponse } from "next/server";
import { connectMongoDB } from "../../../../../../lib/mongodb";
import Project from "../../../../../../models/project";
import { ObjectId } from 'mongodb';

export async function PUT(req, { params }) {
  const { id } = params;

  // ตรวจสอบว่า ID นั้นถูกต้องหรือไม่
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
    const status = "pending";
    const imagesToDelete = formData.getAll("imagesToDelete");
    const filesToDelete = formData.getAll("filesToDelete");

    // หาโปรเจคที่ต้องการแก้ไข
    const existingProject = await Project.findById(id);
    if (!existingProject) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // จัดการการลบรูปภาพที่ถูกเปลี่ยนแปลง
    const imagesForDeletion = existingProject.imageUrl.filter(img => imagesToDelete.includes(img));
    for (const imageToDelete of imagesForDeletion) {
      const imgFile = await imgbucket.find({ filename: imageToDelete }).toArray();
      if (imgFile.length > 0) {
        const imageId = imgFile[0]._id;
        try {
          // ลบไฟล์ใน GridFS
          await imgbucket.delete(imageId);
          await client.collection('images.chunks').deleteMany({ files_id: imageId });
          console.log(`Deleted image: ${imageToDelete}`);
        } catch (error) {
          console.error(`Failed to delete image ${imageToDelete}:`, error);
        }
      } else {
        console.error(`Image ${imageToDelete} not found in GridFS`);
      }
    }
    // ลบข้อมูลรูปภาพออกจาก project
    existingProject.imageUrl = existingProject.imageUrl.filter(img => !imagesToDelete.includes(img));

    // จัดการการอัปโหลดรูปภาพใหม่
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
      } else {
        console.error(`Invalid file format for image: ${image.name}`);
      }
    }

    // จัดการการลบไฟล์ที่ถูกเปลี่ยนแปลง
    const filesForDeletion = existingProject.filesUrl.filter(file => filesToDelete.includes(file));
    for (const fileToDelete of filesForDeletion) {
      const file = await filebucket.find({ filename: fileToDelete }).toArray();
      if (file.length > 0) {
        const fileId = file[0]._id;
        try {
          // ลบไฟล์ใน GridFS
          await filebucket.delete(fileId);
          await client.collection('files.chunks').deleteMany({ files_id: fileId });
          console.log(`Deleted file: ${fileToDelete}`);
        } catch (error) {
          console.error(`Failed to delete file ${fileToDelete}:`, error);
        }
      } else {
        console.error(`File ${fileToDelete} not found in GridFS`);
      }
    }
    // ลบข้อมูลไฟล์ออกจาก project
    existingProject.filesUrl = existingProject.filesUrl.filter(file => !filesToDelete.includes(file));

    // จัดการการอัปโหลดไฟล์ใหม่
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
      } else {
        console.error(`Invalid file format for file: ${file.name}`);
      }
    }

    // อัปเดตข้อมูลอื่น ๆ
    existingProject.projectname = projectname;
    existingProject.description = description;
    existingProject.receive = receive;
    existingProject.category = category;
    existingProject.price = price;
    existingProject.permission = permission;
    existingProject.status = status;

    // บันทึกการแก้ไข
    await existingProject.save();

    return NextResponse.json({ message: "Project updated successfully", project: existingProject }, { status: 200 });
  } catch (error) {
    console.error("Error updating project:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
