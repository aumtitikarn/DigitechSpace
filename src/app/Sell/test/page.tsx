'use client';
import React, { useEffect, useState } from 'react';
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { useSession } from "next-auth/react";
import { useTranslation } from "react-i18next";

interface Project {
  _id: string;
  projectname: string;
  description: string;
  receive: string[];
  category: string;
  imageUrl: string[];
}

const TestPage: React.FC = () => {
  const { data: session, status } = useSession();
  const { t } = useTranslation("translation");
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch('/api/project/getProjects');
        if (response.ok) {
          const data = await response.json();
          setProjects(data);
        } else {
          console.error('Failed to fetch projects:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    };

    fetchProjects();
  }, []);

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#FBFBFB]">
      <Navbar />
      <main className="flex-grow">
        <div className="lg:mx-64 lg:mt-10 lg:mb-10 mt-10 mb-10 mx-5">
          <h1 className="text-[24px] font-bold mb-5">Data</h1>
          {projects.map((project) => (
            <div key={project._id} className="bg-white p-5 rounded-md shadow-md mb-5">
              <h2 className="text-[20px] font-semibold">{project.projectname}</h2>
              <p className="mt-2">{project.description}</p>
              <div className="mt-3">
                <strong>{t("nav.sell.addP.receive")}:</strong>
                <ul className="list-disc list-inside">
                  {project.receive.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
              <p className="mt-2"><strong>{t("nav.sell.addP.select")}:</strong> {project.category}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {project.imageUrl.map((url, index) => (
                  <img key={index} src={url} alt={`Project image ${index + 1}`} className="w-24 h-24 object-cover rounded-md" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TestPage;