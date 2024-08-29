import { connectMongoDB } from "../../../../../lib/mongodb";
import { NextResponse } from "next/server";
import StudentUser from '../../../../models/StudentUser'; 
import NormalUser from '../../../../../models/NormalUser'; 
import bcrypt from 'bcryptjs';

export async function GET(req, { params }) {
    const { id } = params;
    await connectMongoDB();
    const post = await NormalUser.findOne({ _id: id });
    return NextResponse.json({ post }, { status: 200 });
}

export async function PUT(req, { params }) {
    const { id } = params;
    const { setheart: heart } = await req.json();
    await connectMongoDB();
    await NormalUser.findByIdAndUpdate(id, { heart });
    return NextResponse.json({ message: "Post updated" }, { status: 200 });
}