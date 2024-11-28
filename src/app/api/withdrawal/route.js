import { connectMongoDB } from '../../../../lib/mongodb';
import Withdrawal from '../../../../models/withdrawal';
import StudentUser from '../../../../models/StudentUser';
import { NextResponse } from 'next/server';
import mongoose from 'mongoose';

export async function POST(request) {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    await connectMongoDB();
    
    const { userId, amount, fullname, date, email, net } = await request.json();

    if (!userId || !amount || isNaN(amount) || amount <= 0) {
      return NextResponse.json({ message: 'Invalid input' }, { status: 400 });
    }

    const user = await StudentUser.findById(userId).session(session);
    
    if (!user) {
      await session.abortTransaction();
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    if (user.withdrawable < amount) {
      await session.abortTransaction();
      return NextResponse.json({ message: 'Insufficient balance' }, { status: 400 });
    }

    // Store original values
    const originalAmount = user.amount;
    const originalWithdrawable = user.withdrawable;
    const originalServiceFee = user.servicefee;
    const originalNet = user.net;

    // Update user balance
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
      { new: true, runValidators: false, session }
    );

    // Create withdrawal record
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

    await withdrawal.save({ session });
    await session.commitTransaction();

    return NextResponse.json({
      message: 'Withdrawal successful',
      withdrawal,
      updatedAmount: updatedUser.amount,
      updatedWithdrawable: updatedUser.withdrawable,
      updatedNet: updatedUser.net,
      updatedServiceFee: updatedUser.servicefee
    }, { status: 200 });

  } catch (error) {
    await session.abortTransaction();
    console.error('Withdrawal error:', error);
    return NextResponse.json({ 
      message: 'Transaction failed', 
      error: error.message 
    }, { status: 500 });
  } finally {
    session.endSession();
  }
}