import { connectMongoDB } from '../../../../lib/mongodb';
import StudentUser from '../../../../models/StudentUser';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    // เชื่อมต่อกับ MongoDB
    await connectMongoDB();
    console.log('Connected to MongoDB');

    // รับ session ของผู้ใช้
    const session = await getServerSession();
    console.log('Session:', session);

    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // รับข้อมูลจาก body ของ request
    const data = await req.json();
    console.log('Request Data:', data);

    const {
      fullname,
      phonenumber,
      nationalid,
      namebank,
      numberbankacc,
      housenum,
      subdistrict,
      district,
      province,
      postalnumber,
    } = data;

    // อัปเดตข้อมูล SellInfo ในเอกสารของผู้ใช้ปัจจุบันโดยไม่ลบข้อมูลเดิม
    const updatedUser = await StudentUser.findOneAndUpdate(
      { email: session.user.email },
      {
        $set: {
          'SellInfo.fullname': fullname,
          'SellInfo.phonenumber': phonenumber,
          'SellInfo.nationalid': nationalid,
          'SellInfo.namebank': namebank,
          'SellInfo.numberbankacc': numberbankacc,
          'SellInfo.housenum': housenum,
          'SellInfo.subdistrict': subdistrict,
          'SellInfo.district': district,
          'SellInfo.province': province,
          'SellInfo.postalnumber': postalnumber,
        },
      },
      { new: true }
    );
    console.log('Updated User:', updatedUser);

    return NextResponse.json(
      { message: 'SellInfo saved successfully', user: updatedUser },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error saving SellInfo:', error);
    return NextResponse.json(
      { message: 'Error saving SellInfo', error: error.message },
      { status: 500 }
    );
  }
}
