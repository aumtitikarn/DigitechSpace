// app/api/payment/route.js

import { NextResponse } from 'next/server';
import Omise from 'omise';

const omise = Omise({
  publicKey: process.env.OMISE_PUBLIC_KEY,
  secretKey: process.env.OMISE_SECRET_KEY,
});

export async function POST(request) {
  try {
    const { amount, token } = await request.json();

    const charge = await omise.charges.create({
      amount: amount * 100,
      currency: 'thb',
      source: token, // ใช้ source แทน card
    });

    if (charge.status === 'successful' || charge.status === 'pending') {
      return NextResponse.json({ success: true, charge: charge });
    } else {
      return NextResponse.json({ success: false, error: 'Payment failed', charge: charge }, { status: 400 });
    }
  } catch (error) {
    console.error('Error processing payment:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}