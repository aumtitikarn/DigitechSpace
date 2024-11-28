// app/api/notification/route.js
import { connectMongoDB } from '../../../../lib/mongodb';
import Notification from '../../../../models/notification';
import { NextResponse } from 'next/server';

export const POST = async (req) => {
  await connectMongoDB();
  const { email } = await req.json();

  try {
    const notification = await Notification.findOne({ email });

    if (!notification) {
      return new Response(JSON.stringify({
        notifications: { message: [], times: [], read: [] },
        updatedAt: null
      }), { status: 200 });
    }

    return new Response(JSON.stringify({
      notifications: {
        message: notification.notifications.message,
        times: notification.notifications.times,
        read: notification.notifications.read
      },
      updatedAt: notification.updatedAt
    }), { status: 200 });
  } catch (error) {
    console.error("Error fetching notifications:", error.message);
    return new Response(JSON.stringify({ message: "Error fetching notifications" }), { status: 500 });
  }
};

export async function GET(req) {
  try {
    await connectMongoDB();
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');

    if (!email) {
      return new NextResponse(JSON.stringify({ error: "Missing required query parameter: email" }), { status: 400 });
    }

    const notification = await Notification.findOne({ email });

    if (!notification) {
      return new NextResponse(JSON.stringify({
        notifications: { message: [], times: [], read: [] },
        updatedAt: null
      }), { status: 200 });
    }

    return new NextResponse(JSON.stringify({
      notifications: {
        message: notification.notifications.message,
        times: notification.notifications.times,
        read: notification.notifications.read
      },
      updatedAt: notification.updatedAt
    }), { status: 200 });
  } catch (error) {
    console.error('Error fetching notifications:', error.message);
    return new NextResponse(JSON.stringify({ error: 'Failed to fetch notifications' }), { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    await connectMongoDB();
    const { email, messageIndex } = await req.json();

    const notification = await Notification.findOne({ email });

    if (!notification) {
      return NextResponse.json({ error: "Notification not found" }, { status: 404 });
    }

    notification.notifications.message.splice(messageIndex, 1);
    notification.notifications.times.splice(messageIndex, 1);
    notification.notifications.read.splice(messageIndex, 1);
    notification.updatedAt = new Date();

    await notification.save();

    return NextResponse.json({
      notifications: {
        message: notification.notifications.message,
        times: notification.notifications.times,
        read: notification.notifications.read
      },
      updatedAt: notification.updatedAt
    }, { status: 200 });
  } catch (error) {
    console.error("Error deleting notification:", error.message);
    return NextResponse.json({ error: "Failed to delete notification" }, { status: 500 });
  }
}