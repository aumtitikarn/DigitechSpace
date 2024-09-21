import { connectMongoDB } from "../../../../lib/mongodb";
import Reportprojets from "../../../../models/Reportprojets";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    await connectMongoDB();
    const data = await req.json();
    
    console.log("Received data:", data); // Log received data to check its correctness

    const { name, projectId, email, report, more, username, author  } = data;

    if (!name || !projectId || !email || !report || !more || !username || !author) {
      throw new Error("Missing required fields");
    }

    const newItem = new Reportprojets({
      name,
       projectId,
        email, 
        report,
         more,
          username,
           author
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
