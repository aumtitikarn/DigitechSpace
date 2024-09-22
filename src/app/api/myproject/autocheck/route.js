import { NextResponse } from 'next/server';
import { connectMongoDB } from '../../../../../lib/mongodb';
import Order from '../../../../../models/order';
import StudentUser from '../../../../../models/StudentUser';

export async function POST(request) {
    try {
        const { email } = await request.json();

        if (!email) {
            return NextResponse.json({ error: 'Email is required' }, { status: 400 });
        }

        await connectMongoDB();

        const now = new Date();
        const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

        // Find and update eligible orders (where check is false)
        const result = await Order.updateMany(
            {
                email,
                createdAt: { $lt: sevenDaysAgo },
                check: false, // Update only those orders where check is false
            },
            { $set: { check: true } } // Change check to true
        );

        console.log(`Updated ${result.modifiedCount} orders`);

        if (result.modifiedCount > 0) {
            // Update the user only if orders were updated (check changed to true)
            const checkedOrders = await Order.find({
                email,
                check: true,
                createdAt: { $lt: sevenDaysAgo }
            });

            console.log(`Found ${checkedOrders.length} checked orders`);

            let totalAmount = 0;
            let totalNet = 0;
            let totalWithdrawable = 0;
            let totalServicefee = 0

            checkedOrders.forEach(order => {
                const amount = order.amount;
                const serviceFee = amount * 0.3; // 0.3% service fee
                const withdrawable = amount - serviceFee;

                totalAmount += amount;
                totalNet += order.net;
                totalWithdrawable += withdrawable;
                totalServicefee += order.servicefee

                console.log(`Order: amount=${amount}, net=${order.net}, withdrawable=${withdrawable}`);
            });

            console.log(`Totals: amount=${totalAmount}, net=${totalNet}, withdrawable=${totalWithdrawable}`);

            const updateResult = await StudentUser.findOneAndUpdate(
                { email },
                {
                    $inc: {
                        amount: totalAmount,
                        net: totalNet,
                        withdrawable: totalWithdrawable,
                        servicefee: totalServicefee
                    }
                },
                { new: true }
            );

            console.log('Updated StudentUser:', updateResult);

            if (!updateResult) {
                console.log('StudentUser not found');
                return NextResponse.json({ error: 'StudentUser not found' }, { status: 404 });
            }

            return NextResponse.json({
                message: 'Auto-check completed',
                updatedCount: result.modifiedCount,
                updatedUser: {
                    amount: updateResult.amount,
                    net: updateResult.net,
                    withdrawable: updateResult.withdrawable,
                }
            }, { status: 200 });
        } else {
            // If no orders were updated, don't update the user
            return NextResponse.json({
                message: 'No updates required',
                updatedCount: result.modifiedCount
            }, { status: 200 });
        }
    } catch (error) {
        console.error('Error in auto-check:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
