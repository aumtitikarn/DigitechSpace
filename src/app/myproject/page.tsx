"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { IoIosStar } from "react-icons/io";
import { MdAccountCircle } from "react-icons/md";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useSession } from "next-auth/react";
import Container from "../components/Container";
import { useTranslation } from "react-i18next";

// Define the Project type
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

// Combined MyProject Component
const MyProject: React.FC = () => {
  const { data: session, status } = useSession();
  const { t, i18n } = useTranslation("translation");
  const [projects, setProjects] = useState<Project[]>([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
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
      }
    };

    fetchProjects();
  }, []);

  if (!isClient) {
    return null; // or a loading spinner
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#FBFBFB] overflow-hidden">
      <Navbar />
      <main className="flex-grow">
        <div className="lg:mx-64 lg:mt-10 lg:mb-10 mt-10 mb-10 mx-5">
          <h2 className="font-bold mb-4 text-[24px]">
            {t("nav.myproject.wait")}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
            {projects.map((project) => (
              <Link
                href={`/project/projectreceive/${project.projectDetails._id}`}
                key={project._id}
              >
                <div className="relative rounded-[10px] border border-[#BEBEBE] bg-white p-4">
                  <div className="w-auto h-auto flex flex-col">
                    <img
                      src={`/api/project/images/${project.projectDetails.imageUrl[0]}`}
                      alt="Product Image"
                      className="w-full h-[150px] rounded-md object-cover mb-4"
                    />
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
                      <div className="flex flex-col items-center my-2">
                        <button className="bg-[#33539B] text-white px-11 py-2 rounded-lg text-xs mt-1">
                          <p className="font-bold">
                            {t("nav.myproject.check")}
                          </p>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <p className="text-sm text-gray-500 mb-8">
            {t("nav.myproject.desCheck")}
          </p>

          <h2 className="font-bold mb-4 text-[24px]">
            {t("nav.myproject.title")}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {/* {userProducts.map((product, index) => (
              <Link href={`/project/projectreceive/${product._id}`} key={product._id}>
              <div className="relative rounded-[10px] border border-[#BEBEBE] bg-white p-4">
                <div className="w-auto h-auto flex flex-col">
                  <img
                    src={product.imageUrl && product.imageUrl.length > 0 ? `/api/project/images/${product.imageUrl[0]}` : '/placeholder-image.jpg'}
                    alt="Product Image"
                    className="w-full h-[150px] rounded-md object-cover mb-4"
                  />
                  <div className="flex flex-col h-full">
                    <p className="text-lg font-semibold mb-2 truncate">{product.projectname}</p>
                    <div className="flex items-center mb-2">
                      <span className="text-gray-500 mr-2 text-2xl">
                        <MdAccountCircle />
                      </span>
                      <p className="text-sm text-gray-600 truncate">{product.author}</p>
                    </div>
                    <div className="flex items-center mb-2">
                      <span className="text-yellow-500 mr-2 text-lg">
                        <IoIosStar />
                      </span>
                      <span className="text-gray-600 text-xs lg:text-sm truncate">
                        {product.rathing || 'N/A'} ({product.review}) | {t("nav.project.projectdetail.sold")} {product.sold}
                      </span>
                    </div>
                    <p className="text-lg font-bold text-[#33529B]">
                      {product.price} THB
                    </p>
                    <div className="flex flex-col items-center my-2">
                      <button className="bg-[#33539B] text-white px-11 py-2 rounded-lg text-xs mt-1">
                        <p className="font-bold">{t("nav.myproject.check")}</p>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
            ))} */}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default MyProject;
