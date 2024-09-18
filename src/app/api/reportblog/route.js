import { connectMongoDB } from "../../../../lib/mongodb";
import PostBlog from "../../../../models/blogreport"
import { NextResponse } from "next/server"

export async function POST(req) {
try {
    await connectMongoDB();
    const formData = await req.formData();

    let blogname = "";
    let report = "";
    let selectedReason = "";
    let author = "";
    let blogid = "";


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
      }
    }

    if (!report || !selectedReason) {
      throw new Error("Missing required fields");
    }

    const newItem = new PostBlog({
        blogname,
      report,
      selectedReason,
      author,
      blogid
    });

    const savedProject = await newItem.save();

    return NextResponse.json({ message: "Post created" }, { status: 201 });
  } catch (error) {
    console.error("Error in POST handler:", error);
    return NextResponse.json(
      { msg: "Error creating post" },
      { status: 500 }
    );
  }
}