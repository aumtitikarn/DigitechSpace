// pages/api/project/[id].ts
import { NextResponse } from "next/server";
import { connectMongoDB } from '../../../../../lib/mongodb';
import Project from '../../../../../models/project';


export async function GET(req, { params }) {
  const { id } = params;
  await connectMongoDB();
  const post = await Project.findOne({ _id: id });
  return NextResponse.json({ post }, { status: 200 });
}
