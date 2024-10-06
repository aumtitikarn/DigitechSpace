import { connectMongoDB } from '../../../../../lib/mongodb';
import Post from "../../../../../models/post";

export async function GET(req) {
    await connectMongoDB();

    const url = new URL(req.url);
    const selectedCategory = url.searchParams.get("category");

    const query = {
        ...(selectedCategory && selectedCategory !== "All" && { selectedCategory }),
        permission: true
      };

      const posts = await Post.find(query).sort({ createdAt: -1 });

  try {
    await connectMongoDB();
    const posts = await Post.find({}).sort({ createdAt: -1 });
    return new Response(JSON.stringify(posts), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ success: false }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
