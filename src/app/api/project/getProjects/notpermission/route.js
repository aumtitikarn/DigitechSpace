import { connectMongoDB } from '../../../../../../lib/mongodb';
import Project from '../../../../../../models/project';
import StudentUser from '../../../../../../models/StudentUser';
import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth";
import { authOption } from '../../../../../app/api/auth/[...nextauth]/route';

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
  
    const projects = await Project.find(query).sort({ createdAt: -1 }).lean();

    // Fetch user details
    const user = await StudentUser.findOne({ email: userEmail }, 'name imageUrl').lean();

    let authorName = 'Unknown Author';
    let profileImage = null;

    if (user) {
      authorName = user.name;
      if (user.imageUrl) {
        profileImage = isValidHttpUrl(user.imageUrl)
          ? useProxy(user.imageUrl)
          : `/api/project/images/${user.imageUrl}`;
      }
    }

    // Add author details to each project
    const projectsWithAuthorDetails = projects.map(project => ({
      ...project,
      authorName,
      profileImage
    }));

    return new Response(JSON.stringify(projectsWithAuthorDetails), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in getProjects API:', error);
    return new Response(JSON.stringify({ error: 'Unable to fetch projects', details: error.message }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}