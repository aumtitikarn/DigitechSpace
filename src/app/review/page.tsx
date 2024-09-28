"use client";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { IoIosStar } from "react-icons/io";
import { MdAccountCircle } from "react-icons/md";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";

// Define types for project data
interface Project {
  _id: string;
  product: string;
  status: string;
  createdAt: string;
  projectDetails: {
    _id: string;
    projectname: string;
    description: string;
    price: number;
    author: string;
    email: string;
    receive: string[];
    permission: boolean;
    rathing: number;
    sold: number;
    review: number;
    category: string;
    imageUrl: string[];
    filesUrl: string[];
    status: string;
  };
}

// Main Review Component
const Review: React.FC = () => {
  const { data: session, status } = useSession();
  const { t } = useTranslation("translation");
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
    const fetchProjects = async () => {
      try {
        const response = await fetch("/api/myproject");
        if (!response.ok) {
          throw new Error("Failed to fetch projects");
        }
        const data = await response.json();
        console.log("Fetched projects:", data);
        setProjects(data);
      } catch (error) {
        console.error("Error fetching projects:", error);
        
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [status, router]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="flex flex-col min-h-screen bg-[#FBFBFB] overflow-hidden">
      <Navbar />
      <main className="flex-grow">
        <div className="lg:mx-64 lg:mt-10 lg:mb-10 mt-10 mb-10 mx-5">
          <h1 className="font-bold mb-4 text-[24px]">{t("nav.review.title")}</h1>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {projects.map((project) => (
             <Link href={`/review/Reviewproject?id=${project.projectDetails._id}&name=${encodeURIComponent(project.projectDetails.projectname)}`} key={project._id}>

                <div className="relative rounded-[10px] border border-[#BEBEBE] bg-white p-4">
                  <div className="w-auto h-auto flex flex-col">
                    {project.projectDetails.imageUrl.length > 0 ? (
                      <img
                        src={`/api/project/images/${project.projectDetails.imageUrl[0]}`}
                        alt="Product Image"
                        className="w-full h-[150px] rounded-md object-cover mb-4"
                      />
                    ) : (
                      <div className="w-full h-[150px] bg-gray-200 rounded-md mb-4 flex items-center justify-center">
                        <p>No Image Available</p>
                      </div>
                    )}
                    <div className="flex flex-col h-full">
                      <p className="text-lg font-semibold mb-2 truncate">
                        {project.projectDetails.projectname}
                      </p>
                      <div className="flex items-center mb-2">
                        <span className="text-gray-500 mr-2 text-2xl">
                          <MdAccountCircle />
                        </span>
                        <p className="text-sm text-gray-600 truncate">
                          {project.projectDetails.author}
                        </p>
                      </div>
                      <div className="flex items-center mb-2">
                        <span className="text-yellow-500 mr-2 text-lg">
                          <IoIosStar />
                        </span>
                        <span className="text-gray-600 text-xs lg:text-sm truncate">
                          {project.projectDetails.rathing || "N/A"} (
                          {project.projectDetails.review}) |{" "}
                          {t("nav.project.projectdetail.sold")}{" "}
                          {project.projectDetails.sold}
                        </span>
                      </div>
                      <p className="text-lg font-bold text-[#33529B]">
                        {project.projectDetails.price} THB
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Review;
