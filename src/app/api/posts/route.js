import { connectMongoDB } from "../../../../lib/mongodb";
import Post from "../../../../models/post"
import { NextResponse } from "next/server"

export async function POST(req) {
    const {topic,course,description} = await req.json();
    console.log(topic,course,description)
    await connectMongoDB();
    await Post.create({topic,course,description});
    return NextResponse.json({message: "Post test"},{status:201});
    
}

export async function GET() {
    await connectMongoDB();
    const posts = await Post.find({});
    return NextResponse.json({ posts });
}