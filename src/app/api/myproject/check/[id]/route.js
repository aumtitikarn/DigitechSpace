import { NextResponse } from 'next/server';
import { connectMongoDB } from '../../../../../../lib/mongodb';
import Order from '../../../../../../models/order';
import StudentUser from "../../../../../../models/StudentUser";
import Project from '../../../../../../models/project'; // เพิ่ม import สำหรับ Project model

export async function POST(request, { params }) {
  const { id } = params;
  console.log('Received check request for order id:', id);

  try {
    await connectMongoDB();

    // Find the order and update its check status
    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { $set: { check: true } },
      { new: true }
    );

    if (!updatedOrder) {
      console.log('Order not found');
      return NextResponse.json(
        { message: 'Order not found' },
        { status: 404 }
      );
    }

    console.log('Updated order:', updatedOrder);

    // Find the associated project
    const associatedProject = await Project.findById(updatedOrder.product);

    if (!associatedProject) {
      console.log('Associated project not found');
      return NextResponse.json(
        { message: 'Associated project not found' },
        { status: 404 }
      );
    }

    console.log('Associated project:', associatedProject);

    // Calculate servicefee and withdrawable amount
    const amount = updatedOrder.amount;
    const servicefee = updatedOrder.servicefee;
    const withdrawable = amount - servicefee;

    console.log('Updating StudentUser for project owner email:', associatedProject.email);
    console.log('Update values:', {
      amount: amount,
      withdrawable: withdrawable,
    });

    // Update StudentUser schema for the project owner
    const updatedStudent = await StudentUser.findOneAndUpdate(
      { email: associatedProject.email },
      {
        $inc: {
          amount: amount || 0,
          net: updatedOrder.net || 0,
          withdrawable: withdrawable || 0,
          servicefee: updatedOrder.servicefee || 0,
        }
      },
      { new: true, upsert: true }
    );

    if (!updatedStudent) {
      console.log('Project owner not found and not created');
      return NextResponse.json(
        { message: 'Project owner not found and not created' },
        { status: 404 }
      );
    }

    console.log('Updated project owner:', updatedStudent);

    return NextResponse.json(
      {
        message: 'Order checked, project found, and owner updated successfully',
        order: updatedOrder,
        project: associatedProject,
        owner: updatedStudent
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error checking order, finding project, and updating owner:', error);
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}