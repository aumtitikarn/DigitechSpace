import { connectMongoDB } from '../../../../lib/mongodb'; // เปลี่ยนเส้นทางตามที่คุณตั้งค่า
import Notification from '../../../../models/notification'; // โมเดล Notification ของคุณ
import { NextResponse } from 'next/server'; // นำเข้า NextResponse

// สำหรับ POST request
export const POST = async (req) => {
    await connectMongoDB();
    const { email } = await req.json();

    try {
        // ค้นหาข้อมูล notification สำหรับ email ที่กำหนด
        const notification = await Notification.findOne({ email });

        if (!notification) {
            // หากไม่มีข้อมูล notification ให้ส่ง array ว่างกลับไป
            return new Response(JSON.stringify({ notifications: { message: [], times: [] }, updatedAt: null }), { status: 200 });
        }

        // ส่งคืนข้อความและเวลาของแต่ละ notification
        return new Response(JSON.stringify({ 
            notifications: {
                message: notification.notifications.message,
                times: notification.notifications.times
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

        // ค้นหาข้อมูล notification โดยใช้ email
        const notification = await Notification.findOne({ email }, 'notifications updatedAt').exec();

        if (!notification) {
            // หากไม่มีข้อมูล ให้ส่งคืน array ว่าง
            return new NextResponse(JSON.stringify({ notifications: { message: [], times: [] }, updatedAt: null }), { status: 200 });
        }

        // ส่งคืนข้อความที่อยู่ใน notification array และ updatedAt
        return new NextResponse(JSON.stringify({ 
            notifications: {
                message: notification.notifications.message,
                times: notification.notifications.times
            }, 
            updatedAt: notification.updatedAt 
        }), { status: 200 });
    } catch (error) {
        console.error('Error fetching notifications:', error.message);
        return new NextResponse(JSON.stringify({ error: 'Failed to fetch notifications' }), { status: 500 });
    }
}
// DELETE a single notification
export async function DELETE(req) {
    try {
        await connectMongoDB();
        const { email, messageIndex } = await req.json();

        const notification = await Notification.findOne({ email });

        if (!notification) {
            return NextResponse.json({ error: "Notification not found" }, { status: 404 });
        }

        // Remove the notification at the specified index
        notification.notifications.message.splice(messageIndex, 1);
        notification.notifications.times.splice(messageIndex, 1);
        notification.updatedAt = new Date();

        await notification.save();

        return NextResponse.json({
            notifications: {
                message: notification.notifications.message,
                times: notification.notifications.times
            },
            updatedAt: notification.updatedAt
        }, { status: 200 });
    } catch (error) {
        console.error("Error deleting notification:", error.message);
        return NextResponse.json({ error: "Failed to delete notification" }, { status: 500 });
    }
}
