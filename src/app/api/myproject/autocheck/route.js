import { NextResponse } from 'next/server';
import { connectMongoDB } from '../../../../../lib/mongodb';
import Order from '../../../../../models/order';
import StudentUser from '../../../../../models/StudentUser';
import Project from '../../../../../models/project';
import { getThaiDateTime, getThaiDateTimeMinusDays, formatThaiDateTime } from '../../../../../models/date';

export async function POST(request) {
    try {
  

        await connectMongoDB();

        const now = getThaiDateTime();
        const sevenDaysAgo = getThaiDateTimeMinusDays(7);

        console.log('Current date:', formatThaiDateTime(now));
        console.log('Seven days ago:', formatThaiDateTime(sevenDaysAgo));

        // Find and update eligible orders (where check is false)
        const result = await Order.updateMany(
            {
                createdAt: { $lt: sevenDaysAgo },
                check: false,
            },
            { $set: { check: true } }
        );

        console.log(`Updated ${result.modifiedCount} orders`);

        if (result.modifiedCount > 0) {
            // Fetch the updated orders
            const checkedOrders = await Order.find({

                check: true,
                createdAt: { $lt: sevenDaysAgo }
            });

            console.log(`Found ${checkedOrders.length} checked orders`);
            console.log('Updated Order IDs:', checkedOrders.map(order => order._id));

            // Group orders by product (project) ID
            const ordersByProject = checkedOrders.reduce((acc, order) => {
                if (!acc[order.product]) {
                    acc[order.product] = [];
                }
                acc[order.product].push(order);
                return acc;
            }, {});

            // Process each project
            for (const [projectId, projectOrders] of Object.entries(ordersByProject)) {
                const project = await Project.findById(projectId);
                if (!project) {
                    console.log(`Project not found for ID: ${projectId}`);
                    continue;
                }

                let projectTotalAmount = 0;
                let projectTotalNet = 0;
                let projectTotalWithdrawable = 0;
                let projectTotalServicefee = 0;

                projectOrders.forEach(order => {
                    projectTotalAmount += order.amount;
                    projectTotalNet += order.net;
                    projectTotalWithdrawable += order.amount - order.servicefee;
                    projectTotalServicefee += order.servicefee;
                });

                console.log(`Updating StudentUser for project ${projectId}, email: ${project.email}`);
                console.log(`Project totals: amount=${projectTotalAmount}, net=${projectTotalNet}, withdrawable=${projectTotalWithdrawable}, servicefee=${projectTotalServicefee}`);

                // Update StudentUser for the project owner
                const updatedStudent = await StudentUser.findOneAndUpdate(
                    { email: project.email },
                    {
                        $inc: {
                            amount: projectTotalAmount,
                            net: projectTotalNet,
                            withdrawable: projectTotalWithdrawable,
                            servicefee: projectTotalServicefee
                        }
                    },
                    { new: true, upsert: true }
                );

                console.log(`Updated StudentUser for project ${projectId}:`, updatedStudent);
            }

            return NextResponse.json({
                message: 'Auto-check completed and project owners updated',
                updatedCount: result.modifiedCount,
            }, { status: 200 });
        } else {
            return NextResponse.json({
                message: 'No updates required',
                updatedCount: 0
            }, { status: 200 });
        }
    } catch (error) {
        console.error('Error in auto-check:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}