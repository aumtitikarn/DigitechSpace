import { NextResponse } from 'next/server';
import { connectMongoDB } from '../../../../lib/mongodb';
import StudentUser from '../../../../models/StudentUser';
import NormalUser from '../../../../models/NormalUser';

export async function POST(req) {
    try {
        await connectMongoDB();
        const { email } = await req.json();

        // Check for the email in StudentUser collection
        const studentUser = await StudentUser.findOne({ email }).select("_id");

        // Check for the email in NormalUser collection
        const normalUser = await NormalUser.findOne({ email }).select("_id");

        // If the email exists in either collection, return a conflict response
        if (studentUser || normalUser) {
            return NextResponse.json({ message: 'Email already exists' }, { status: 409 });
        }

        // If email not found in any collection, return success response
        return NextResponse.json({ message: "Email is available." }, { status: 200 });

    } catch(error) {
        console.error("Error:", error);
        return NextResponse.json({ message: "An error occurred while checking the email." }, { status: 500 });
    }
}