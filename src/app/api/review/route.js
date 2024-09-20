import { NextResponse } from 'next/server';
import { connectToDatabase } from '../../../utils/mongodb'; // Update with your MongoDB connection utility
import Review from '../../../models/Review'; // Update with your Review model
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../lib/auth'; // Update with your next-auth options

export async function POST(req) {
  // Fetch the user session
  const session = await getServerSession(authOptions);

  // Extract the user email from the session
  const userEmail = session?.user?.email;

  // Parse the request body
  const { rating, review, projectId } = await req.json();

  // Check for missing data
  if (!rating || !review || !projectId || !userEmail) {
    return NextResponse.json({ message: 'Missing data' }, { status: 400 });
  }

  try {
    await connectToDatabase(); // Ensure you have a function to connect to your MongoDB database

    // Create and save the new review
    const newReview = new Review({
      rating,
      review,
      projectId,
      userEmail, // Use the actual user email from the session
    });

    await newReview.save();
    return NextResponse.json({ message: 'Review saved successfully' });
  } catch (error) {
    console.error('Error saving review:', error);
    return NextResponse.json({ message: 'Failed to save review' }, { status: 500 });
  }
}
