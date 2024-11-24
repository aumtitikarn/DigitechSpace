import { connectMongoDB } from "../../../../lib/mongodb";
import PostBlog from "../../../../models/blogreport";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    await connectMongoDB();
    const data = await req.json();

    console.log("Received data:", data); // For debugging

    const { blogname, report, selectedReason, author, blogid, blogEmail } = data;

    // Validate required fields
    if (!report || !selectedReason || !author) {
      return NextResponse.json(
        { 
          error: "กรุณากรอกข้อมูลให้ครบถ้วน",
          details: {
            report: !report ? "กรุณากรอกรายละเอียด" : null,
            selectedReason: !selectedReason ? "กรุณาเลือกเหตุผล" : null,
            author: !author ? "ไม่พบข้อมูลผู้รายงาน" : null
          }
        },
        { status: 400 }
      );
    }

    // Create new report
    const newItem = new PostBlog({
      blogname,
      report,
      selectedReason,
      author,
      blogid,
      blogEmail,
      createdAt: new Date()
    });

    const savedProject = await newItem.save();

    return NextResponse.json(
      { 
        message: "รายงานถูกสร้างเรียบร้อยแล้ว",
        reportId: savedProject._id 
      },
      { status: 201 }
    );

  } catch (error) {
    console.error("Error in POST handler:", error);

    // Handle validation errors
    if (error.name === 'ValidationError') {
      return NextResponse.json(
        { 
          error: "ข้อมูลไม่ถูกต้อง",
          details: error.message
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { 
        error: "เกิดข้อผิดพลาดในการสร้างรายงาน",
        details: error.message 
      },
      { status: 500 }
    );
  }
}

