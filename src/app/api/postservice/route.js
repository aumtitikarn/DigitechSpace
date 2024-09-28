import { connectMongoDB } from "../../../../lib/mongodb";
import PostSer from "../../../../models/postservice";
import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt"; // ใช้ getToken เพื่อดึง session

export async function POST(req) {
    try {
        const token = await getToken({ req });

        if (!token) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const { report, email, username } = await req.json();
        
        console.log(report, email, username);

        // ตรวจสอบการเชื่อมต่อกับ MongoDB
        await connectMongoDB();

        // บันทึกข้อมูลใหม่ทุกครั้ง
        await PostSer.create({ report, email, username });

        // ส่งข้อความตอบกลับหากบันทึกสำเร็จ
        return NextResponse.json({ message: "PostService created successfully" }, { status: 201 });
    } catch (error) {
        console.error("Error creating PostService:", error);
        return NextResponse.json({ message: "Error creating PostService" }, { status: 500 });
    }
}




export async function GET() {
    try {
        // เชื่อมต่อกับ MongoDB
        await connectMongoDB();

        // ดึงข้อมูลทั้งหมดจากคอลเลกชัน
        const postservice = await PostSer.find({});

        // ส่งข้อมูลกลับไปยัง client
        return NextResponse.json({ postservice }, { status: 200 });
    } catch (error) {
        console.error("Error fetching PostService:", error);
        return NextResponse.json({ message: "Error fetching PostService" }, { status: 500 });
    }
}
