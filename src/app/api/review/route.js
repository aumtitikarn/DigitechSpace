import { connectMongoDB } from '../../../../lib/mongodb';
import Review from '../../../../models/Review';
import Project from '../../../../models/project';
import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth";
import { authOption } from '../../../app/api/auth/[...nextauth]/route';

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

    // console.log('Fetched reviews:', reviews); // Log the reviews to check if they are fetched

    return NextResponse.json({ message: 'Reviews fetched successfully', data: reviews });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json({ message: 'Failed to fetch reviews', error: error.message }, { status: 500 });
  }
}
