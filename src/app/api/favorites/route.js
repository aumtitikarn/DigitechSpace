import { connectMongoDB } from '../../../../lib/mongodb';
import Favorites from '../../../../models/favorites';
import { NextResponse } from 'next/server';

// POST handler to add or remove favorites
export async function POST(req) {
  try {
    await connectMongoDB();

    const data = await req.json();
    console.log("ข้อมูลที่ได้รับ:", data);

    const { projectId, email } = data;

    if (!projectId || !email) {
      return new NextResponse(JSON.stringify({ error: 'ขาดข้อมูลที่จำเป็น' }), { status: 400 });
    }

    // ตรวจสอบว่ามีรายการโปรดอยู่แล้วหรือไม่
    let existingFavorite = await Favorites.findOne({ email });

    if (existingFavorite) {
      // ตรวจสอบว่า projectId มีอยู่แล้วในรายการโปรดหรือไม่
      const isFavorited = existingFavorite.projectId.includes(projectId);

      if (isFavorited) {
        // ลบ projectId ออกจากรายการโปรด
        await Favorites.updateOne(
          { email },
          { $pull: { projectId: projectId } }
        );
      
        // เช็คว่าหลังจากลบ projectId แล้ว รายการโปรดว่างเปล่าหรือไม่
        const updatedFavorite = await Favorites.findOne({ email });
        if (updatedFavorite.projectId.length === 0) {
          await Favorites.updateOne(
            { email },
            { $set: { status: 'pending' } }
          );
        }
      
        return new NextResponse(JSON.stringify({ isFavorited: false }), { status: 200 });
      } else {
        // เพิ่ม projectId ลงในรายการโปรด
        await Favorites.updateOne(
          { email },
          { $addToSet: { projectId: projectId } }
        );
      
        await Favorites.updateOne(
          { email },
          { $set: { status: 'favorites' } }
        );
      
        return new NextResponse(JSON.stringify({ isFavorited: true }), { status: 201 });
      }
    } else {
      // สร้างรายการโปรดใหม่สำหรับผู้ใช้
      const newFavorite = new Favorites({
        email,
        projectId: [projectId],
        status: 'favorites'
      });
      await newFavorite.save();
      
      return new NextResponse(JSON.stringify({ isFavorited: true }), { status: 201 });
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
    const email = searchParams.get('email');

    if (!email) {
      return new NextResponse(JSON.stringify({ error: "Missing required query parameter: email" }), { status: 400 });
    }

    const favoriteProjects = await Favorites.findOne({ email }, 'projectId').exec();

    if (!favoriteProjects) {
      return new NextResponse(JSON.stringify([]), { status: 200 });
    }

    return new NextResponse(JSON.stringify(favoriteProjects.projectId), { status: 200 });
  } catch (error) {
    console.error('Error fetching favorites:', error.message);
    return new NextResponse(JSON.stringify({ error: 'Failed to fetch favorites' }), { status: 500 });
  }
}