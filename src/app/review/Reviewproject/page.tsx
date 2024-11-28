'use client'
import React, { useEffect, useState, Suspense } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from 'next/navigation';
import { useTranslation } from "react-i18next";
import { Star, Send } from "lucide-react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { OrbitProgress } from "react-loading-indicators";
import Swal from "sweetalert2";

const LoadingSpinner = () => (
  <div className="flex justify-center items-center h-screen">
    <OrbitProgress variant="track-disc" dense color="#33539B" size="medium" />
  </div>
);

const ProjectReview = () => {
  const [rating, setRating] = useState(0);
  const { data: session, status } = useSession();
  const [hoverRating, setHoverRating] = useState(0);
  const [review, setReview] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const { t } = useTranslation("translation");
  const router = useRouter();
  const searchParams = useSearchParams();
  const projectId = searchParams.get("id");
  const name = searchParams.get("name");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [status, router]);

  const handleRatingChange = (newRating: number) => {
    setRating(newRating);
  };

  const handleReviewChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setReview(event.target.value);
  };

  const handleSubmit = async () => {
    if (!session) {
      Swal.fire({
        icon: "error",
        title: t("status.error"),
        text: t("status.login"),
      });
      return;
    }

    const username = session.user?.name || session.user?.email;

    if (!rating || !review || !projectId || !username) {
      Swal.fire({
        icon: "warning",
        title: t("status.nodata"),
        text: t("status.ensure"),
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/review', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          rathing: rating,
          review,
          projectId,
          username,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }

      await response.json();
      await Swal.fire({
        icon: "success",
        title: t("status.success"),
        showConfirmButton: false,
        timer: 1500,
      });

      setIsNavigating(true);
      setTimeout(() => {
        router.push(`/project/projectdetail/${projectId}`);
      }, 1000);
    } catch (error) {
      console.error("Error submitting review:", error);
      Swal.fire({
        icon: "error",
        text: error instanceof Error ? error.message : "Error submitting your review.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };


    if (status === "loading") {
      return (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            textAlign: "center",
          }}
        >
          <OrbitProgress
            variant="track-disc"
            dense
            color="#33539B"
            size="medium"
            text=""
            textColor=""
          />
        </div>
      );
    }


  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg p-8">
          <div className="space-y-6">
            <div className="border-b border-gray-200 pb-6">
              <h1 className="text-4xl font-bold text-gray-800 mb-2">
                {t("nav.review.topic")}
              </h1>
              <p className="text-lg text-gray-600">
                {t("nav.review.project")}: <span className="font-semibold text-blue-600">{name || ""}</span>
              </p>
            </div>

            <div className="space-y-4">
              <label className="block text-lg font-medium text-gray-700">
                {t("nav.review.point")}
              </label>
              <div className="flex gap-2">
                {[...Array(5)].map((_, i) => (
                  <button
                    key={i}
                    onMouseEnter={() => setHoverRating(i + 1)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => handleRatingChange(i + 1)}
                    className="transition-transform hover:scale-110 focus:outline-none"
                  >
                    <Star
                      size={32}
                      className={`${
                        (hoverRating || rating) > i
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      } transition-colors`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <label className="block text-lg font-medium text-gray-700">
                {t("nav.review.text")}
              </label>
              <div className="relative">
                <textarea
                  value={review}
                  onChange={handleReviewChange}
                  className="w-full h-48 p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                  placeholder={t("nav.review.text")}
                />
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="absolute bottom-4 right-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="font-medium">{t("nav.review.title")}</span>
                  <Send size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
      {(isSubmitting || isNavigating)}
    </div>
  );
};

const ProjectReviewPage = () => {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <ProjectReview />
    </Suspense>
  );
};

export default ProjectReviewPage;