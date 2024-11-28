// /app/api/notification/delete-all/route.js
import { connectMongoDB } from '../../../../../lib/mongodb';
import Notification from '../../../../../models/notification';
import { NextResponse } from 'next/server';

export async function DELETE(req) {
    try {
        await connectMongoDB();
        const { email } = await req.json();

        const notification = await Notification.findOne({ email });

        if (!notification) {
            return NextResponse.json({ error: "Notification not found" }, { status: 404 });
        }

        // Clear all notifications
        notification.notifications.message = [];
        notification.notifications.times = [];
        notification.updatedAt = new Date();

        await notification.save();

        return NextResponse.json({
            notifications: {
                message: [],
                times: []
            },
            updatedAt: notification.updatedAt
        }, { status: 200 });
    } catch (error) {
        console.error("Error deleting all notifications:", error.message);
        return NextResponse.json({ error: "Failed to delete all notifications" }, { status: 500 });
    }
}