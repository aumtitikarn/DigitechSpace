import { Readable } from "stream";
import { connectMongoDB } from "../../../../../lib/mongodb";
import NormalUser from "../../../../../models/NormalUser";
import { NextResponse } from "next/server";

export async function PUT(req, { params }) {
    try {
      const { id } = params; // Get the user ID from params
      const { imgbucket } = await connectMongoDB(); // Connect MongoDB and get GridFS bucket
      const formData = await req.formData(); // Retrieve form data
  
      let name = "";
      let email = "";
      let line = "";
      let facebook = "";
      let phonenumber = "";
      let imageUrl = [];
  
      // Iterate over form data and handle each field
      for (const [key, value] of formData.entries()) {
        switch (key) {
          case "name":
            name = value.toString();
            break;
          case "email":
            email = value.toString();
            break;
            case "line":
            line = value.toString();
            break;
            case "facebook":
            facebook = value.toString();
            break;
            case "phonenumber":
            phonenumber = value.toString();
            break;
          case "imageUrl":
            if (value instanceof Blob) {
              // If the value is a Blob (file), process and upload to GridFS
              const imageName = `${Date.now()}_${value.name}`;
              const buffer = Buffer.from(await value.arrayBuffer());
              const stream = Readable.from(buffer);
              const uploadStream = imgbucket.openUploadStream(imageName);
              await new Promise((resolve, reject) => {
                stream.pipe(uploadStream).on("finish", resolve).on("error", reject);
              });
              imageUrl.push(imageName); // Store image URL for the user
            }
            break;
        }
      }
  
      // Update the user profile with new name, email, and imageUrl
      const updatedUser = await NormalUser.findByIdAndUpdate(
        id,
        { name, email, imageUrl, line, facebook, phonenumber },
        { new: true }
      );
  
      if (!updatedUser) {
        return NextResponse.json({ message: 'User not found' }, { status: 404 });
      }
  
      return NextResponse.json({ user: updatedUser }, { status: 200 });
    } catch (error) {
      console.error('Error updating user:', error);
      return NextResponse.json({ message: 'Error updating user' }, { status: 500 });
    }
}
