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

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const categories = searchParams.get('categories');
  const exclude = searchParams.get('exclude');

  if (!categories || !exclude) {
    return new Response(JSON.stringify({ error: 'Missing required query parameters' }), { status: 400 });
  }

  const categoriesArray = categories.split(',').map(cat => cat.trim());
  
  if (!ObjectId.isValid(exclude)) {
    return new Response(JSON.stringify({ error: 'Invalid exclude ID' }), { status: 400 });
  }

  try {
    await connectMongoDB();
    const similarProjects = await Project.find({
      category: { $in: categoriesArray },
      permission: true,
      _id: { $ne: new ObjectId(exclude) }
    }).limit(10).lean();
    
    // Fetch author details for each project
    const projectsWithAuthorDetails = await Promise.all(similarProjects.map(async (project) => {
      const author = await StudentUser.findOne({ email: project.email }, 'name imageUrl').lean();
      
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

      return {
        ...project,
        authorName,
        profileImage
      };
    }));
    
    return new Response(JSON.stringify(projectsWithAuthorDetails), { status: 200 });
  } catch (error) {
    console.error('Error in getSimilarProject API:', error);
    return new Response(JSON.stringify({ error: 'Unable to fetch similar projects', details: error.message }), { status: 500 });
  }
}