// import { connectMongoDB } from "../../../../lib/mongodb";
// import Post from "../../../../models/post";
// import { NextResponse } from "next/server";
// import { Readable } from "stream";

// export const revalidate = 0;

// export async function POST(req) {
//     let name;
//     let image;

//     const formData = await req.formData();

//     Connect to MongoDB and create a GridFSBucket
//     const { client, db } = await connectMongoDB();
//     const imgbucket = await connectMongoDB() // Create GridFSBucket instance from the connected database

//     for (const entries of Array.from(formData.entries())) {
//         const [key, value] = entries;
//         if (key === "name") {
//             name = value;
//         }

//         if (typeof value === "object" && value.arrayBuffer) {
//             image = Date.now() + value.name;
//             console.log("done");
//             const buffer = Buffer.from(await value.arrayBuffer());
//             const stream = Readable.from(buffer);
//             const uploadStream = imgbucket.openUploadStream(image, {});
//             stream.pipe(uploadStream);

//             await new Promise((resolve, reject) => {
//                 uploadStream.on("finish", resolve);
//                 uploadStream.on("error", reject);
//             });
//             Assuming imageUrl is defined somewhere to store the uploaded image names
//         }
//     }

//     const newItem = new Post({
//         name,
//         imageUrl: image,
//     });
//     await newItem.save();

//     const { topic, course, description, heart } = Object.fromEntries(formData.entries());
//     await Post.create({ topic, course, description, heart, imageUrl: image });

//     return NextResponse.json({ message: "Post created" }, { status: 201 });
// }



import { NextResponse } from "next/server";
import { Readable } from "stream";
import { connectMongoDB } from "../../../../lib/mongodb";
import Post from "../../../../models/post";

export const revalidate = 0;


export async function POST(req) {
  try {
    const { imgbucket } = await connectMongoDB();
    const formData = await req.formData();

    let topic = "";
    let course = "";
    let description = "";
    let selectedCategory = "";
    let author = "";
    let email = "";
    let heart = 0;
    let userprofile = "";
    let userprofileid = "";
    let comments = [];
    let imageUrl = [];
    let likedByUsers = [];

    for (const [key, value] of formData.entries()) {
      switch (key) {
        case "topic":
          topic = value.toString();
          break;
        case "course":
          course = value.toString();
          break;
        case "description":
          description = value.toString();
          break;
        case "heart":
          heart = parseInt(value, 10);
          break;
        case "selectedCategory":
          selectedCategory = value.toString();
          break;
        case "userprofile":
          userprofile = value.toString();
          break;
        case "userprofileid":
            userprofileid = value.toString();
          break;
        case "email":
            email = value.toString();
          break;
        case "author":
          author = value.toString();
          break;
          case "comments":
            comments = value.toString();
            break;
            case "likedByUsers":
              likedByUsers = value.toString();
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

    if (!topic || !course || !description) {
      throw new Error("Missing required fields");
    }

    const newItem = new Post({
      topic,
      course,
      description,
      heart,
      selectedCategory,
      userprofile, // รูปภาพที่เก็บใน userprofile
      userprofileid,
      author,
      email,
      imageUrl,
      comments: [],
      likedByUsers: [],
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
    const posts = await Post.find({});
    return NextResponse.json({ posts });
}

export async function PUT(req, { params }) {
  try {
    const { id } = params; // ดึง post ID จาก params
    const body = await req.json(); // อ่าน request body
    const {  userId, setheart: heart, actionheart } = body; // ดึงค่า heart จาก body

    await connectMongoDB(); // เชื่อมต่อกับ MongoDB

    // ค้นหา post ตาม ID
    const post = await Post.findById(id);

    if (!post) {
      return NextResponse.json({ message: 'Post not found' }, { status: 404 });
    }

    // อัปเดตค่า heart
    if (heart !== undefined) {
      post.heart = heart; // อัปเดตจำนวนหัวใจใน post
    }

        // ตรวจสอบ action ถ้าเป็น 'like' ให้เพิ่ม userId ไปใน likedByUsers
        if (actionheart === 'like') {
          if (!post.likedByUsers) {
            post.likedByUsers = [];
            console.log('post.likedByUsers (before update):', post.likedByUsers);
          }
        
          if (!post.likedByUsers.includes(userId)) {
            post.likedByUsers.push(userId);
            console.log('User added to likedByUsers:', post.likedByUsers);
          }
        } else if (actionheart === 'unlike') {
          if (post.likedByUsers) {
            post.likedByUsers = post.likedByUsers.filter((user) => user !== userId);
            console.log('User removed from likedByUsers:', post.likedByUsers);
          }
        }

    // บันทึกการอัปเดตลง MongoDB
    await post.save();

    return NextResponse.json({ post }, { status: 200 }); // ส่งข้อมูล post กลับไป
  } catch (error) {
    console.error('Error updating post:', error);
    return NextResponse.json({ message: 'Error updating post' }, { status: 500 });
  }
}


// export async function GET() {
//     try {
//       await connectMongoDB();
//       const posts = await Post.find({}).sort({ createdAt: -1 });
//       return new NextResponse(JSON.stringify(posts), {
//         status: 200,
//         headers: { 'Content-Type': 'application/json' },
//       });
//     } catch (error) {
//       return new NextResponse(JSON.stringify({ success: false }), {
//         status: 400,
//         headers: { 'Content-Type': 'application/json' },
//       });
//     }
//   }
  