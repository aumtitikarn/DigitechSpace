// File: src/app/api/webhook/route.js
import { NextResponse } from 'next/server';
import { connectMongoDB } from "../../../../../lib/mongodb";
import  Order  from "../../../../../models/order"
import  Project  from "../../../../../models/project"
import  StudentUser  from "../../../../../models/StudentUser"
import {getThaiDateTime } from '../../../../../models/date';
import Notification from "../../../../../models/notification";

export async function POST(request) {
    try {
      const body = await request.json();
      console.log('Received webhook:', body);
  
      if (body.key === 'charge.complete') {
        const charge = body.data;
        
        await connectMongoDB();
        const servicefee = (charge.amount / 100) * 0.3;
        const withdrawable = (charge.amount / 100) - servicefee;
        const newOrder = new Order({
          email: charge.metadata.email,
          name: charge.metadata.name,
          product: charge.metadata.product,
          amount: charge.amount / 100,
          servicefee,
          withdrawable,
          net: charge.net / 100,
          typec: charge.metadata.typec,
          chargeId: charge.id,
          status: charge.status,
          check: false
        });
  
        await newOrder.save();
        await Project.findByIdAndUpdate(
          charge.metadata.product,
          { $inc: { sold: 1 } },
          { new: true }
        );
       
        console.log('Order saved to MongoDB:', newOrder);
        if (Project) {
          // Create or update the notification
          const projectOwner = await Project.findById(charge.metadata.product);
          const thaiTime = getThaiDateTime();
          const notificationMessage = `Project: ${projectOwner.projectname || 'Unknown'} has been sold for ${charge.amount / 100} THB.`;

          await Notification.findOneAndUpdate(
            { email: projectOwner.email },
            { 
              $push: { 
                'notifications.message': notificationMessage,
                'notifications.times': thaiTime
              } 
            },
            { upsert: true, new: true }
          );
          console.log('Notification added for project owner');
        } else {
          console.error('Project not found for ID:', charge.metadata.product);
        }
  
        return NextResponse.json({ message: 'Order saved successfully' }, { status: 200 });
      }
  
      return NextResponse.json({ message: 'Webhook received' }, { status: 200 });
    } catch (error) {
      console.error('Webhook error:', error);
      return NextResponse.json({ message: 'Webhook processing failed' }, { status: 500 });
    }
  }