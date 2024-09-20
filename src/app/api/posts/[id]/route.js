import { connectMongoDB } from "../../../../../lib/mongodb";
import Post from "../../../../../models/post";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
    const { id } = params;
    await connectMongoDB();
    const post = await Post.findOne({ _id: id });
    return NextResponse.json({ post }, { status: 200 });
}


export async function PUT(req, { params }) {
  try {
    const { id } = params; // Get the post ID from params
    const body = await req.json();
    const { text, profile, action, commentId, author, setheart: heart } = body;

    await connectMongoDB(); // Connect to MongoDB

    // Find the post by ID
    const post = await Post.findById(id);

    if (!post) {
      return NextResponse.json({ message: 'Post not found' }, { status: 404 });
    }

    const timestamp = new Date().toLocaleString(); // สร้าง timestamp ตรงนี้ก่อนใช้งาน

    // Update heart value
    if (heart !== undefined) {
      post.heart = heart;
    }

    // Handle comments and replies
    if (action === 'comment') {
      // บันทึกความคิดเห็นใหม่พร้อมชื่อผู้ใช้ รูปโปรไฟล์ และเวลา
      post.comments.push({
        text,
        author, // ชื่อผู้ใช้
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
          author,
          timestamp, // เวลา
        });
      }
    }

    // Save the updated post
    await post.save();

    return NextResponse.json({ post }, { status: 200 });
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