import Post from "../../../../models/post"
import { NextResponse } from "next/server"

export async function POST(req) {
    const {topic,course,description} = await req.json();
    console.log(topic,course,description)
    return NextResponse.json({message: "Post test"},{status:"200"});
    
}