import { NextResponse } from 'next/server';
import { connectMongoDB } from '../../../../lib/mongodb'; // ปรับเส้นทางตามความจำเป็น
import Order from '../../../../models/order'; // ปรับเส้นทางตามความจำเป็น
import Project from '../../../../models/project'; // ปรับเส้นทางตามความจำเป็น

export async function GET(req) {
  try {
    // เชื่อมต่อกับ MongoDB
    await connectMongoDB();

    // ดึงอีเมลจาก query params
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');

    if (!email) {
      return new NextResponse(JSON.stringify({ error: "Missing required query parameter: email" }), { status: 400 });
    }

    // ค้นหาออเดอร์ที่ตรงกับอีเมลและ populate ข้อมูลสินค้า
    const order = await Order.findOne({ email });

    if (!order || !order.product) {
      return new NextResponse(JSON.stringify({ projects: null }), { status: 200 }); // ส่งกลับ null ถ้าไม่พบออเดอร์หรือสินค้า
    }

    // ดึง product จาก order (กรณี product เป็น object เดียว)
    const productId = order.product._id;

    // ค้นหา projects ที่ _id ตรงกับ product จาก order
    const matchedProject = await Project.findById(productId);

    // ส่งข้อมูล project กลับ
    return new NextResponse(JSON.stringify({ project: matchedProject }), { status: 200 });

  } catch (error) {
    console.error('Error fetching orders or projects:', error.message);
    return new NextResponse(JSON.stringify({ error: 'Failed to fetch orders or projects' }), { status: 500 });
  }
}
