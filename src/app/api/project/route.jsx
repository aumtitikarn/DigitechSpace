import { NextResponse } from "next/server";
import { Readable } from "stream";
import { connectMongoDB } from "../../../../lib/mongodb";
import Project from "../../../../models/project";
import StudentUser from "../../../../models/StudentUser";

export const revalidate = 0;

export async function POST(req, res) {
  try {
    const { client, imgbucket, filebucket } = await connectMongoDB();
    const formData = await req.formData();

    // Initialize variables
    let projectname = "";
    let description = "";
    let receive = [];
    let skill = [];
    let category = "";
    let price = "";
    let imageUrl = [];
    let email = "";
    let iduser = "";
    let permission = false;
    let filesUrl = [];
    let rathing = 0.0;
    let sold = 0;
    let review = 0;
    let status = "pending";

    for (const [key, value] of formData.entries()) {
      switch (key) {
        case "projectname":
          projectname = value.toString();
          break;
        case "description":
          description = value.toString();
          break;
        case "receive":
          receive = JSON.parse(value.toString());
          break;
        case "skill":
          skill = JSON.parse(value.toString());
          break;
        case "category":
          category = value.toString();
          break;
        case "price":
          price = parseInt(value, 10);
          break;
        case "email":
          email = value.toString();
          break;
        case "iduser":
          iduser = value.toString();
          break;
        case "rathing":
          rathing = parseFloat(value);
          break;
        case "sold":
          sold = parseInt(value, 10);
          break;
        case "review":
          sold = parseInt(value, 10);
          break;
        case "permission":
          permission = value === "true"; // Convert value to Boolean
          break;
        case "status":
          status = value.toString();
          break;
        case "imageUrl":
          if (value instanceof Blob) {
            const image = `${Date.now()}_${value.name}`;
            const buffer = Buffer.from(await value.arrayBuffer());
            const stream = Readable.from(buffer);
            const uploadStream = imgbucket.openUploadStream(image);
            await new Promise((resolve, reject) => {
              stream
                .pipe(uploadStream)
                .on("finish", resolve)
                .on("error", reject);
            });
            imageUrl.push(image);
          }
          break;
        case "filesUrl":
          if (value instanceof Blob) {
            const files = `${value.name}`;
            const buffer = Buffer.from(await value.arrayBuffer());
            const stream = Readable.from(buffer);
            const uploadStream = filebucket.openUploadStream(files);
            await new Promise((resolve, reject) => {
              stream
                .pipe(uploadStream)
                .on("finish", resolve)
                .on("error", reject);
            });
            filesUrl.push(files);
          }
          break;
      }
    }

    if (!projectname || !description || !category || !imageUrl || !filesUrl) {
      throw new Error("Missing required fields");
    }

    const newItem = new Project({
      imageUrl,
      projectname,
      description,
      receive,
      skill,
      category,
      price,
      email,
      iduser,
      permission,
      status,
      filesUrl,
      review,
      sold,
    });

    // Save the project
    const savedProject = await newItem.save(); // Save and get the saved document
    if (iduser && skill.length > 0) {
      // Get existing user skills
      const user = await StudentUser.findById(iduser);
      if (user) {
        // Filter out duplicate skills
        const newSkills = skill.filter(newSkill => 
          !user.skills?.some(existingSkill => 
            existingSkill.toLowerCase() === newSkill.toLowerCase()
          )
        );
    
        if (newSkills.length > 0) {
          await StudentUser.findByIdAndUpdate(
            iduser,
            { $addToSet: { skills: { $each: newSkills } } },
            { new: true }
          );
        }
      }
    }
    return NextResponse.json(
      {
        _id: savedProject._id,
        msg: "Project created successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error in POST handler:", error);
    return NextResponse.json(
      { msg: "Error creating project" },
      { status: 500 }
    );
  }
}
