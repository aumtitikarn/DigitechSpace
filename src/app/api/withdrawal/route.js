import { connectMongoDB } from '../../../../lib/mongodb';
import Withdrawal from '../../../../models/withdrawal';
import StudentUser from '../../../../models/StudentUser'; // Assuming you have a User model
import { NextResponse } from 'next/server';

export async function POST(request) {
  await connectMongoDB();

  try {
    const { userId, amount, fullname, date, email } = await request.json();

    // Validate input
    if (!userId || !amount || isNaN(amount) || amount <= 0) {
      return NextResponse.json({ message: 'Invalid input' }, { status: 400 });
    }

    // Calculate net amount
    const netAmount = amount * 0.1065;

    // Update user balance and net
    const updatedUser = await StudentUser.findByIdAndUpdate(
      userId,
      {
        $inc: { 
          amount: -amount,
          net: -netAmount
        }
      },
      { new: true, runValidators: false }
    );

    if (!updatedUser) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    if (updatedUser.amount < 0) {
      return NextResponse.json({ message: 'Insufficient balance' }, { status: 400 });
    }

    // Calculate service fee and withdrawable amount after updating user
    const servicefee = updatedUser.amount * 0.3;
    const withdrawable = updatedUser.amount - servicefee;

    // Update the withdrawable field
    await StudentUser.findByIdAndUpdate(
      userId,
      { withdrawable },
      { new: true, runValidators: false }
    );

    // Create withdrawal record
    const withdrawal = new Withdrawal({
      userId,
      withdrawn: amount, 
      net: netAmount,
      status: 'pending',
      receipt: {
        fullname,
        date,
        gross: updatedUser.amount, // Gross is the amount before withdrawal
        withdrawable,
        servicefee,
        email
      }
    });

    await withdrawal.save();

    return NextResponse.json({ 
      message: 'Withdrawal successful', 
      withdrawal,
      updatedBalance: updatedUser.amount,
      updatedNet: updatedUser.net
    }, { status: 200 });

  } catch (error) {
    console.error('Withdrawal error:', error);
    return NextResponse.json({ message: 'Internal server error', error: error.message }, { status: 500 });
  }
}
