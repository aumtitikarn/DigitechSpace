import { NextResponse } from 'next/server';
import { connectMongoDB } from '../../../../../lib/mongodb';
import Project from '../../../../../models/project';
import StudentUser from '../../../../../models/StudentUser';
import { ObjectId } from 'mongodb';

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

export async function GET(req, { params }) {
  const { id } = params;

  // Check if id is a valid ObjectId
  if (!ObjectId.isValid(id) || id.length !== 24) {
    return NextResponse.json({ msg: "Invalid project ID format" }, { status: 400 });
  }

  try {
    await connectMongoDB();
    // Convert id to ObjectId
    const project = await Project.findOne({ _id: new ObjectId(id) }).lean();

    if (!project) {
      // Return 404 if no project is found
      return NextResponse.json({ msg: "Project not found" }, { status: 404 });
    }

    // Find the author's details
    const author = await StudentUser.findOne({ email: project.email }, 'name imageUrl').lean();

    let authorName = 'Unknown Author';
    let profileImage = null;

    if (author) {
      authorName = author.name;
      if (author.imageUrl) {
        if (isValidHttpUrl(author.imageUrl)) {
          profileImage = useProxy(author.imageUrl);
        } else {
          profileImage = `/api/project/images/${author.imageUrl}`;
        }
      }
    }

    // Combine project data with author details
    const projectWithAuthorDetails = {
      ...project,
      authorName,
      profileImage
    };

    return NextResponse.json({ project: projectWithAuthorDetails }, { status: 200 });
  } catch (error) {
    console.error("Error fetching project:", error);
    return NextResponse.json({ msg: "Error fetching project" }, { status: 500 });
  }
}