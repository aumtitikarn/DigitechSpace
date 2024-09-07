import { connectMongoDB } from '../../../../../lib/mongodb'; 
import StudentUser from '../../../../../models/StudentUser'; 
export async function GET(request, { params }) {
    try {
      await connectMongoDB();
  
      const { id } = params;
  
      const studentUser = await StudentUser.findById(id);
      if (studentUser) {
        return new Response(JSON.stringify(studentUser), { status: 200 });
      }

      return new Response('User not found', { status: 404 });
    } catch (error) {
      console.error('Error fetching user:', error);
      return new Response('Internal Server Error', { status: 500 });
    }
  }
  