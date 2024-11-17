import { NextResponse } from "next/server";
import { connectMongoDB } from '../../../../lib/mongodb';
import Order from '../../../../models/order';
import { getServerSession } from "next-auth";
import { authOptions } from '../../../app/api/auth/[...nextauth]/route';

const isValidHttpUrl = (string) => {
  let url;
  try {
    url = new URL(string);
  } catch (_) {
    return false;
  }
  return url.protocol === "http:" || url.protocol === "https:";
};

const getProxyUrl = (url) => `/api/proxy?url=${encodeURIComponent(url)}`;

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.email) {
      console.log('Session or user email is missing:', session);
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await connectMongoDB();

    console.log("Request received:", req.url);
    console.log("User email:", session.user.email);

    const pipeline = [
      {
        $match: {
          email: session.user.email,
          status: "successful"
        }
      },
      {
        $lookup: {
          from: 'projects',
          let: { orderProduct: "$product" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: [{ $toString: "$_id" }, "$$orderProduct"]
                }
              }
            }
          ],
          as: 'projectDetails'
        }
      },
      {
        $unwind: {
          path: '$projectDetails',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $lookup: {
          from: 'studentusers',
          let: { authorEmail: "$projectDetails.email" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$email", "$$authorEmail"]
                }
              }
            },
            {
              $project: {
                name: 1,
                imageUrl: 1
              }
            }
          ],
          as: 'authorDetails'
        }
      },
      {
        $unwind: {
          path: '$authorDetails',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $project: {
          _id: 1,
          createdAt: 1,
          status: 1,
          product: 1,
          check: 1,
          'projectDetails._id': 1,
          'projectDetails.projectname': 1,
          'projectDetails.description': 1,
          'projectDetails.imageUrl': 1,
          'projectDetails.price': 1,
          'projectDetails.author': 1,
          'projectDetails.email': 1,
          'projectDetails.receive': 1,
          'projectDetails.permission': 1,
          'projectDetails.rathing': 1,
          'projectDetails.sold': 1,
          'projectDetails.review': 1,
          'projectDetails.category': 1,
          'projectDetails.filesUrl': 1,
          'projectDetails.status': 1,
          'authorName': { $ifNull: ['$authorDetails.name', 'Unknown Author'] },
          'authorImageUrl': '$authorDetails.imageUrl'
        }
      },
      { $sort: { createdAt: -1 } }
    ];

    let orders = await Order.aggregate(pipeline);

    // Process the profile image URLs
    orders = orders.map(order => ({
      ...order,
      profileImage: order.authorImageUrl 
        ? (isValidHttpUrl(order.authorImageUrl) 
            ? getProxyUrl(order.authorImageUrl) 
            : `/api/project/images/${order.authorImageUrl}`)
        : null
    }));

    console.log("Orders found:", orders.length);
    console.log("Sample order:", orders.length > 0 ? JSON.stringify(orders[0], null, 2) : "No orders");

    return NextResponse.json(orders, {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error("Error in API:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}