import { connectMongoDB } from "../../../lib/mongodb";
import Adminusers from "../../../models/adnimusers"
import { NextResponse } from "next/server";

export async function POST(req) {
    const { name, email } = await req.json();
    console.log(name, email);
    await connectMongoDB();
    await Adminusers.create({ name, email });
    return NextResponse.json({ message: "Adminusers Test" }, { status: 201 });
}

export async function GET() {
    await connectMongoDB();
    const adminusers = await Adminusers.find({});
    console.log("Fetched Adminusers:", adminusers); // ตรวจสอบข้อมูลที่ได้
    return NextResponse.json({ adminusers });
}

