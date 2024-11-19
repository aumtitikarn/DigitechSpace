import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth";
import { connectMongoDB } from '../../../../../../lib/mongodb';
import Post from '../../../../../../models/post';
import StudentUser from '../../../../../../models/StudentUser';
import NormalUser from '../../../../../../models/NormalUser';
import { authOptions } from '../../../auth/auth.config';
export const dynamic = 'force-dynamic';
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

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.email) {
      return NextResponse.json({ message: 'Unauthorized or missing user email' }, { status: 401 });
    }

    await connectMongoDB();

    const userEmail = session.user.email;
    console.log("User email:", userEmail);

    const allUserBlog = await Post.find({ email: userEmail }).lean();
    console.log("Fetched blogs:", allUserBlog);

    let author = await StudentUser.findOne({ email: userEmail }).lean();
    if (!author) {
      author = await NormalUser.findOne({ email: userEmail }).lean();
    }
    console.log("Found author:", author);

    let authorName = 'Unknown Author';
    let profileImage = null;

    if (author) {
      authorName = author.name || 'Unknown Author';
      if (author.imageUrl) {
        profileImage = isValidHttpUrl(author.imageUrl)
          ? getProxyUrl(author.imageUrl)
          : `/api/project/images/${author.imageUrl}`;
      }
    }

    console.log("Author details:", { authorName, profileImage });

    const blogsWithAuthorDetails = allUserBlog.map(blog => ({
      ...blog,
      authorName,
      profileImage,
      _id: blog._id.toString()
    }));

    console.log("Processed blogs:", blogsWithAuthorDetails);

    return NextResponse.json(blogsWithAuthorDetails, {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in getPosts/user:', error);
    return NextResponse.json({ message: 'Internal server error', error: error.toString() }, { status: 500 });
  }
}