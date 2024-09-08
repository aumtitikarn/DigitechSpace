import { NextResponse } from "next/server";
import { Readable } from "stream";
import { connectMongoDB } from "../../../../lib/mongodb";
import Project from "../../../../models/project";

export const revalidate = 0;

export async function POST(req, res) {
  try {
    const { client, imgbucket, filebucket } = await connectMongoDB();
    const formData = await req.formData();

    // Initialize variables
    let projectname = "";
    let description = "";
    let receive = [];
    let category = "";
    let price = "";
    let imageUrl = [];
    let author = "";
    let email = "";
    let permission = false;
    let filesUrl = [];
    let rathing = 0.0;
    let sold = 0;
    let review = 0;
    let status = "submitted";

    for (const [key, value] of formData.entries()) {
      switch (key) {
        case "projectname":
          projectname = value.toString();
          break;
        case "description":
          description = value.toString();
          break;
        case "receive":
          receive = JSON.parse(value.toString());
          break;
        case "category":
          category = value.toString();
          break;
        case "price":
          price = parseInt(value, 10);
          break;
        case "author":
          author = value.toString();
          break;
        case "email":
          email = value.toString();
          break;
        case "rathing":
          rathing = parseFloat(value);
          break;
        case "sold":
          sold = parseInt(value, 10);
          break;
        case "review":
          sold = parseInt(value, 10);
          break;
        case "permission":
          permission = value === "true"; // Convert value to Boolean
          break;
        case "status":
          status = value.toString();
        break;
        case "imageUrl":
          if (value instanceof Blob) {
            const image = `${Date.now()}_${value.name}`;
            const buffer = Buffer.from(await value.arrayBuffer());
            const stream = Readable.from(buffer);
            const uploadStream = imgbucket.openUploadStream(image);
            await new Promise((resolve, reject) => {
              stream
                .pipe(uploadStream)
                .on("finish", resolve)
                .on("error", reject);
            });
            imageUrl.push(image);
          }
          break;
        case "filesUrl":
          if (value instanceof Blob) {
            const files = `${value.name}`;
            const buffer = Buffer.from(await value.arrayBuffer());
            const stream = Readable.from(buffer);
            const uploadStream = filebucket.openUploadStream(files);
            await new Promise((resolve, reject) => {
              stream
                .pipe(uploadStream)
                .on("finish", resolve)
                .on("error", reject);
            });
            filesUrl.push(files);
          }
          break;
      }
    }

    if (!projectname || !description || !category || !imageUrl || !filesUrl) {
      throw new Error("Missing required fields");
    }

    const newItem = new Project({
      imageUrl,
      projectname,
      description,
      receive,
      category,
      price,
      author,
      email,
      permission,
      status,
      filesUrl,
      review,
      sold,
    });

    // Save the project
    const savedProject = await newItem.save(); // Save and get the saved document

    return NextResponse.json(
      {
        _id: savedProject._id,
        msg: "Project created successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error in POST handler:", error);
    return NextResponse.json(
      { msg: "Error creating project" },
      { status: 500 }
    );
  }
}
