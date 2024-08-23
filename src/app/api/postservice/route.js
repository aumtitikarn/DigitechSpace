import { connectMongoDB } from "../../../../lib/mongodb";
import Postss from "../../../../models/postservice"
import { NextResponse } from "next/server"

export async function POST(req) {
    const {report,email} = await req.json();
    console.log(report,email)
    await connectMongoDB();
    await Postss.create({report,email});
    return NextResponse.json({message: "PostService Test"},{status:201});
    
}

export async function GET() {
    await connectMongoDB();
    const postservice = await Post.find({});
    return NextResponse.json({ postservice });
}