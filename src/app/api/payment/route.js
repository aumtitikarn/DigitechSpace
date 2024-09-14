import Omise from 'omise';
import { NextResponse } from 'next/server';

const omise = new Omise({
  secretKey: process.env.OMISE_SECRET_KEY,
  publicKey: process.env.OMISE_PUBLIC_KEY,
});

export async function POST(request) {
  try {
    const body = await request.json();
    console.log('Received request body:', body);

    const { token, amount, description, typec, product, btype, email, name } = body;

    if (!token || !amount || !description || !typec) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    console.log('Creating charge with:', { amount, description, typec, product, btype, token });

    let charge;

    if (typec === 'credit_card') {
      const customer = await omise.customers.create({
        email: email,
        description: name,
        card: token, 
      });

      charge = await omise.charges.create({
        amount: Math.round(amount * 100), // amount in satang
        currency: 'thb',
        customer: customer.id,
        return_uri: `http://localhost:3000/myproject`,
      });
    } else {
     
      charge = await omise.charges.create({
        amount: Math.round(amount * 100), // amount in satang
        currency: 'thb',
        source: token, 
        description: description,
        return_uri: `http://localhost:3000/myproject`,
        metadata: {
          typec,
          product,
          btype,
          email,
        },
      });
    }

    console.log('Charge created successfully:', charge);

    return NextResponse.json({
      authorizeUri: typec === 'credit_card' ? `return_uri: http://localhost:3000/myproject` : charge.authorize_uri,
      status: 'success',
      token: charge.id,
      charge: {
        id: charge.id,
        status: charge.status,
        amount: charge.amount / 100, // back to THB from satang
        currency: charge.currency,
      },
    }, { status: 200 });

  } catch (error) {
    console.error('Payment error:', error);
    return NextResponse.json({
      status: 'error',
      message: error.message || 'An unknown error occurred',
    }, { status: 500 });
  }
}
