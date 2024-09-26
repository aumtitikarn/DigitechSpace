import { NextResponse } from 'next/server';
import { connectMongoDB } from '../../../../../lib/mongodb';
import Order from '../../../../../models/order';
import Project from '../../../../../models/project';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get('email');
  const productId = searchParams.get('productId');

  if (!email || !productId) {
    return NextResponse.json({ error: 'Missing email or productId' }, { status: 400 });
  }

  try {
    await connectMongoDB();

    // ตรวจสอบการสั่งซื้อ
    const order = await Order.findOne({ email, product: productId });
    
    // ตรวจสอบว่าโครงงานนี้เป็นของผู้ใช้หรือไม่ (เปรียบเทียบ email)
    const project = await Project.findOne({ _id: productId, email });

    // ถ้าเจอทั้งคำสั่งซื้อและผู้ใช้เป็นเจ้าของโครงงาน
    return NextResponse.json({
      hasOrder: !!order, // ถ้าเจอ order จะเป็น true
      projectOwned: !!project // ถ้า project มีอีเมลตรงกับ user จะเป็น true
    });

  } catch (error) {
    console.error('Error checking order or project:', error);
    return NextResponse.json({ error: 'Error checking order or project' }, { status: 500 });
  }
}
