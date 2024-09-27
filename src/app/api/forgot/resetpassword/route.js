import { NextResponse } from 'next/server';
import bcrypt from "bcryptjs";
import { connectMongoDB } from '../../../../../lib/mongodb';
import Studentuser from '../../../../../models/StudentUser';
import Normaluser from '../../../../../models/NormalUser';

export async function POST(request) {
  try {
    const { token, password } = await request.json();
    console.log('Received token:', token);

    await connectMongoDB();

    // ค้นหาผู้ใช้ในทั้งสอง schema

    // ค้นหาผู้ใช้ในทั้งสอง schema
    let user = await Normaluser.findOne({
        resetPasswordToken: token,
        resetPasswordExpires: { $gt: Date.now() }
      });
      console.log("Normaluser search result:", user ? user._id : 'Not found');
  
      if (!user) {
        user = await Studentuser.findOne({
          resetPasswordToken: token,
          resetPasswordExpires: { $gt: Date.now() }
        });
        console.log("Studentuser search result:", user ? user._id : 'Not found');
      }
  
      if (!user) {
        console.log("Token not found in either schema or has expired");
        return NextResponse.json({ message: 'Password reset token is invalid or has expired' }, { status: 400 });
      }
  
      console.log("Found user with valid token:", user._id);

    // ตรวจสอบเวลาหมดอายุ
    console.log('Token expiration:', user.resetPasswordExpires);
    console.log('Current time:', Date.now());

    if (user.resetPasswordExpires < Date.now()) {
      console.log('Token has expired');
      return NextResponse.json({ message: 'Password reset token has expired' }, { status: 400 });
    }

    // Hash รหัสผ่านใหม่และบันทึก
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    console.log('Password reset successful for user:', user._id);

    return NextResponse.json({ message: 'Password has been reset successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error resetting password:', error);
    return NextResponse.json({ message: 'An error occurred while resetting the password' }, { status: 500 });
  }
}