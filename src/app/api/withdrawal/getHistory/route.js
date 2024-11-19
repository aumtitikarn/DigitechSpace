import { NextResponse } from 'next/server';
import { connectMongoDB } from '../../../../../lib/mongodb';
import Project from '../../../../../models/project';
import Order from '../../../../../models/order';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/auth.config';
export const dynamic = 'force-dynamic';
export async function GET(req) {
  try {
    // Connect to the database
    await connectMongoDB();

    // Get the user's session
    const session = await getServerSession(authOptions);
    

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userEmail = session.user.email;

    // Find all projects for the user
    const projects = await Project.find({ email: userEmail }).sort({ createdAt: -1 });

    // Get order details for each project
    const purchaseHistory = await Promise.all(
      projects.map(async (project) => {
        const order = await Order.findOne({ product: project._id, check: true });

        if (!order) {
          
          return null;
        }

        const balance = order.amount - order.servicefee;
        return {
          date: order.createdAt,
          projectName: project.projectname,
          price: project.price,
          amount: order.amount,
          serviceFee: order.servicefee,
          balance: balance,
        };
      })
    );

    // Filter out any null entries (projects without matching orders)
    const validPurchaseHistory = purchaseHistory.filter(entry => entry !== null);

    return NextResponse.json(validPurchaseHistory);
  } catch (error) {
    console.error('Error in getHistory:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}