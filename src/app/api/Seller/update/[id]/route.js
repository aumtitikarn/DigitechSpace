import { connectMongoDB } from '../../../../../../lib/mongodb'; 
import StudentUser from '../../../../../../models/StudentUser'; 
import { getServerSession } from 'next-auth/next'; // Import getServerSession
import { authOptions } from '../../../../api/auth/auth.config';

export async function PUT(request, { params }) {
  try {
    await connectMongoDB();

    // Use getServerSession to get the session
    const session = await getServerSession({ req: request, ...authOptions });

    // Check if the user is authenticated
    if (!session) {
      return new Response('Unauthorized', { status: 401 });
    }

    const { id } = params;

    if (!id) {
      return new Response('ID is required', { status: 400 });
    }

    const data = await request.json();

    // Validate the incoming data
    if (!data.fullname || !data.phonenumber || !data.nationalid || !data.namebank || !data.numberbankacc || !data.housenum || !data.subdistrict || !data.district || !data.province || !data.postalnumber) {
      return new Response('All fields are required', { status: 400 });
    }

    try {
      // Find the student user by ID and update the SellInfo
      const studentUser = await StudentUser.findByIdAndUpdate(
        id,
        {
          $set: {
            'SellInfo.fullname': data.fullname,
            'SellInfo.phonenumber': data.phonenumber,
            'SellInfo.nationalid': data.nationalid,
            'SellInfo.namebank': data.namebank,
            'SellInfo.numberbankacc': data.numberbankacc,
            'SellInfo.housenum': data.housenum,
            'SellInfo.subdistrict': data.subdistrict,
            'SellInfo.district': data.district,
            'SellInfo.province': data.province,
            'SellInfo.postalnumber': data.postalnumber,
          }
        },
        { new: true, runValidators: true }
      );

      if (!studentUser) {
        return new Response('StudentUser not found');
      }

      return new Response(JSON.stringify({ message: 'SellInfo updated successfully', SellInfo: studentUser.SellInfo }), { status: 200 });
    } catch (error) {
      console.error('Error updating SellInfo:', error);
      return new Response('Error updating SellInfo', { status: 500 });
    }
  } catch (error) {
    console.error('Error:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}
