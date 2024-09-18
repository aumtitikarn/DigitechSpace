"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { IoIosStar } from "react-icons/io";
import { MdAccountCircle } from "react-icons/md";
import { useSession } from "next-auth/react";
import { useTranslation } from "react-i18next";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

// Define the Project interface
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
const ReviewCard: React.FC<{ projectId: string }> = ({ projectId }) => {
  const { t } = useTranslation("translation");
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!projectId) {
        console.error("Invalid projectId");
        return; // ถ้า projectId เป็น undefined หรือ null ให้หยุดการทำงานของ useEffect
      }

      try {
        setLoading(true);
        // ดึงข้อมูลโปรเจกต์ตาม projectId
        const projectResponse = await fetch(`/api/favorites/`);
        if (projectResponse.ok) {
          const projectData = await projectResponse.json();
          setProject(projectData.post); // รับข้อมูล project
          console.log("Project data:", projectData.post);
        } else {
          setError("Failed to fetch project data.");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Error fetching project data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [projectId]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (!project) return <p>Project not found.</p>;

  return (
    <div className="rounded-[10px] border border-[#BEBEBE] bg-white p-4" style={{ width: "100%", height: "auto" }}>
      <div className="w-full h-full flex flex-col mb-4">
        {project.imageUrl.length > 0 && (
          <img
            src={`/api/favorites/images/${project.imageUrl[0]}`} // เลือกรูปภาพแรกใน array ของ imageUrl
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
          <p className="text-sm text-gray-600 mb-2 truncate">{project.description}</p>
          <div>
            <strong>{t("nav.project.receive")}:</strong>
            <ul className="list-disc ml-4">
              {project.receive.map((item, index) => (
                <li key={index} className="text-sm text-gray-600 truncate">{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};


// Favorite Component
const Favorite: React.FC = () => {
  const { t } = useTranslation("translation");
  const { data: session } = useSession();
  const [favoriteProjectIds, setFavoriteProjectIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFavorites = async () => {
    if (!session?.user?.name) {
      setError("User is not logged in");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/favorites?username=${encodeURIComponent(session.user.name)}`, {
        method: "GET",
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch favorites.");
      }

      const favorites = await response.json();
      const favoriteProjectIds = favorites.map((favorite: any) => favorite.projectId);
      setFavoriteProjectIds(favoriteProjectIds);
    } catch (error) {
      console.error("Error loading favorites:", error);
      setError("Failed to load favorites.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, [session?.user?.name]);

  return (
    <div className="flex flex-col min-h-screen bg-[#FBFBFB] overflow-hidden">
      <Navbar />
      <main className="flex-grow">
        <div className="lg:mx-64 lg:mt-10 lg:mb-10 mt-10 mb-10 mx-5">
          <h1 className="font-bold mb-4 text-[24px]">{t("nav.favorite")}</h1>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {loading ? (
              <p>{t("loading")}</p>
            ) : error ? (
              <p>{error}</p>
            ) : favoriteProjectIds.length > 0 ? (
              favoriteProjectIds.map((projectId) => (
                <Link key={projectId} href={`/project/projectdetail/${projectId}`} passHref>
                  <a>
                    <ReviewCard projectId={projectId} /> 
                  </a>
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

export default Favorite;
