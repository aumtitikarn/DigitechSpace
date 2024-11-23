import { connectMongoDB } from "../../../../lib/mongodb";
import PostBlog from "../../../../models/blogreport";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    await connectMongoDB();
    const formData = await req.formData();

    let blogname = "";
    let report = "";
    let selectedReason = "";
    let author = "";
    let blogid = "";
    let blogEmail = "";

    for (const [key, value] of formData.entries()) {
      switch (key) {
        case "blogname":
          blogname = value.toString();
          break;
        case "report":
          report = value.toString();
          break;
        case "selectedReason":
          selectedReason = value.toString();
          break;
        case "author":
          author = value.toString();
          break;
        case "blogid":
          blogid = value.toString();
          break;
        case "blogEmail":
          blogEmail = value.toString();
          break;
      }
    }

    if (!report || !selectedReason) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const newItem = new PostBlog({
      blogname,
      report,
      selectedReason,
      author,
      blogid,
      blogEmail,
    });

    const savedProject = await newItem.save();

    return NextResponse.json(
      { message: "Post created successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error in POST handler:", error);
    return NextResponse.json(
      { error: "Error creating post" },
      { status: 500 }
    );
  }
}