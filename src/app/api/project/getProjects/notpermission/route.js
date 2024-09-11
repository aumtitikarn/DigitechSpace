//./api/project/getProjects
import { connectMongoDB } from '../../../../../../lib/mongodb';
import Project from '../../../../../../models/project';
import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth";
import { authOption } from '../../../../../app/api/auth/[...nextauth]/route';

export async function GET(req) {
  try {
    const session = await getServerSession(authOption);
    if (!session || !session.user || !session.user.email) {
      console.log('Session or user email is missing:', session);
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await connectMongoDB();


    const url = new URL(req.url);
    const status = url.searchParams.get("status");
    const userEmail = session.user.email;
    const query = {
      ...(status && { status }),
        email: userEmail,
        permission: false
      };
  
    const projects = await Project.find(query).sort({ createdAt: -1 });

    return new Response(JSON.stringify(projects), {
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
