import { connectMongoDB } from "../../../../../lib/mongodb";
import Post from "../../../../../models/post";
import NormalUser from "../../../../../models/NormalUser";
import StudentUser from "../../../../../models/StudentUser";
import { NextResponse } from "next/server";

const isValidHttpUrl = (string) => {
  let url;
  try {
    url = new URL(string);
  } catch (_) {
    return false;
  }
  return url.protocol === "http:" || url.protocol === "https:";
};

const useProxy = (url) => `/api/proxy?url=${encodeURIComponent(url)}`;

export async function GET(req, { params }) {
    const { id } = params;
    await connectMongoDB();
    const postblog = await Post.findOne({ _id: id });
    const postcomments = await Post.findById({ comments: id });

    if (!postblog) {
      return NextResponse.json({ message: 'Post not found' }, { status: 404 });
  }

  // Find the user associated with the blog
  console.log(`Processing project: ${postblog._id}, Author email: ${postblog.email}`);

  // Find user in StudentUser or NormalUser collection
  let studentuser = await StudentUser.findOne({ email: postblog.email }, 'name imageUrl').lean();
  let normaluser = await NormalUser.findOne({ email: postblog.email }, 'name imageUrl').lean();

  let studentusercomment = await StudentUser.findOne({ email: postcomments.email }, 'name imageUrl').lean();
  let normalusercomment = await NormalUser.findOne({ email: postcomments.email }, 'name imageUrl').lean();

  let user = studentuser || normaluser || studentusercomment || normalusercomment;  // Use studentuser if exists, otherwise normaluser

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
          profileImageSource = useProxy(user.imageUrl);  // Proxy if valid URL
      } else {
          profileImageSource = `/api/posts/images/${user.imageUrl}`;  // Local image path
      }
  }

  // Return the blog post with the author's information
  const post = {
      ...postblog.toObject(),  // Convert the blog document to a plain object
      authorName: user ? user.name : 'Unknown Author',
      profileImage: profileImageSource
  };

    return NextResponse.json({ post }, { status: 200 });
}


export async function PUT(req, { params }) {
  try {
    const { id } = params; // Get the post ID from params
    const body = await req.json();
    const { text, action, commentId, setheart: heart, userId, actionheart } = body;

    await connectMongoDB(); // Connect to MongoDB

    // Find the post by ID
    const post = await Post.findById({ _id: id });

  // Return the blog post with the author's information
    if (!post) {
      return NextResponse.json({ message: 'Post not found' }, { status: 404 });
    }

    const timestamp = new Date().toLocaleString(); // สร้าง timestamp ตรงนี้ก่อนใช้งาน

    console.log('Request body:', body);

    console.log('Heart value:', heart);

    console.log('userId body:', userId);

    console.log('actionheart body:', actionheart);

    // อัปเดตค่า heart
    if (heart !== undefined) {
      post.heart = heart;
    }

    // จัดการกับการกด like/unlike
    if (actionheart === 'like') {
      if (!post.likedByUsers) {
        post.likedByUsers = [];
      }
      if (!post.likedByUsers.includes(userId)) {
        post.likedByUsers.push(userId);
      }
    } else if (actionheart === 'unlike') {
      if (post.likedByUsers) {
        post.likedByUsers = post.likedByUsers.filter((user) => user !== userId);
      }
    }

    try {
      await post.save();
      console.log('Post updated:', post);
    } catch (error) {
      console.error('Error saving post:', error);
    }

    // Handle comments and replies
    if (action === 'comment') {
      // บันทึกความคิดเห็นใหม่พร้อมชื่อผู้ใช้ รูปโปรไฟล์ และเวลา
      post.comments.push({
        text,
        // author, // ชื่อผู้ใช้
        profile: typeof profile === 'string' ? profile : '', // รูปโปรไฟล์ของผู้ใช้
        timestamp, // เวลา
        replies: [], // Array ว่างสำหรับการตอบกลับ
      });
    } else if (action === 'reply' && commentId) {
      const comment = post.comments.id(commentId);
      if (comment) {
        // บันทึกการตอบกลับในความคิดเห็น
        comment.replies.push({
          text,
          profile, // รูปโปรไฟล์ของผู้ตอบกลับ
          // author,
          timestamp, // เวลา
        });
      }
    }

          // Save the updated post
          await post.save();

  //         console.log(`Processing project: ${post._id}, Author email: ${post.email}`);

  //             // Find user in StudentUser or NormalUser collection
  // let studentuser = await StudentUser.findOne({ email: post.email }, 'name imageUrl').lean();
  // let normaluser = await NormalUser.findOne({ email: post.email }, 'name imageUrl').lean();

  // let user = studentuser || normaluser;  // Use studentuser if exists, otherwise normaluser

  // if (user) {
  //     console.log(`Found user comment: ${user.name}`);
  //     console.log(`ProfileImg comment: ${user.imageUrl}`);
  // } else {
  //     console.log('User not found in both StudentUser and NormalUser collections');
  // }

  // // Determine profile image source
  // let profileImageSource = null;
  // if (user && user.imageUrl) {
  //     if (isValidHttpUrl(user.imageUrl)) {
  //         profileImageSource = useProxy(user.imageUrl);  // Proxy if valid URL
  //     } else {
  //         profileImageSource = `/api/posts/images/${user.imageUrl}`;  // Local image path
  //     }
  // }      


  //   const posts = {
  //     ...post.toObject(),  // Convert the blog document to a plain object
  //     authorName: user ? user.name : 'Unknown Author',
  //     profileImage: profileImageSource
  // };


    return NextResponse.json({ posts,post }, { status: 200 });
}catch (error) {
  console.error('Error updating post:', error);
  return NextResponse.json({ message: 'Error updating post' }, { status: 500 });
}
}

// export async function PUT(req, { params }) {
//     const { id } = params;
//     const { commentId, text, isReply } = await req.json();
    
//     await connectMongoDB();
//     const post = await Post.findById(id);
    
//     if (isReply && commentId) {
//         const comment = post.comments.find(comment => comment._id == commentId);
//         comment.replies.push({ text, createdAt: new Date() });
//     } else {
//         post.comments.push({ text, replies: [], createdAt: new Date() });
//     }

//     await post.save();
//     return NextResponse.json({ message: "Comment/Reply added" }, { status: 200 });
// }