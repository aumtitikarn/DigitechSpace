// // app/api/payment/route.js

// import { NextResponse } from 'next/server';
// import Omise from 'omise';

// const omise = Omise({
//   publicKey: process.env.OMISE_PUBLIC_KEY,
//   secretKey: process.env.OMISE_SECRET_KEY,
// });

// export async function POST(request) {
//   try {
//     const { amount, token } = await request.json();

//     const charge = await omise.charges.create({
//       amount: amount * 100,
//       currency: 'thb',
//       source: token, // ใช้ source แทน card
//     });

//     if (charge.status === 'successful' || charge.status === 'pending') {
//       return NextResponse.json({ success: true, charge: charge });
//     } else {
//       return NextResponse.json({ success: false, error: 'Payment failed', charge: charge }, { status: 400 });
//     }
//   } catch (error) {
//     console.error('Error processing payment:', error);
//     return NextResponse.json({ success: false, error: error.message }, { status: 500 });
//   }
// }
import Omise from 'omise';
import { NextResponse } from 'next/server';

const omise = new Omise({
  secretKey: process.env.OMISE_SECRET_KEY,
  publicKey: process.env.OMISE_PUBLIC_KEY,
});

export async function POST(request) {
  try {
    if (!omise) {
      throw new Error('Omise is not initialized');
    }

    const body = await request.json();
    console.log('Received request body:', body);

    const { token, amount, description, typec, product, btype } = body;

    if (!token || !amount || !description) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    console.log('Creating charge with:', { amount, description, typec, product, btype });

    const charge = await omise.charges.create({
      amount: Math.round(amount * 100), // amount in satang (1 THB = 100 satang)
      currency: 'thb',
      source: token, 
      description: description,
      return_uri: `http://localhost:3000/project/projectdetail/${token}`,
      capture: false,
      metadata: {
        typec,
        product,
        btype,
      },
    });

    console.log('Charge created successfully:', charge);

    return NextResponse.json({
      status: 'success',
      token: charge.id,
      authorize_uri: charge.authorize_uri,
      charge: {
        id: charge.id,
        status: charge.status,
        amount: charge.amount / 100, 
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