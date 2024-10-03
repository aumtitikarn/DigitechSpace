import { NextResponse } from "next/server";
import { connectMongoDB } from '../../../../../../lib/mongodb';
import Project from '../../../../../../models/project';
import StudentUser from '../../../../../../models/StudentUser';

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
    await connectMongoDB();

    const url = new URL(req.url);
    const email = url.searchParams.get("email");

    console.log("Received email:", email);

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const query = {
      email: email,
      permission: true
    };

    const projects = await Project.find(query).sort({ createdAt: -1 }).lean();

    // Fetch author details
    const author = await StudentUser.findOne({ email: email }, 'name imageUrl').lean();

    let authorName = 'Unknown Author';
    let profileImage = null;

    if (author) {
      authorName = author.name;
      if (author.imageUrl) {
        profileImage = isValidHttpUrl(author.imageUrl)
          ? useProxy(author.imageUrl)
          : `/api/project/images/${author.imageUrl}`;
      }
    }

    // Add author details to each project
    const projectsWithAuthorDetails = projects.map(project => ({
      ...project,
      authorName,
      profileImage
    }));

    return NextResponse.json(projectsWithAuthorDetails, {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error("Error in API:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}