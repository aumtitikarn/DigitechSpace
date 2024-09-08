import { connectMongoDB } from "../../../../lib/mongodb";
import Reportprojets from "../../../../models/Reportprojets";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    await connectMongoDB();
    const data = await req.json();
    
    console.log("Received data:", data); // Log received data to check its correctness

    const { name, report, more, username } = data;

    if (!report || !more || !username || !name) {
      throw new Error("Missing required fields");
    }

    const newItem = new Reportprojets({
      name,
      report,
      more,
      username,
    });

    await newItem.save();

    return NextResponse.json({ message: "Post created" }, { status: 201 });
  } catch (error) {
    console.error("Error in POST handler:", error.message);
    return NextResponse.json(
      { msg: "Error creating post", error: error.message },
      { status: 500 }
    );
  }
}
