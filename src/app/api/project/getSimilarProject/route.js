import { NextResponse } from 'next/server';
import { connectMongoDB } from '../../../../../lib/mongodb';
import Project from '../../../../../models/project';
import { ObjectId } from 'mongodb';

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
    }).limit(10);
    
    return new Response(JSON.stringify(similarProjects), { status: 200 });
  } catch (error) {
    console.error('Error in getSimilarProject API:', error);
    return new Response(JSON.stringify({ error: 'Unable to fetch similar projects', details: error.message }), { status: 500 });
  }
}