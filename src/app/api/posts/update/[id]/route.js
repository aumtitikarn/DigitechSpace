import { connectMongoDB } from "../../../../../../lib/mongodb";
import Post from "../../../../../../models/post";
import { NextResponse } from "next/server";

export async function PUT(req, { params }) {
    try {
      const { id } = params;
      
      const formData = await req.formData();
      
      await connectMongoDB();
      
      const existingPost = await Post.findById(id);
      if (!existingPost) {
        return NextResponse.json({ message: "Post not found" }, { status: 404 });
      }
  
      // รับข้อมูลพื้นฐาน
      const updateData = {
        topic: formData.get("newTopic"),
        course: formData.get("newCourse"),
        description: formData.get("newDescription"),
        selectedCategory: formData.get("newSelectedCategory"),
      };
  
      // รับรูปภาพเดิม
      const existingImages = formData.getAll("existingImages");
      let finalImages = [...existingImages];
  
      // จัดการรูปภาพใหม่
      const newImageFiles = formData.getAll("newImages");
      for (const file of newImageFiles) {
        if (file instanceof Blob) {
          try {
            // สร้างชื่อไฟล์ที่ไม่ซ้ำกัน
            const fileName = `${Date.now()}_${file.name}`;
            
            // สร้าง buffer จากไฟล์
            const buffer = Buffer.from(await file.arrayBuffer());
            
            // สร้าง stream สำหรับอัพโหลด
            const { imgbucket } = await connectMongoDB();
            const uploadStream = imgbucket.openUploadStream(fileName);
            
            // อัพโหลดไฟล์
            await new Promise((resolve, reject) => {
              uploadStream.end(buffer, (error) => {
                if (error) reject(error);
                else resolve();
              });
            });
            
            // เพิ่มชื่อไฟล์ลงในรายการรูปภาพ
            finalImages.push(fileName);
            
          } catch (error) {
            console.error(`Error uploading file ${file.name}:`, error);
          }
        }
      }
  
      // อัพเดทข้อมูลทั้งหมด
      updateData.imageUrl = finalImages;
  
      const updatedPost = await Post.findByIdAndUpdate(
        id,
        { $set: updateData },
        { new: true, runValidators: true }
      );
  
      if (!updatedPost) {
        return NextResponse.json({ message: "Failed to update post" }, { status: 400 });
      }
  
      return NextResponse.json({ 
        message: "Post updated successfully",
        post: updatedPost 
      }, { status: 200 });
  
    } catch (error) {
      console.error("Error updating post:", error);
      return NextResponse.json({ 
        message: "Error updating post",
        error: error.message 
      }, { status: 500 });
    }
  }