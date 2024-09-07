import { NextResponse } from "next/server";
import { Readable } from "stream";
import { connectMongoDB } from "../../../../lib/mongodb";
import NormalUser from "../../../../models/NormalUser"

export const revalidate = 0;


export async function POST(req) {
  try {
    const { imgbucket } = await connectMongoDB();
    const formData = await req.formData();

    let name = "";
    let email = "";
    let line = "";
    let facebook = "";
    let phonenumber = "";
    let imageUrl = [];

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
          if (value instanceof Blob) {
            const image = `${Date.now()}_${value.name}`;
            const buffer = Buffer.from(await value.arrayBuffer());
            const stream = Readable.from(buffer);
            const uploadStream = imgbucket.openUploadStream(image);
            await new Promise((resolve, reject) => {
              stream.pipe(uploadStream).on("finish", resolve).on("error", reject);
            });
            imageUrl.push(image);
          }
          break;
      }
    }

    const newItem = new NormalUser({
        name,
        email,
        line, facebook, phonenumber,
        imageUrl,
        
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



export async function GET() {
    const { db } = await connectMongoDB();
    const edits = await NormalUser.find({});
    return NextResponse.json({ edits });
}