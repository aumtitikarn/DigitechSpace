import { connectMongoDB } from '../../../../lib/mongodb';
import Withdrawal from '../../../../models/withdrawal';
import StudentUser from '../../../../models/StudentUser';
import { NextResponse } from 'next/server';

export async function POST(request) {
  await connectMongoDB();

  try {
    const { userId, amount, fullname, date, email, net } = await request.json();

    // Validate input
    if (!userId || !amount || isNaN(amount) || amount <= 0) {
      return NextResponse.json({ message: 'Invalid input' }, { status: 400 });
    }

    // Find the user
    const user = await StudentUser.findById(userId);

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    // Check if user has sufficient balance
    if (user.withdrawable < amount) {
      return NextResponse.json({ message: 'Insufficient balance' }, { status: 400 });
    }

    // Store original values for receipt
    const originalAmount = user.amount;
    const originalWithdrawable = user.withdrawable;
    const originalServiceFee = user.servicefee;
    const originalNet = user.net;

    // Update user balance and withdrawable amount
    const updatedUser = await StudentUser.findByIdAndUpdate(
      userId,
      {
        $set: {
          amount: 0,
          withdrawable: 0,
          servicefee: 0,
          net: 0.0
        }
      },
      { new: true, runValidators: false }
    );

    // Create withdrawal record with original values
    const withdrawal = new Withdrawal({
      userId,
      date,
      withdrawn: amount,
      net: originalNet,
      status: 'pending',
      receipt: {
        fullname,
        date,
        servicefee: originalServiceFee,
        gross: originalAmount,
        withdrawable: originalWithdrawable,
        email
      }
    });

    await withdrawal.save();

    return NextResponse.json({
      message: 'Withdrawal successful',
      withdrawal,
      updatedAmount: updatedUser.amount,
      updatedWithdrawable: updatedUser.withdrawable,
      updatedNet: updatedUser.net,
      updatedServiceFee: updatedUser.servicefee
    }, { status: 200 });
  } catch (error) {
    console.error('Withdrawal error:', error);
    return NextResponse.json({ message: 'Internal server error', error: error.message }, { status: 500 });
  }
}