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
            return new Response(JSON.stringify({ notifications: [], updatedAt: null }), { status: 200 });
        }

        // ส่งคืนแค่ฟิลด์ notifications และวันที่ updatedAt
        return new Response(JSON.stringify({ notifications: notification.notifications, updatedAt: notification.updatedAt }), { status: 200 });
    } catch (error) {
        console.error("Error fetching notifications:", error.message);
        return new Response(JSON.stringify({ message: "Error fetching notifications" }), { status: 500 });
    }
};

// สำหรับ GET request
export async function GET(req) {
    try {
        await connectMongoDB();

        const { searchParams } = new URL(req.url);
        const email = searchParams.get('email');

        if (!email) {
            return new NextResponse(JSON.stringify({ error: "Missing required query parameter: email" }), { status: 400 });
        }

        // ค้นหาข้อมูล notification โดยใช้ email
        const notification = await Notification.findOne({ email }, 'notifications updatedAt').exec(); // เพิ่ม updatedAt เพื่อดึงวันที่

        if (!notification) {
            return new NextResponse(JSON.stringify({ notifications: [], updatedAt: null }), { status: 200 });
        }

        // ส่งคืนข้อความที่อยู่ใน notification array และ updatedAt
        return new NextResponse(JSON.stringify({ notifications: notification.notifications, updatedAt: notification.updatedAt }), { status: 200 });
    } catch (error) {
        console.error('Error fetching notifications:', error.message);
        return new NextResponse(JSON.stringify({ error: 'Failed to fetch notifications' }), { status: 500 });
    }
}
