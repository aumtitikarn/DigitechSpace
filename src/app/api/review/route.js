import { connectMongoDB } from '../../../../lib/mongodb';
import Review from '../../../../models/Review';
import Project from '../../../../models/project';
import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth";
import { authOption } from '../../../app/api/auth/[...nextauth]/route';
import StudentUser from '../../../../models/StudentUser';
import NormalUser from '../../../../models/NormalUser';

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

export async function GET(req) {
  try {
    await connectMongoDB();
    const reviews = await Review.find().lean();

    const reviewsWithAuthorDetails = await Promise.all(reviews.map(async (review) => {
      let authorName = 'Unknown Author';
      let profileImage = null;

      // ค้นหาข้อมูลผู้ใช้จาก StudentUser
      const studentUser = await StudentUser.findOne({ email: review.userEmail }, 'name imageUrl').lean();
      if (studentUser) {
        authorName = studentUser.name;
        if (studentUser.imageUrl) {
          profileImage = isValidHttpUrl(studentUser.imageUrl)
            ? useProxy(studentUser.imageUrl)
            : `/api/project/images/${studentUser.imageUrl}`;
        }
      } else {
        // ถ้าไม่พบใน StudentUser, ค้นหาใน NormalUser
        const normalUser = await NormalUser.findOne({ email: review.userEmail }, 'name imageUrl').lean();
        if (normalUser) {
          authorName = normalUser.name;
          if (normalUser.imageUrl) {
            profileImage = isValidHttpUrl(normalUser.imageUrl)
              ? useProxy(normalUser.imageUrl)
              : `/api/project/images/${normalUser.imageUrl}`;
          }
        }
      }

      return {
        ...review,
        authorName,
        profileImage
      };
    }));

    return NextResponse.json({ 
      message: 'Reviews fetched successfully', 
      data: reviewsWithAuthorDetails 
    });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json({ message: 'Failed to fetch reviews', error: error.message }, { status: 500 });
  }
}