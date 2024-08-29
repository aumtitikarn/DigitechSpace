import { connectMongoDB } from '../../../../../lib/mongodb';
import Project from '../../../../../models/project';

export async function GET(req) {
  try {
    await connectMongoDB();
    const projects = await Project.find({}).sort({ createdAt: -1 });
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
