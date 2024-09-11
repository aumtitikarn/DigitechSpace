import mongoose from "mongoose"; // Add this import
import { Readable } from "stream";
import { connectMongoDB } from "../../../../../lib/mongodb";
import NormalUser from "../../../../../models/NormalUser";
import { NextResponse } from "next/server";


export async function GET(req, { params }) {
  const { id } = params;
  await connectMongoDB();
  const post = await NormalUser.findOne({ _id: id });
  return NextResponse.json({ post }, { status: 200 });
}


export async function PUT(req, { params }) {
  try {
    const { id } = params; // Get the user ID from params
    const { imgbucket } = await connectMongoDB(); // Connect MongoDB and get GridFS bucket

    const formData = await req.formData(); // Retrieve form data

    let name = "";
    let email = "";
    let line = "";
    let facebook = "";
    let phonenumber = "";
    let imageUrl = [];
    let favblog = [];
    if (formData.has("favblog")) {
      favblog = JSON.parse(formData.get("favblog")); // Parse the favblog data
    }

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
        case "blogId":
          blogIds.push(new mongoose.Types.ObjectId(value.toString())); // Collect ObjectId values
          break;
        case "imageUrl":
          if (value instanceof Blob) {
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
      }
    }

    // Update the user profile
    const updateData = {
      ...(name && { name }),
      ...(email && { email }),
      ...(line && { line }),
      ...(facebook && { facebook }),
      ...(phonenumber && { phonenumber }),
      ...(imageUrl.length > 0 && { imageUrl }),
    };

    // Push `favblog` entries safely
    if (favblog.length > 0) {
      updateData.$push = { favblog };
    }

    // Update the user profile
    const updatedUser = await NormalUser.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );

    if (!updatedUser) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ user: updatedUser }, { status: 200 });
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json({ message: 'Error updating user' }, { status: 500 });
  }
}
