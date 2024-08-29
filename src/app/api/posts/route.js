import { connectMongoDB } from "../../../../lib/mongodb";
import Post from "../../../../models/post"
import { NextResponse } from "next/server"
import { Readable } from "stream";

export const revalidate = 0;

export async function POST(req) {
    const { topic, course, description, heart } = await req.json();
    console.log(topic, course, description, heart, file)
    await connectMongoDB();

    //   const newItem = new Posts({ name: "hloe", imageUrl: "image" });
    //   await newItem.save();
    let name;
    let image;
    const formData = await req.formData();
    for (const entries of Array.from(formData.entries())) {
        const [key, value] = entries;
        if (key == "name") {
            name = value;
        }

        if (typeof value == "object") {
            image = Date.now() + value.name;
            console.log("done");
            const buffer = Buffer.from(await value.arrayBuffer());
            const stream = Readable.from(buffer);
            const uploadStream = bucket.openUploadStream(image, {});
            await stream.pipe(uploadStream);
        }
    }
    const newItem = Post({
        name,
        imageUrl: image,
    });
    await newItem.save();

    await Post.create({ topic, course, description, heart, newItem});
    return NextResponse.json({ message: "Post test" }, { status: 201 });

}

export async function GET() {
    await connectMongoDB();
    const posts = await Post.find({});
    return NextResponse.json({ posts });
}