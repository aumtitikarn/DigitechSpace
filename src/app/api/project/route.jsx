import { NextResponse } from 'next/server';
import { Readable } from 'stream';
import { connectMongoDB } from '../../../../lib/mongodb';
import Project from '../../../../models/project';

export const revalidate = 0;

export async function POST(req, res) {
  try {
    const { client, bucket } = await connectMongoDB();
    const formData = await req.formData();
    
    // Initialize variables
    let projectname = '';
    let description = '';
    let receive = [];
    let category = '';
    let imageUrl = [];

    for (const [key, value] of formData.entries()) {
      switch(key) {
        case 'projectname':
          projectname = value.toString();
          break;
        case 'description':
          description = value.toString();
          break;
        case 'receive':
          receive = JSON.parse(value.toString());
          break;
        case 'category':
          category = value.toString();
          break;
        case 'imageUrl':
          if (value instanceof Blob) {
            const image = `${Date.now()}_${value.name}`;
            const buffer = Buffer.from(await value.arrayBuffer());
            const stream = Readable.from(buffer);
            const uploadStream = bucket.openUploadStream(image);
            await new Promise((resolve, reject) => {
              stream.pipe(uploadStream)
                .on('finish', resolve)
                .on('error', reject);
            });
            imageUrl.push(image);
          }
          break;
      }
    }
  
    if (!projectname || !description || !category) {
      throw new Error('Missing required fields');
    }


    const newItem = new Project({
      imageUrl,
      projectname,
      description,
      receive,
      category,
    });

    // Save the project
    await newItem.save();

    return NextResponse.json({ msg: "Project created successfully" }, { status: 201 });
  } catch (error) {
    console.error("Error in POST handler:", error);
    return NextResponse.json({ msg: "Error creating project" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const { client, bucket } = await connectMongoDB();
    const posts = await Project.find({});
    return NextResponse.json({ posts });
  } catch (error) {
    console.error("Error in GET handler:", error);
    return NextResponse.json({ msg: "Error fetching projects" }, { status: 500 });
  }
}
