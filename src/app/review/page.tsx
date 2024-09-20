"use client";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { IoIosStar } from "react-icons/io";
import { MdAccountCircle } from "react-icons/md";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useTranslation } from "react-i18next";

// Define types for project data
interface Project {
  _id: string;
  projectname: string;
  description: string;
  receive: string[];
  username: string;
  price: number;
  review: number;
  sold: number;
  rathing: number;
  imageUrl: string[];
  author: string;
}

// ReviewCard Component
const ReviewCard: React.FC<{ project: Project }> = ({ project }) => {
  const { t } = useTranslation("translation");

  return (
    <div className="rounded-[10px] border border-[#BEBEBE] bg-white p-4" style={{ width: "100%", height: "auto" }}>
      <div className="w-full h-full flex flex-col mb-4">
        {project.imageUrl.length > 0 && (
          <img
            src={`/api/project/images/${project.imageUrl[0]}`}
            alt="Product Image"
            className="w-full h-[150px] rounded-md object-cover mb-4"
          />
        )}
        <div className="flex flex-col h-full">
          <p className="text-lg font-semibold mb-2 truncate">{project.projectname}</p>
          <div className="flex mb-2">
            <span className="text-gray-500 mr-2 text-2xl"><MdAccountCircle /></span>
            <p className="text-sm text-gray-600 truncate">{project.author}</p>
          </div>
          <div className="flex mb-2">
            <span className="text-yellow-500 mr-2"><IoIosStar /></span>
            <span className="lg:text-sm text-gray-600 text-[12px] truncate">
              {project.rathing} ({project.review}) | {t("nav.project.projectdetail.sold")} {project.sold}
            </span>
          </div>
          <p className="text-lg font-bold text-[#33529B] mb-2">{project.price} THB</p>
        </div>
      </div>
    </div>
  );
};

// Main Review Component
const Review: React.FC = () => {
  const { data: session } = useSession();
  const { t } = useTranslation("translation");
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReviews = async () => {
      if (!session?.user?.email) {
        setError("User is not logged in");
        setLoading(false);
        return;
      }
  
      setLoading(true);
      setError(null);
  
      try {
        // เรียก API ของ orders
        const response = await fetch(`/api/order?email=${encodeURIComponent(session.user.email)}`, {
          method: "GET",
          cache: "no-store",
        });
  
        if (!response.ok) {
          const errorData = await response.json();
          console.error("Error response from server:", errorData);
          throw new Error("Failed to fetch orders.");
        }
  
        const orders = await response.json(); // ตรวจสอบข้อมูลจาก API
        console.log("Orders fetched from API:", orders); // Log ข้อมูลเพื่อตรวจสอบ
  
        // ตรวจสอบว่ามี `product` ภายใน `orders` หรือไม่
        if (!orders || !orders.product || !Array.isArray(orders.product)) {
          throw new Error("Invalid data structure from server");
        }
  
        const projectIds = orders.product.map((project: any) => project._id); // ตรวจสอบโครงสร้างข้อมูลของ product
        setProjects(projectIds); // Store project IDs in state
      } catch (error) {
        console.error("Error loading reviews:", error);
        setError("Failed to load reviews.");
      } finally {
        setLoading(false);
      }
    };
  
    fetchReviews();
  }, [session?.user?.email]);
  

  return (
    <div className="flex flex-col min-h-screen bg-[#FBFBFB] overflow-hidden">
      <Navbar />
      <main className="flex-grow">
        <div className="lg:mx-64 lg:mt-10 lg:mb-10 mt-10 mb-10 mx-5">
          <h1 className="font-bold mb-4 text-[24px]">{t("nav.review.title")}</h1>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {loading ? (
              <p>{t("loading")}</p>
            ) : error ? (
              <p>{error}</p>
            ) : projects.length > 0 ? (
              projects.map((project) => (
                <Link key={project._id} href={`/review/Reviewproject?id=${project._id}`}>
                  <ReviewCard project={project} />
                </Link>
              ))
            ) : (
              <p>{t("noProjectsFound")}</p>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Review;
