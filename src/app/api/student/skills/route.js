// app/api/student/skills/route.js
import { NextResponse } from 'next/server';
import StudentUser from '../../../../../models/StudentUser';
import { connectMongoDB } from '../../../../../lib/mongodb';

// เพิ่ม skill
export async function POST(request) {
    try {
        await connectMongoDB();
        const { userId, skill } = await request.json();

        const updatedUser = await StudentUser.findByIdAndUpdate(
            userId,
            { $push: { skills: skill } }, // เปลี่ยนจาก skill เป็น skills
            { new: true }
        );

        if (!updatedUser) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            message: 'Skill added successfully',
            skills: updatedUser.skills // เปลี่ยนจาก skill เป็น skills
        });

    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to add skill' },
            { status: 500 }
        );
    }
}

// ลบ skills
export async function DELETE(request) {
    try {
        await connectMongoDB();
        const { userId, skills: skillsToDelete } = await request.json();

        const user = await StudentUser.findById(userId);
        if (!user) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        // ลบ skills ที่เลือก
        user.skills = user.skills.filter(skill => !skillsToDelete.includes(skill)); // เปลี่ยนจาก skill เป็น skills
        await user.save();

        return NextResponse.json({
            message: 'Skills deleted successfully',
            skills: user.skills // เปลี่ยนจาก skill เป็น skills
        });

    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to delete skills' },
            { status: 500 }
        );
    }
}

// GET skills
export async function GET(request) {
    try {
        await connectMongoDB();
        const userId = request.nextUrl.searchParams.get('userId');

        const user = await StudentUser.findById(userId);
        if (!user) {
            return NextResponse.json([]);
        }

        return NextResponse.json(user.skills); // เปลี่ยนจาก skill เป็น skills

    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to fetch skills' },
            { status: 500 }
        );
    }
}