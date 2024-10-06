import mongoose from "mongoose"; // Add this import
import { Readable } from "stream";
import { connectMongoDB } from "../../../../../lib/mongodb";
import NormalUser from "../../../../../models/NormalUser";
import StudentUser from "../../../../../models/StudentUser";
import { NextResponse } from "next/server";

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

    // Ensure combinedData is defined only after users are found
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

