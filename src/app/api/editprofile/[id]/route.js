import mongoose from "mongoose"; // Add this import
import { Readable } from "stream";
import { connectMongoDB } from "../../../../../lib/mongodb";
import NormalUser from "../../../../../models/NormalUser";
import StudentUser from "../../../../../models/StudentUser";
import { NextResponse } from "next/server";

export async function PUT(req, { params }) {
  try {
    const { id } = params; 
    const { imgbucket } = await connectMongoDB(); 

    const formData = await req.formData();

    let name = "";
    let email = "";
    let line = "";
    let facebook = "";
    let phonenumber = "";
    let imageUrl = [];
    let favblog = [];

    // Iterate over form data and handle each field
    for (const [key, value] of formData.entries()) {
      switch (key) {
        case "name":
          name = value.toString();
          break;
        case "email":
          email = value.toString();
          break;
        case "line":
          line = value.toString();
          break;
        case "facebook":
          facebook = value.toString();
          break;
        case "phonenumber":
          phonenumber = value.toString();
          break;
        case "imageUrl":
          if (value instanceof Blob && value.type.startsWith('image/')) {
            const imageName = `${Date.now()}_${value.name}`;
            const buffer = Buffer.from(await value.arrayBuffer());
            const stream = Readable.from(buffer);
            const uploadStream = imgbucket.openUploadStream(imageName);
            await new Promise((resolve, reject) => {
              stream.pipe(uploadStream).on("finish", resolve).on("error", reject);
            });
            imageUrl.push(imageName);
          }
          break;
        case "favblog":

          const favBlogEntry = JSON.parse(value);

          const favBlogImageUrl = Array.isArray(favBlogEntry.imageUrl)
            ? favBlogEntry.imageUrl
            : [favBlogEntry.imageUrl];

          favblog.push({
            blogId: new mongoose.Types.ObjectId(favBlogEntry.blogId),
            imageUrl: favBlogImageUrl,
            topic: favBlogEntry.topic,
          });
          break;
      }
    }

    const updateData = {
      ...(name && { name }),
      ...(email && { email }),
      ...(line && { line }),
      ...(facebook && { facebook }),
      ...(phonenumber && { phonenumber }),
    };

    if (imageUrl.length > 0) {
      updateData.imageUrl = imageUrl;
    }

    if (line) {
      updateData.line = line;
    }
    if (facebook) {
      updateData.facebook = facebook; 
    }

    if (favblog.length > 0) {
      updateData.$push = { favblog: { $each: favblog } };
    }

    if (favblog.length > 0) {
      updateData.$push = { favblog: { $each: favblog } };
    }

    let updatedUser = await NormalUser.findByIdAndUpdate(id,
      { $set: updateData },
      { new: true, runValidators: true, strict: false }
    );

    if (!updatedUser) {
      updatedUser = await StudentUser.findByIdAndUpdate(
        id,
        { $set: updateData },
        { new: true, runValidators: true, strict: false }
      );
    }

    if (!updatedUser) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ user: updatedUser }, { status: 200 });
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json({ message: 'Error updating user' }, { status: 500 });
  }
}

export async function GET(req, { params }) {
  const { id } = params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ message: "Invalid ID format" }, { status: 400 });
  }

  await connectMongoDB();
  
  const post = await NormalUser.findOne({ _id: id });
  const posts = await StudentUser.findOne({ _id: id });

  try {
    // ค้นหาข้อมูลผู้ใช้จาก NormalUser
    const normalUser = await NormalUser.findOne({ _id: id });
    // ค้นหาข้อมูลผู้ใช้จาก StudentUser
    const studentUser = await StudentUser.findOne({ _id: id });

    if (!normalUser && !studentUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const combinedData = {
      ...(normalUser ? normalUser._doc : {}),
      ...(studentUser ? studentUser._doc : {}),
    };

    return NextResponse.json({ post, posts, combinedData }, { status: 200 });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return NextResponse.json({ message: "Error fetching user profile" }, { status: 500 });
  }
}

