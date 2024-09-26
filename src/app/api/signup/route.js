import { NextResponse } from 'next/server';
import { connectMongoDB } from '../../../../lib/mongodb'; 
import StudentUser from '../../../../models/StudentUser'; 
import NormalUser from '../../../../models/NormalUser'; 
import bcrypt from 'bcryptjs';

export async function POST(req) {
  try {
      const data = await req.json();
      const { firstname, lastname, phonenumber, username, email, password } = data;

      if (!firstname || !lastname || !phonenumber || !username || !email || !password) {
          return NextResponse.json({ message: "All fields are required." }, { status: 400 });
      }
      const lowercaseEmail = email.toLowerCase();

      const hashedPassword = await bcrypt.hash(password, 10);

      await connectMongoDB(); // เชื่อมต่อ MongoDB

      // เลือกโมเดลตามอีเมล
      const UserModel = email.endsWith('@g.sut.ac.th') ? StudentUser : NormalUser;

      const user = new UserModel({
          name: `${firstname} ${lastname}`,
          firstname,
          lastname,
          phonenumber,
          username,
          email: lowercaseEmail,
          password: hashedPassword
      });

      await user.save(); // บันทึกข้อมูลใน MongoDB

      return NextResponse.json({ message: "User registered successfully." }, { status: 201 });

  } catch (error) {
      console.error('Error processing request:', error);
      return NextResponse.json({ message: "An error occurred while registering the user." }, { status: 500 });
  }
}
