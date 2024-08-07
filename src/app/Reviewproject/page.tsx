'use client';

import React, { useState } from 'react';
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import Container from "../components/Container"


interface ReviewProject {
  project: string;
}

const ProjectReview: React.FC<ReviewProject> = ({ project }) => {
  const [rating, setRating] = useState<number>(0);
  const [review, setReview] = useState("");

  const handleRatingChange = (newRating: number) => {
    setRating(newRating);
  };

  const handleReviewChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setReview(event.target.value);
  };

  const handleSubmit = () => {
    // Handle submit logic here
    console.log("Rating:", rating);
    console.log("Review:", review);
  };
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  if (!session) {
    redirect("/auth/signin");
    return null;
  }

  return (
    <Container>
      <Navbar session={session} />
      <main className="flex-grow px-6 py-12 lg:px-8">
      <div className="container mx-auto mt-5">
        <h1 className="text-3xl md:text-4xl font-bold mb-8  border-b border-gray-500">Review Project</h1>
          <p className="text-lg font-medium mb-4">Project: Facebook Website</p>
          <p className="text-lg font-medium mb-2">Point:</p>
          <div className="flex justify-left mb-4">
            {[...Array(5)].map((_, i) => (
              <span
                key={i}
                onClick={() => handleRatingChange(i + 1)}
                className={`text-2xl cursor-pointer ${
                  rating >= i + 1 ? 'text-orange-400' : 'text-gray-400'
                }`}
              >
                ★
              </span>
            ))}
          </div>
          <div className="relative ">
            <textarea
              placeholder="text"
              value={review}
              onChange={handleReviewChange}
              className="w-full h-40 p-3 border-2 border-gray-300 rounded-md mb-5 "
            />
            <button 
              onClick={handleSubmit}
              className="absolute bottom-10 right-2  bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors text-lg font-medium"
            >
              Review
            </button>
          </div>
        </div> 
      </main>
      <Footer />
    </Container>
  );
};

export default ProjectReview;
