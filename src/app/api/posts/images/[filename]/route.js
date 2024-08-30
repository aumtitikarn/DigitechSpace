import { NextResponse } from 'next/server';
import { connectMongoDB } from '../../../../../../lib/mongodb'


export async function GET(req, { params }) {
  const { filename } = params;
    try {
    const { imgbucket } = await connectMongoDB();
    const files = await imgbucket.find({ filename }).toArray();

    if (files.length === 0) {
      return new NextResponse("File not found", { status: 404 });
    }

    const file = files[0];
    const stream = imgbucket.openDownloadStreamByName(file.filename);

    return new NextResponse(stream, {
      headers: { "Content-Type": file.contentType },
    });
  } catch (error) {
    console.error("Error fetching image:", error);
    return NextResponse.json({ msg: "Error fetching image" }, { status: 500 });
  }
}
