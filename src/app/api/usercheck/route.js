import { NextResponse } from 'next/server';
import { connectMongoDB } from '../../../../lib/mongodb';
import StudentUser from '../../../../models/StudentUser';
import NormalUser from '../../../../models/NormalUser';

export async function POST(req) {
    try {
        await connectMongoDB();
        const { email, username } = await req.json();

        // Check for the email and username in StudentUser collection
        const studentUserEmail = await StudentUser.findOne({ email }).select("_id");
        const studentUserUsername = await StudentUser.findOne({ username }).select("_id");

        // Check for the email and username in NormalUser collection
        const normalUserEmail = await NormalUser.findOne({ email }).select("_id");
        const normalUserUsername = await NormalUser.findOne({ username }).select("_id");

        const response = {
            emailExists: !!(studentUserEmail || normalUserEmail),
            usernameExists: !!(studentUserUsername || normalUserUsername)
        };

        return NextResponse.json(response, { status: 200 });
    } catch(error) {
        console.error("Error:", error);
        return NextResponse.json({ message: "An error occurred while checking user information." }, { status: 500 });
    }
}