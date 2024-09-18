import { connectMongoDB } from '../../../../lib/mongodb'; // MongoDB connection function
import Favorites from '../../../../models/favorites'; // Favorites model
import { NextResponse } from 'next/server'; // Import NextResponse

// POST handler to add or remove favorites
export async function POST(req) {
  try {
    await connectMongoDB(); // เชื่อมต่อกับ MongoDB

    const data = await req.json(); // แปลงข้อมูล JSON จากเนื้อหาของการร้องขอ

    console.log("ข้อมูลที่ได้รับ:", data); // บันทึกข้อมูลที่ได้รับ

    const { username, projectId, projectname, description, receive, price, review, sold, rathing, imageUrl, author } = data;

    // ตรวจสอบข้อมูลที่จำเป็น
    if (!username || !projectId ) {
      return new NextResponse(JSON.stringify({ error: 'ขาดข้อมูลที่จำเป็น' }), { status: 400 });
    }

    // ตรวจสอบว่ามีรายการโปรดอยู่แล้วหรือไม่
    const existingFavorite = await Favorites.findOne({ username, projectId });

    if (existingFavorite) {
      // ลบรายการโปรดหากมีอยู่แล้ว
      await Favorites.deleteOne({ username, projectId });
      return new NextResponse(JSON.stringify({ message: "ลบจากรายการโปรดแล้ว" }), { status: 200 });
    } else {
      // เพิ่มรายการโปรดพร้อมข้อมูลเพิ่มเติม
      const newFavorite = new Favorites({
        username,
        projectId,
        projectname,
        description,
        receive,
        price,
        review,
        sold,
        rathing,
        imageUrl,
        author
      });
      await newFavorite.save();
      return new NextResponse(JSON.stringify({ message: "เพิ่มลงในรายการโปรดแล้ว" }), { status: 201 });
    }
  } catch (error) {
    console.error('ข้อผิดพลาดในการจัดการคำร้อง POST:', error.message);
    return new NextResponse(JSON.stringify({ error: 'ข้อผิดพลาดภายในเซิร์ฟเวอร์' }), { status: 500 });
  }
}

export async function GET(req) {
  try {
    await connectMongoDB(); // เชื่อมต่อกับ MongoDB

    const { searchParams } = new URL(req.url); // ดึง query parameters จาก URL
    const username = searchParams.get('username'); // รับค่า username

    console.log("Received query parameters:", { username });

    if (!username) {
      return new NextResponse(JSON.stringify({ error: "Missing required query parameter: username" }), { status: 400 });
    }

    // ค้นหารายการโปรดตาม username
    const favorites = await Favorites.find({ username }).exec();

    return new NextResponse(JSON.stringify(favorites), { status: 200 });
  } catch (error) {
    console.error('Error fetching favorites:', error.message); // แสดงข้อผิดพลาด
    return new NextResponse(JSON.stringify({ error: 'Failed to fetch favorites' }), { status: 500 });
  }
}
