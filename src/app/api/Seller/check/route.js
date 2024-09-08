import { getServerSession } from 'next-auth/next';
import { connectMongoDB } from '../../../../../lib/mongodb';
import StudentUser from '../../../../../models/StudentUser';
import { authOption } from '../../auth/[...nextauth]/route';

export async function GET(req, res) {
  try {
    const session = await getServerSession({ req, ...authOption });
    
    if (!session || !session.user || !session.user.email) {
      return new Response('Unauthorized', { status: 401 });
    }
    
    await connectMongoDB();
    
    const user = await StudentUser.findOne({ email: session.user.email });
    
    if (user) {
      // Check if SellInfo exists and is an object
      if (user.SellInfo && typeof user.SellInfo === 'object') {
        // Check if any fields in SellInfo are not empty
        const hasSellInfo = Object.values(user.SellInfo).some(value => value !== undefined && value !== null && value !== '');
        
        if (hasSellInfo) {
          return new Response(JSON.stringify({ hasSellInfo: true }), { status: 200 });
        } else {
          return new Response(JSON.stringify({ hasSellInfo: false }), { status: 200 });
        }
      } else {
        return new Response(JSON.stringify({ hasSellInfo: false }), { status: 200 });
      }
    } else {
      return new Response('User not found', { status: 404 });
    }
  } catch (error) {
    console.error('Error fetching SellInfo:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}
