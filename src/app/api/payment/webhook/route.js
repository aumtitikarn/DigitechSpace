// File: src/app/api/webhook/route.js
import { NextResponse } from 'next/server';
import { connectMongoDB } from "../../../../../lib/mongodb";
import  Order  from "../../../../../models/order"

export async function POST(request) {
    try {
      const body = await request.json();
      console.log('Received webhook:', body);
  
      if (body.key === 'charge.complete') {
        const charge = body.data;
        
        await connectMongoDB();
  
        const newOrder = new Order({
          email: charge.metadata.email,
          name: charge.metadata.name,
          product: charge.metadata.product,
          amount: charge.amount / 100,
          chargeId: charge.id,
          status: charge.status
        });
  
        await newOrder.save();
        console.log('Order saved to MongoDB:', newOrder);
  
        return NextResponse.json({ message: 'Order saved successfully' }, { status: 200 });
      }
  
      return NextResponse.json({ message: 'Webhook received' }, { status: 200 });
    } catch (error) {
      console.error('Webhook error:', error);
      return NextResponse.json({ message: 'Webhook processing failed' }, { status: 500 });
    }
  }