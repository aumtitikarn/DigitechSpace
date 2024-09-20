import { connectMongoDB } from '../../../../lib/mongodb'; // MongoDB connection function
import Favorites from '../../../../models/favorites'; // ตรวจสอบว่าเป็น Favorites model ที่ถูกต้อง
import { NextResponse } from 'next/server'; // Import NextResponse

// POST handler to add or remove favorites
export async function POST(req) {
  try {
    await connectMongoDB(); // เชื่อมต่อกับ MongoDB

    const data = await req.json(); // แปลงข้อมูล JSON จากเนื้อหาของการร้องขอ

    console.log("ข้อมูลที่ได้รับ:", data); // บันทึกข้อมูลที่ได้รับ

    const { projectId, email } = data;

    // ตรวจสอบข้อมูลที่จำเป็น
    if (!projectId || !email) {
      return new NextResponse(JSON.stringify({ error: 'ขาดข้อมูลที่จำเป็น' }), { status: 400 });
    }

    // ตรวจสอบว่ามีรายการโปรดอยู่แล้วหรือไม่
    const existingFavorite = await Favorites.findOne({ email });

    if (existingFavorite) {
      // ตรวจสอบว่า projectId มีอยู่แล้วในรายการโปรดหรือไม่
      const isFavorited = existingFavorite.projectId.includes(projectId);

      if (isFavorited) {
        // ลบ projectId ออกจากรายการโปรด
        await Favorites.updateOne(
          { email },
          { $pull: { projectId: projectId } }
        );
        return new NextResponse(JSON.stringify({ message: "ลบจากรายการโปรดแล้ว" }), { status: 200 });
      } else {
        // เพิ่ม projectId ลงในรายการโปรด
        await Favorites.updateOne(
          { email },
          { $addToSet: { projectId: projectId } }
        );
        return new NextResponse(JSON.stringify({ message: "เพิ่มลงในรายการโปรดแล้ว" }), { status: 201 });
      }
    } else {
      // สร้างเอกสารใหม่หากยังไม่มีรายการโปรด
      const newFavorite = new Favorites({
        email,
        projectId: [projectId], // เริ่มต้นด้วย array ที่มี projectId
      });
      await newFavorite.save();
      return new NextResponse(JSON.stringify({ message: "เพิ่มลงในรายการโปรดแล้ว" }), { status: 201 });
    }
  } catch (error) {
    console.error('ข้อผิดพลาดในการจัดการคำร้อง POST:', error.message);
    return new NextResponse(JSON.stringify({ error: 'ข้อผิดพลาดภายในเซิร์ฟเวอร์' }), { status: 500 });
  }
}

// GET handler to fetch favorites
export async function GET(req) {
  try {
    await connectMongoDB();

    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email'); // Get the email from query params

    if (!email) {
      return new NextResponse(JSON.stringify({ error: "Missing required query parameter: email" }), { status: 400 });
    }

    // Find the user's favorites by email
    const favoriteProjects = await Favorites.findOne({ email }, 'projectId').exec(); 

    if (!favoriteProjects) {
      return new NextResponse(JSON.stringify([]), { status: 200 }); // Return empty array if no favorites found
    }

    // Send back the array of projectIds
    return new NextResponse(JSON.stringify(favoriteProjects.projectId), { status: 200 });
  } catch (error) {
    console.error('Error fetching favorites:', error.message);
    return new NextResponse(JSON.stringify({ error: 'Failed to fetch favorites' }), { status: 500 });
  }
}

