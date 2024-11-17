import { connectMongoDB } from '../../../../../../lib/mongodb';
import StudentUser from '../../../../../../models/StudentUser';
import NormalUser from '../../../../../../models/NormalUser';
import { getServerSession } from 'next-auth/next';
import { NextResponse } from 'next/server';
import { authOptions } from '../../../auth/[...nextauth]/route'; // Adjust this import path as necessary

export async function GET(req) {
  try {
    await connectMongoDB();
    
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      console.error('No session or user found');
      return NextResponse.json({ message: 'Unauthorized', error: 'No valid session' }, { status: 401 });
    }

    console.log('Session user:', session.user);

    let user = await NormalUser.findOne({ email: session.user.email });
    
    if (!user) {
      user = await StudentUser.findOne({ email: session.user.email });
    }

    if (!user) {
      console.error('User not found for email:', session.user.email);
      return NextResponse.json({ message: 'User not found', error: 'No user record found' }, { status: 404 });
    }

    console.log('User interests:', user.interests);

    return NextResponse.json({ interests: user.interests || [] }, { status: 200 });
  } catch (error) {
    console.error('Error in GET /api/ai/interests/get:', error);
    return NextResponse.json(
      { message: 'Server error', error: error.message },
      { status: 500 }
    );
  }
}