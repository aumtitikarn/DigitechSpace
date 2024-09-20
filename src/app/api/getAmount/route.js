import { NextResponse } from "next/server";
import { connectMongoDB } from '../../../../lib/mongodb';
import { getServerSession } from "next-auth";
import Studentuser from '../../../../models/StudentUser';
import { authOption } from '../../../app/api/auth/[...nextauth]/route';

export async function GET(req) {
  try {
    const session = await getServerSession(authOption);
    if (!session || !session.user || !session.user.email) {
      console.log('Session or user email is missing:', session);
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await connectMongoDB();

    const userEmail = session.user.email;
    const query = { email: userEmail };

    const user = await Studentuser.findOne(query).select('amount net SellInfo');

    if (user) {
      const amount = user.amount || 0; 
      const net = user.net || 0;
      const response = {
        amount: amount,
        net: net,
        fullname: user.SellInfo?.fullname || ''
      };
      return NextResponse.json(response, { status: 200 });
    } else {
      return NextResponse.json({ amount: 0, fullname: '' }, { status: 200 });
    }
  } catch (error) {
    console.error('Error in GET /api/getAmount:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}