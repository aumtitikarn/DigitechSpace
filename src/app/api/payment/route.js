import Omise from 'omise';
import { NextResponse } from 'next/server';
import { connectMongoDB } from "../../../../lib/mongodb";
import  Order  from "../../../../models/order"
import  Project  from "../../../../models/project"
import Notification from "../../../../models/notification";
import { getThaiDateTime, formatThaiDateTime } from '../../../../models/date';


const omise = new Omise({
  secretKey: process.env.OMISE_SECRET_KEY,
  publicKey: process.env.OMISE_PUBLIC_KEY,
});

export async function POST(request) {
  try {
    const body = await request.json();
    console.log('Received request body:', body);
    const { token, amount, description, typec, product, btype, email, name, net } = body;

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
        amount: Math.round(amount * 100), 
        currency: 'thb',
        customer: customer.id,
        return_uri: `https://digitechspace.loca.lt/myproject`,
      });
      if (charge.status === 'successful') {
        await connectMongoDB();
        const servicefee = (charge.amount / 100) * 0.3;
        const withdrawable = (charge.amount / 100) - servicefee;
        const newOrder = new Order({
          email,
          product,
          net: charge.net / 100,
          amount: charge.amount / 100,
          servicefee,
          withdrawable,
          typec,
          chargeId: charge.id,
          status: charge.status,
          check: false,
        });
  
        await newOrder.save();
  
        const updatedProject = await Project.findByIdAndUpdate(
          product,
          { $inc: { sold: 1 } },
          { new: true }
        );
  
        console.log('Project sold count incremented');
        console.log('Order saved to MongoDB:', newOrder);
        
        // Find the project owner's email
        const projectOwner = await Project.findById(product);
        if (projectOwner) {
          const thaiTime = getThaiDateTime();
          console.log('Thai time to be saved:', thaiTime);
          // Create or update the notification
          const notificationMessage = `Project: ${updatedProject.projectname} has been sold for ${charge.amount / 100} THB.`;
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
        }
      }
    } else {
     
      charge = await omise.charges.create({
        amount: Math.round(amount * 100),
        currency: 'thb',
        source: token, 
        description: description,
        return_uri: `https://digitechspace.loca.lt/myproject`,
        metadata: {
          typec,
          name,
          product,
          btype,
          email,
        },
      });
    }

    console.log('Charge created successfully:', charge);


    return NextResponse.json({
      authorizeUri: typec === 'credit_card' ? `return_uri: https://digitechspace.loca.lt/myproject` : charge.authorize_uri,
      status: 'success',
      token: charge.id,
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
