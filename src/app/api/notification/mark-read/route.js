// app/api/notification/mark-read/route.js
import { connectMongoDB } from '../../../../../lib/mongodb';
import Notification from '../../../../../models/notification';

export async function PUT(req) {
  try {
    await connectMongoDB();
    const { email } = await req.json();

    const notification = await Notification.findOne({ email });
    if (!notification) {
      return new Response(JSON.stringify({ error: "Notification not found" }), { status: 404 });
    }

    // Update all notifications to read=true
    notification.notifications.read = notification.notifications.read.map(() => true);
    notification.updatedAt = new Date();
    await notification.save();

    return new Response(JSON.stringify({
      notifications: {
        message: notification.notifications.message,
        times: notification.notifications.times,
        read: notification.notifications.read
      },
      updatedAt: notification.updatedAt
    }), { status: 200 });

  } catch (error) {
    console.error("Error marking notifications as read:", error);
    return new Response(JSON.stringify({ error: "Failed to mark notifications as read" }), { status: 500 });
  }
}