import { NextResponse } from "next/server";
import { Readable } from "stream";
import { connectMongoDB } from "../../../../lib/mongodb";
import NormalUser from "../../../../models/NormalUser"
import StudentUser from "../../../../models/StudentUser"
import { getSession } from 'next-auth/react';

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
    let favblog = [];

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

    const newItem = new NormalUser({
      name, 
      email, 
      line, 
      facebook, 
      phonenumber, 
      imageUrl,
      favblog,
        
    });

    const newItemStudentUser = new StudentUser({
      name, 
      email, 
      line, 
      facebook, 
      phonenumber, 
      imageUrl,
      favblog,
        
    });

    const savedProject = await newItem.save();

    const savedProjectStudentUser = await newItemStudentUser.save();

    return NextResponse.json({ message: "Post created" }, { status: 201 });
  } catch (error) {
    console.error("Error in POST handler:", error);
    return NextResponse.json(
      { msg: "Error creating post" },
      { status: 500 }
    );
  }
}



export async function GET(req) {

  const session = await getSession({ req });

  if (!session) {
    return new Response('Unauthorized', { status: 401 });
  }

  if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: 'User not authenticated' }, { status: 401 });
  }

  const id = session.user.id;  // ดึง id จาก session ของผู้ใช้

    const { db } = await connectMongoDB();
    const edit = await NormalUser.find({});
    const edits = await StudentUser.find({});

    const normalUser = await NormalUser.findOne({ _id: id });
    const studentUser = await StudentUser.findOne({ _id: id });

    const combinedData = {
      ...(normalUser ? normalUser._doc : {}),  
      ...(studentUser ? studentUser._doc : {}), 
    };
    return NextResponse.json({ edit,edits,combinedData });
}