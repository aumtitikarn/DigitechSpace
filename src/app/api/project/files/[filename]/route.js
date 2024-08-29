import { NextResponse } from 'next/server';
import { connectMongoDB } from '../../../../../../lib/mongodb';

export async function GET(req, { params }) {
  const { filename } = params;

  if (!filename) {
    return new NextResponse("Filename is required", { status: 400 });
  }

  try {
    const { filebucket } = await connectMongoDB();
    const files = await filebucket.find({ filename }).toArray();

    if (files.length === 0) {
      return new NextResponse("File not found", { status: 404 });
    }

    const file = files[0];
    const stream = filebucket.openDownloadStreamByName(filename);

    return new NextResponse(stream, {
      headers: {
        'Content-Type': file.contentType || 'application/octet-stream',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error("Error fetching file:", error);
    return new NextResponse(JSON.stringify({ msg: "Error fetching file" }), { status: 500 });
  }
}
