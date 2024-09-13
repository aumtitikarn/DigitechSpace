// app/api/payment/createOmiseToken/route.js

import { NextResponse } from 'next/server';
import Omise from 'omise';

const omise = Omise({
  publicKey: process.env.OMISE_PUBLIC_KEY,
  secretKey: process.env.OMISE_SECRET_KEY,
});

export async function POST(request) {
  try {
    const { paymentType, amount, tokenId } = await request.json();

    let token;

    if (paymentType === 'card') {
      // สำหรับบัตรเครดิต/เดบิต ใช้ tokenId ที่ได้จาก Omise.js บน client-side
      if (!tokenId) {
        return NextResponse.json({ error: 'Token ID is required for card payments' }, { status: 400 });
      }
      token = { id: tokenId };
    } else if (paymentType === 'mobile_banking') {
      // สำหรับ mobile banking สร้าง source แทน token
      const source = await omise.sources.create({
        type: 'mobile_banking_scb',
        amount: amount * 100,
        currency: 'thb',
      });
      token = { id: source.id };
    } else {
      return NextResponse.json({ error: 'Invalid payment type' }, { status: 400 });
    }

    return NextResponse.json({ token: token.id });
  } catch (error) {
    console.error('Error creating Omise token:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}