'use client';

import React, { useState } from 'react';
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { useSession } from "next-auth/react";
import { useRouter } from 'next/navigation';
import { useTranslation } from "react-i18next";
import { OrbitProgress } from "react-loading-indicators";

interface ReviewProject {
  project: string; // Assuming this is the project ID
}

const ProjectReview: React.FC<ReviewProject> = ({ project }) => {
  const [rating, setRating] = useState<number>(0);
  const [review, setReview] = useState("");
  const { t } = useTranslation("translation");
  const router = useRouter();
  const { data: session, status } = useSession();

  const handleRatingChange = (newRating: number) => {
    setRating(newRating);
  };

  const handleReviewChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setReview(event.target.value);
  };

  const handleSubmit = async () => {
    if (!rating || !review) {
      alert("Please provide both a rating and a review.");
      return;
    }

    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          rating,
          review,
          projectId: project, // Use the project ID passed as a prop
        }),
      });

      const data = await response.json();
      if (response.ok) {
        alert(data.message);
        router.push('/project'); // Navigate after submission
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('Failed to submit review.');
    }
  };

  if (status === "loading") {
    return (
      <div style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        textAlign: "center",
      }}>
        <OrbitProgress variant="track-disc" dense color="#33539B" size="medium" text="" textColor="" />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#FBFBFB]">
      <main className="flex-grow">
        <Navbar />
        <div className="lg:mx-64 lg:mt-10 lg:mb-10 mt-10 mb-10 mx-5">
          <h1 className="text-3xl md:text-4xl font-bold mb-6">{t("nav.review.topic")}</h1>
          <div className="border-b border-gray-500 my-4 lg:max-w-[950px]"></div>
          <p className="text-lg font-medium mb-4">{t("nav.review.project")} : Facebook Website</p>
          <p className="text-lg font-medium mb-2">{t("nav.review.point")}:</p>
          <div className="flex justify-left mb-4">
            {[...Array(5)].map((_, i) => (
              <span
                key={i}
                onClick={() => handleRatingChange(i + 1)}
                className={`text-2xl cursor-pointer ${rating >= i + 1 ? 'text-orange-400' : 'text-gray-400'}`}
              >
                ★
              </span>
            ))}
          </div>
          <div className="relative mx-auto w-full lg:max-w-[950px] lg:ml-1">
            <textarea
              placeholder="text"
              value={review}
              onChange={handleReviewChange}
              className="w-full h-40 p-3 border-2 border-gray-300 rounded-md mb-5"
            />
            <button
              onClick={handleSubmit}
              className="absolute bottom-10 right-2 bg-[#33539B] text-white py-2 px-4 rounded-md hover:bg-slate-200 transition-colors text-lg font-medium"
            >
              {t("nav.review.title")}
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProjectReview;
