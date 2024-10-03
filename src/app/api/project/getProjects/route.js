import { connectMongoDB } from '../../../../../lib/mongodb';
import Project from '../../../../../models/project';
import StudentUser from '../../../../../models/StudentUser';

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
    const category = url.searchParams.get("category");

    const query = {
      ...(category && category !== "All" && { category }),
      permission: true
    };

    console.log('Fetching projects with query:', query);

    const projects = await Project.find(query).sort({ createdAt: -1 }).lean();

    console.log(`Found ${projects.length} projects`);

    const populatedProjects = await Promise.all(projects.map(async (project) => {
      console.log(`Processing project: ${project._id}, Author email: ${project.email}`);

      let user = await StudentUser.findOne({ email: project.email }, 'name imageUrl').lean();
      if (user) {
        console.log(`Found student user: ${user.name}`);
        console.log(`ProfileImg :  ${user.imageUrl}`)
      } else {
        console.log('Student user not found, searching in NormalUser');
      }

      let profileImageSource = null;
      if (user && user.imageUrl) {
        if (isValidHttpUrl(user.imageUrl)) {
          profileImageSource = useProxy(user.imageUrl);
        } else {
          profileImageSource = `/api/project/images/${user.imageUrl}`;
        }
      }

      return {
        ...project,
        authorName: user ? user.name : 'Unknown Author',
        profileImage: profileImageSource
      };
    }));

    console.log('Finished processing all projects');

    return new Response(JSON.stringify(populatedProjects), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching projects:', error);
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}