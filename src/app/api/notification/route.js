import { connectMongoDB } from '../../../../lib/mongodb'; // เปลี่ยนเส้นทางตามที่คุณตั้งค่า
import Notification from '../../../../models/notification'; // โมเดล Notification ของคุณ
import { NextResponse } from 'next/server'; // นำเข้า NextResponse
// สำหรับ POST request
export const POST = async (req) => {
    await connectMongoDB();

    const { email } = await req.json();

    try {
        // ค้นหาข้อมูล notification สำหรับ email ที่กำหนด
        const notifications = await Notification.find({ email });

        return new Response(JSON.stringify({ notifications }), { status: 200 });
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
        const notifications = await Notification.findOne({ email }, 'notifications').exec(); // เปลี่ยน 'notification' เป็น 'notifications'

        if (!notifications) {
            return new NextResponse(JSON.stringify([]), { status: 200 });
        }

        // ส่งคืนข้อความที่อยู่ใน notification array
        return new NextResponse(JSON.stringify(notifications.notifications), { status: 200 }); // เปลี่ยน 'notification' เป็น 'notifications'
    } catch (error) {
        console.error('Error fetching notification:', error.message);
        return new NextResponse(JSON.stringify({ error: 'Failed to fetch notification' }), { status: 500 });
    }
}
