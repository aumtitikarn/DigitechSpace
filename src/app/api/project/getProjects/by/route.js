import { NextResponse } from "next/server";
import { connectMongoDB } from '../../../../../../lib/mongodb';
import Project from '../../../../../../models/project';

export async function GET(req) {
  try {
    await connectMongoDB();

    const url = new URL(req.url);
    const email = url.searchParams.get("email");

    console.log("Received email:", email);

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const query = {
      email: email, // ใช้ email แทน author
      permission: true
    };


    const projects = await Project.find(query).sort({ createdAt: -1 });

    return NextResponse.json(projects, {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error("Error in API:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}