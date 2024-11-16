import { NextResponse } from "next/server";
import { Readable } from "stream";
import { connectMongoDB } from "../../../../lib/mongodb";
import Post from "../../../../models/post";
import NormalUser from "../../../../models/NormalUser";
import StudentUser from "../../../../models/StudentUser";

export const revalidate = 0;

const isValidHttpUrl = (string) => {
  let url;
  try {
    url = new URL(string);
  } catch (_) {
    return false;
  }
  return url.protocol === "http:" || url.protocol === "https:";
};

const getProxyUrl = (url) => `/api/proxy?url=${encodeURIComponent(url)}`;

export async function POST(req) {
  try {
    const { imgbucket } = await connectMongoDB();
    const formData = await req.formData();

    let topic = "";
    let course = "";
    let description = "";
    let selectedCategory = "";
    let email = "";
    let heart = 0;
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
        case "userprofileid":
          userprofileid = value.toString();
          break;
        case "email":
          email = value.toString();
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
      userprofileid,
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
  try {
    const { db } = await connectMongoDB();

    const postblogs = await Post.find({});

    // Process all posts using Promise.all
    const posts = await Promise.all(postblogs.map(async (blog) => {
      console.log(`Processing project: ${blog._id}, Author email: ${blog.email}`);

      // Find user in StudentUser or NormalUser collection
      let studentuser = await StudentUser.findOne({ email: blog.email }, 'name imageUrl').lean();
      let normaluser = await NormalUser.findOne({ email: blog.email }, 'name imageUrl').lean();

      let user = studentuser || normaluser;

      if (user) {
        console.log(`Found user: ${user.name}`);
        console.log(`ProfileImg: ${user.imageUrl}`);
      } else {
        console.log('User not found in both StudentUser and NormalUser collections');
      }

      // Determine profile image source
      let profileImageSource = null;
      if (user && user.imageUrl) {
        if (isValidHttpUrl(user.imageUrl)) {
          profileImageSource = getProxyUrl(user.imageUrl);  // Using renamed function
        } else {
          profileImageSource = `/api/posts/images/${user.imageUrl}`;
        }
      }

      return {
        ...blog.toObject(),
        authorName: user ? user.name : 'Unknown Author',
        profileImage: profileImageSource
      };
    }));

    return NextResponse.json({ posts, postblogs }, { status: 200 });
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json({ message: 'Error fetching posts' }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
    const { id } = params;
    const body = await req.json();
    const { userId, setheart: heart, actionheart } = body;

    await connectMongoDB();

    const post = await Post.findById(id);

    if (!post) {
      return NextResponse.json({ message: 'Post not found' }, { status: 404 });
    }

    if (heart !== undefined) {
      post.heart = heart;
    }

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

    await post.save();

    return NextResponse.json({ post }, { status: 200 });
  } catch (error) {
    console.error('Error updating post:', error);
    return NextResponse.json({ message: 'Error updating post' }, { status: 500 });
  }
}