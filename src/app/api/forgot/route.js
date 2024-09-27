import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { connectMongoDB } from "../../../../lib/mongodb";
import Studentuser from "../../../../models/StudentUser";
import Normaluser from "../../../../models/NormalUser";
import crypto from 'crypto';

export async function POST(request) {
  try {
    const { email } = await request.json();
    console.log("Received reset password request for email:", email);

    await connectMongoDB();

    // ค้นหาผู้ใช้
    let user = await Normaluser.findOne({ email });
    if (!user) {
      user = await Studentuser.findOne({ email });
    }

    if (!user) {
      console.log("User not found for email:", email);
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    console.log("User found:", user._id);

    // กำหนดค่า userName
    const userName = user.name || user.firstname || "User"; // ใช้ชื่อผู้ใช้, ชื่อจริง, หรือ "User" ถ้าไม่มีทั้งสองอย่าง

    // สร้าง resetToken
    const resetToken = crypto.randomBytes(20).toString("hex");
    const resetPasswordExpires = Date.now() + 3600000; // หมดอายุใน 1 ชั่วโมง

    console.log("Created reset token:", resetToken);
    console.log("Token expires at:", new Date(resetPasswordExpires));

    // บันทึก token ลงในฐานข้อมูล
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = resetPasswordExpires;
    try {
      await user.save();
      console.log("Token saved for user:", user._id);
      console.log("Updated user object:", JSON.stringify(user, null, 2));
    } catch (saveError) {
      console.error("Error saving token:", saveError);
      throw saveError;
    }

    console.log("Token saved for user:", user._id);

    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
    const resetUrl = `${baseUrl}/auth/forgot/changePass?token=${resetToken}`;

    // ตั้งค่า transporter
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    // HTML template for the email
    const htmlContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Password Reset Request</title>
        <style>
          body { 
            font-family: Arial, sans-serif; 
            line-height: 1.6; 
            color: #000000;
          }
          .container { 
            max-width: 600px; 
            margin: 0 auto; 
            padding: 20px; 
          }
          .logo { 
            text-align: center; 
            margin-bottom: 20px; 
          }
          .button { 
            display: inline-block; 
            padding: 10px 20px; 
            background-color: #33539B; 
            color: #ffffff !important;
            text-decoration: none; 
            border-radius: 5px; 
            font-weight: bold; 
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="logo">
            <img src="https://m1r.ai/7ttM.png" alt="Digitech Space Logo" width="150">
          </div>
          <h2>Password Reset Request</h2>
          <p>Dear ${userName},</p>
          <p>We have received a request to reset the password for your Digitech Space account. If you did not make this request, please ignore this email.</p>
          <p>To reset your password, please click the button below:</p>
          <p style="text-align: center;">
            <a href="${resetUrl}" class="button">Reset Password</a>
          </p>
          <p>If the button above doesn't work, you can also copy and paste the following link into your browser:</p>
          <p>${resetUrl}</p>
          <p>This link will expire in 1 hour for security reasons.</p>
          <p>If you need any assistance, please don't hesitate to contact our support team.</p>
          <p>Best regards,<br>The Digitech Space Team</p>
        </div>
      </body>
      </html>
    `;

    let info = await transporter.sendMail({
      from: '"Digitech Space" <digitechspace65@gmail.com>',
      to: email,
      subject: "Password Reset Request - Digitech Space",
      text: `Dear ${userName},\n\nWe have received a request to reset the password for your Digitech Space account. If you did not make this request, please ignore this email.\n\nTo reset your password, please visit the following link: ${resetUrl}\n\nThis link will expire in 1 hour for security reasons.\n\nIf you need any assistance, please don't hesitate to contact our support team.\n\nBest regards,\nThe Digitech Space Team`,
      html: htmlContent,
    });

    console.log("Message sent: %s", info.messageId);

    return NextResponse.json(
      { message: "Password reset email sent successfully." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error sending email:", error);
    return NextResponse.json(
      { message: "An error occurred while sending the password reset email." },
      { status: 500 }
    );
  }
}
