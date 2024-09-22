"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { IoIosStar } from "react-icons/io";
import { MdAccountCircle } from "react-icons/md";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useSession } from "next-auth/react";
import { useTranslation } from "react-i18next";

interface Project {
  _id: string;
  product: string;
  status: string;
  createdAt: string;
  check: boolean;
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

const MyProject: React.FC = () => {
  const { data: session, status } = useSession();
  const { t } = useTranslation("translation");
  const [projects, setProjects] = useState<Project[]>([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    fetchProjects();
  }, []);

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

  const handleCheck = async (projectId: string) => {
    try {
      const response = await fetch(`/api/myproject/check/${projectId}`, {
        method: 'POST',
      });
      if (!response.ok) {
        throw new Error("Failed to check project");
      }
      const data = await response.json();
      
      setProjects(prevProjects => 
        prevProjects.map(project => 
          project._id === projectId ? { ...project, check: true } : project
        )
      );
    } catch (error) {
      console.error("Error checking project:", error);
    }
  };

  const renderProject = (project: Project, showCheckButton: boolean) => (
    <div key={project._id} className="relative rounded-[10px] border border-[#BEBEBE] bg-white p-4">
      <Link href={`/project/projectreceive/${project.projectDetails._id}`}>
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
          </div>
        </div>
      </Link>
      {showCheckButton && (
        <div className="flex flex-col items-center my-2">
          <button 
            className="bg-[#33539B] text-white px-11 py-2 rounded-lg text-xs mt-1"
            onClick={() => handleCheck(project._id)}
          >
            <p className="font-bold">{t("nav.myproject.check")}</p>
          </button>
        </div>
      )}
    </div>
  );

  const renderProjectList = (projects: Project[], showCheckButton: boolean, title: string) => (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {projects.length > 0 ? (
        projects.map(project => renderProject(project, showCheckButton))
      ) : (
        <div className="col-span-full text-center">
          <p className="text-gray-500">{t("nav.myproject.noproject")}</p>
        </div>
      )}
    </div>
  );

  const uncheckedProjects = projects.filter(project => !project.check);
  const checkedProjects = projects.filter(project => project.check);

  if (!isClient) {
    return null;
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#FBFBFB] overflow-hidden">
      <Navbar />
      <main className="flex-grow">
        <div className="lg:mx-64 lg:mt-10 lg:mb-10 mt-10 mb-10 mx-5">
          <section>
            <h2 className="font-bold mb-2 text-[24px]">
              {t("nav.myproject.wait")}
            </h2>
            <p className="text-sm mb-8">
              {t("nav.myproject.desCheck")}
            </p>
            {renderProjectList(uncheckedProjects, true, t("nav.myproject.wait"))}
          </section>

          <section className="mt-10">
            <h2 className="font-bold mb-4 text-[24px]">
              {t("nav.myproject.title")}
            </h2>
            {renderProjectList(checkedProjects, false, t("nav.myproject.title"))}
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default MyProject;