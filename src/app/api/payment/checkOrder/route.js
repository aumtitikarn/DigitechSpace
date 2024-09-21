import { NextResponse } from 'next/server';
import { connectMongoDB } from '../../../../../lib/mongodb';
import Order from '../../../../../models/order';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get('email');
  const productId = searchParams.get('productId');

  if (!email || !productId) {
    return NextResponse.json({ error: 'Missing email or productId' }, { status: 400 });
  }

  try {
    await connectMongoDB();
    const order = await Order.findOne({ email, product: productId });
    return NextResponse.json({ hasOrder: !!order });
  } catch (error) {
    console.error('Error checking order:', error);
    return NextResponse.json({ error: 'Error checking order' }, { status: 500 });
  }
}