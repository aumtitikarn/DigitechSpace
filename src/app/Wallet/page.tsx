import { connectMongoDB } from '../../../../lib/mongodb';
import Review from '../../../../models/Review';
import Project from '../../../../models/project';
import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth";
import { authOption } from '../../../app/api/auth/[...nextauth]/route';
import StudentUser from '../../../../models/StudentUser';
import NormalUser from '../../../../models/NormalUser';

const isValidHttpUrl = (string) => {
  let url;
  try {
    url = new URL(string);
  } catch (_) {
    return false;
  }
  return url.protocol === "http:" || url.protocol === "https:";
};

const useProxy = (url) => `/api/proxy?url=${encodeURIComponent(url)}`;

export async function POST(req) {
  const session = await getServerSession(authOption);

  // Handle unauthorized access
  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const username = session.user?.name;
  const userEmail = session.user?.email;

  try {
    await connectMongoDB();
    const data = await req.json();

    console.log("Received data:", JSON.stringify(data, null, 2));

    const { rathing, review, projectId } = data;

    // Check for missing required fields
    if (!rathing || !review || !projectId || !userEmail || !username) {
      return NextResponse.json({ message: 'Missing data' }, { status: 400 });
    }

    // Create a new review
    const newReview = new Review({
      rathing,
      review,
      projectId,
      userEmail,
      username,
    });

    await newReview.save();

    // Update the corresponding project with the new review ID
    const project = await Project.findById(projectId);


    if (!project) {
      return NextResponse.json({ message: 'Project not found' }, { status: 404 });
    }

    // Calculate new average rating
    const reviews = await Review.find({ projectId }); // Fetch all reviews for the project
    const totalRathing = reviews.reduce((sum, r) => sum + r.rathing, 0) + rathing; // Add the new rating
    const newReviewCount = reviews.length ; // Increment the review count

    const newAverageRating =Math.min(totalRathing / newReviewCount, 5); // Calculate new average rating

    await Project.findByIdAndUpdate(
      projectId,
      {
        $push: { reviews: newReview._id }, // Add review ID to the project's reviews array
        rathingTotal: totalRathing, // Update the total rathing
        review: newReviewCount, // Update the review count
        rathing: parseFloat(newAverageRating.toFixed(1)), // Update average rating with one decimal place
      },
      { new: true }
    );

    return NextResponse.json({ message: 'Review saved successfully and added to project' });
  } catch (error) {
    console.error('Error saving review or updating project:', error);
    return NextResponse.json({ message: 'Failed to save review or update project', error: error.message }, { status: 500 });
  }
}

export async function GET(req) {
  try {
    await connectMongoDB(); // เชื่อมต่อกับ MongoDB
    const reviews = await Review.find(); // ดึงข้อมูลทั้งหมดจากฐานข้อมูล

    // ดึงข้อมูลผู้ใช้สำหรับแต่ละรีวิว
    const reviewsWithAuthorDetails = await Promise.all(reviews.map(async (review) => {
      const student = await StudentUser.findOne({ userEmail: review.userEmail }, 'name imageUrl').lean();
      const normal = await NormalUser.findOne({ userEmail: review.userEmail }, 'name imageUrl').lean();
      
      let authorName = 'Unknown Author';
      let profileImage = null;

      if (student) {
        authorName = student.name;
        if (student.imageUrl) {
          profileImage = isValidHttpUrl(student.imageUrl)
            ? useProxy(student.imageUrl)
            : `/api/project/images/${student.imageUrl}`;
        }
      } else if (normal) {
        authorName = normal.name;
        if (normal.imageUrl) {
          profileImage = isValidHttpUrl(normal.imageUrl)
            ? useProxy(normal.imageUrl)
            : `/api/project/images/${normal.imageUrl}`;
        }
      }

      return {
        ...review.toObject(),
        authorName,
        profileImage
      };
    }));

    return NextResponse.json(reviewsWithAuthorDetails, {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json({ message: 'Failed to fetch reviews', error: error.message }, { status: 500 });
  }
}
