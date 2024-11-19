"use client";
import React, { useEffect, useState, useCallback } from "react";
import { IoIosStar } from "react-icons/io";
import { MdAccountCircle } from "react-icons/md";
import Link from "next/link";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useTranslation } from "react-i18next";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { OrbitProgress } from "react-loading-indicators";

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
  profileImage?: string;
  authorName?: string;
}

const ReviewCard: React.FC<{ project: Project }> = ({ project }) => {
  const { t } = useTranslation("translation");
  const [failedImages, setFailedImages] = useState<string[]>([]);

  return (
    <div
      className="rounded-[10px] border border-[#BEBEBE] bg-white p-4"
      style={{ width: "100%", height: "auto" }}
    >
      <div className="w-full h-full flex flex-col">
        <div className="relative w-full h-[150px] mb-4">
          <Image
            src={`/api/project/images/${project.imageUrl[0]}`}
            alt="Project Image"
            fill
            className="rounded-md object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
        <div className="flex flex-col h-full">
          <p className="text-lg font-semibold mb-2 truncate">
            {project.projectname}
          </p>
          <div className="flex items-center mb-2">
            {project.profileImage && !failedImages.includes(project._id) ? (
              <Image
                src={project.profileImage}
                alt="Author Profile"
                width={30}
                height={30}
                className="rounded-full w-[30px] h-[30px] object-cover"
                onError={() => {
                  setFailedImages((prev) => [...prev, project._id]);
                }}
              />
            ) : (
              <span>
                <MdAccountCircle className="text-gray-500 mr-2 text-2xl" />
              </span>
            )}
            <p className="text-sm text-gray-600 truncate">
              {project.authorName || t("unknownAuthor")}
            </p>
          </div>
          <div className="flex mb-2">
            <span className="text-yellow-500 mr-2">
              <IoIosStar />
            </span>
            <span className="lg:text-sm text-gray-600 text-[12px] truncate">
              {project.rathing || "N/A"} ({project.review}) |{" "}
              {t("nav.project.projectdetail.sold")} {project.sold}
            </span>
          </div>
          <p className="text-lg font-bold text-[#33529B] mb-2">
            {project.price} THB
          </p>
        </div>
      </div>
    </div>
  );
};

const Favorite: React.FC = () => {
  const { t } = useTranslation("translation");
  const { data: session, status } = useSession();
  const [favoriteProjects, setFavoriteProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFavorites = useCallback(async () => {
    if (!session?.user?.email) {
      setError("User is not logged in");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/favorites?email=${encodeURIComponent(session.user.email)}`,
        {
          method: "GET",
          cache: "no-store",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch favorites.");
      }

      const favoriteProjectIds: string[] = await response.json();

      if (favoriteProjectIds.length > 0) {
        const projectPromises = favoriteProjectIds.map((id) =>
          fetch(`/api/project/${id}`).then((res) => {
            if (!res.ok) {
              throw new Error();
            }
            return res.json();
          })
        );
        const projects = await Promise.all(projectPromises);
        setFavoriteProjects(projects);
      } else {
        setFavoriteProjects([]);
      }
    } catch (error: any) {
      console.error("Error loading favorites:", error);
      setError(error.message || "Failed to load favorites.");
    } finally {
      setLoading(false);
    }
  }, [session?.user?.email]);

  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

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
            ) : favoriteProjects.length > 0 ? (
              favoriteProjects.map((project) => (
                <Link
                  key={project._id}
                  href={`/project/projectdetail/${project._id}`}
                  passHref
                >
                  <ReviewCard project={project} />
                </Link>
              ))
            ) : (
              <p className="mt-2 text-gray-500 text-sm lg:text-base whitespace-nowrap">
                {t("nav.sell.noproject")}
              </p>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Favorite;
