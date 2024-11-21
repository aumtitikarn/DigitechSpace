"use client";

import React, { useState, useEffect, useRef } from "react";
import { IoIosStar } from "react-icons/io";
import { CiHeart } from "react-icons/ci";
import Image from "next/image";
import Link from "next/link";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import Container from "../../../components/Container";
import { useSession } from "next-auth/react";
import { MdAccountCircle } from "react-icons/md";
import { useTranslation } from "react-i18next";
import { FaPlus } from "react-icons/fa6";
import { OrbitProgress } from "react-loading-indicators";
import { useRouter } from "next/navigation";
import { MdClose } from "react-icons/md";

const proxyUrl = (url) => `/api/proxy?url=${encodeURIComponent(url)}`;

const isValidHttpUrl = (string) => {
  try {
    const url = new URL(string);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
};

function Page({ params }) {
  const { id } = params;
  const { t } = useTranslation("translation");
  const { data: session, status } = useSession();

  const [activeButton, setActiveButton] = useState("button1");
  const [postData, setPostData] = useState([]);
  const [postDataS, setPostDataS] = useState([]);
  const [postDataBlog, setPostDataBlog] = useState([]);
  const [publishedProject, setPublishedProjects] = useState([]);
  const [failedImages, setFailedImages] = useState([]);
  const [showAllSkills, setShowAllSkills] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const popupRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setShowAllSkills(false);
      }
    };

    if (showAllSkills) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "unset";
    };
  }, [showAllSkills]);

  useEffect(() => {
    const fetchData = async () => {
      if (status === "authenticated" && session) {
        setIsLoading(true);
        if (id === session.user.id) {
          router.push('/Profile');
          return;
        }

        try {
          const profileResponse = await fetch(`/api/editprofile/${id}`);
          if (profileResponse.ok) {
            const profileData = await profileResponse.json();
            setPostData(profileData.post || profileData.posts);
            setPostDataS(profileData.posts);

            const authorName = profileData.post?.name || profileData.posts?.name;

            const [publishedResponse, blogResponse] = await Promise.all([
              fetch(`/api/project/getProjects/${id}`),
              fetch(`/api/posts/getposts/${id}`)
            ]);

            if (publishedResponse.ok) {
              const publishedData = await publishedResponse.json();
              const projectsWithAuthor = publishedData.map(project => ({
                ...project,
                authorName
              }));
              setPublishedProjects(projectsWithAuthor);
            }

            if (blogResponse.ok) {
              const blogData = await blogResponse.json();
              const blogsWithAuthor = blogData.map(blog => ({
                ...blog,
                authorName
              }));
              setPostDataBlog(blogsWithAuthor);
            }
          }
        } catch (error) {
          console.error("Error fetching data:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchData();
  }, [id, status, session, router]);

  const getSkills = () => {
    if (session?.user?.role !== "NormalUser") {
      return postDataS?.skills || [];
    }
    return postData?.skills || [];
  };

  const skills = getSkills();
  const visibleSkills = skills.slice(0, 5);
  const remainingSkills = skills.length > 5 ? skills.slice(5) : [];

  const getImageSource = () => {
    if (postData?.imageUrl?.[0]) {
      const imageUrl = postData.imageUrl[0];
      return isValidHttpUrl(imageUrl)
        ? proxyUrl(imageUrl)
        : `/api/editprofile/images/${imageUrl}`;
    }
    if (postDataS?.imageUrl) {
      return `/api/editprofile/images/${postDataS.imageUrl}`;
    }
    if (session?.user?.image) {
      return proxyUrl(session.user.image);
    }
    return null;
  };

  const handleClick = (button) => {
    setActiveButton(button === activeButton ? null : button);
  };

  const imageSource = getImageSource();

  if (status === "loading" || isLoading) {
    return (
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
        <OrbitProgress
          variant="track-disc"
          dense
          color="#33539B"
          size="medium"
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar session={session} />
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-8">
          {/* Profile Section - Mobile Responsive */}
          <div className="flex flex-col md:flex-row items-center md:items-start mb-8 gap-4 md:gap-6">
            {/* Profile Image */}
            <div className="w-32 h-32 rounded-full overflow-hidden">
              {imageSource && !failedImages.includes(imageSource) ? (
                <Image
                  src={imageSource}
                  alt="Profile"
                  width={128}
                  height={128}
                  className="w-full h-full object-cover"
                  onError={() => setFailedImages((prev) => [...prev, imageSource])}
                />
              ) : (
                <MdAccountCircle className="w-full h-full text-gray-500" />
              )}
            </div>

            {/* Profile Info */}
            <div className="flex-grow w-full">
              <div className="flex flex-col items-center md:items-start">
                <div className={`w-full text-center md:text-left ${!postDataS.briefly ? "md:mt-7" : ""}`}>
                  <h1 className={`text-2xl md:text-3xl font-bold ${!postDataS.briefly ? "mb-2" : "mb-1"}`}>
                    {session?.user?.role !== "NormalUser" ? postDataS.name : postData.name}
                  </h1>
                  {postDataS.briefly && (
                    <p className="text-gray-600 mb-4">{postDataS.briefly}</p>
                  )}

                  {/* Skills Section */}
                  <div className="relative mb-4">
                    <div className="flex flex-wrap gap-2 mt-2 justify-center md:justify-start">
                      <span className="text-[#5E5E5E] w-full md:w-auto text-center md:text-left font-bold mt-1">
                        {t("nav.skill.title")} :
                      </span>
                      {visibleSkills.map((skill, index) => (
                        <span
                          key={index}
                          className="px-3 md:px-4 py-1 text-sm md:text-base text-white rounded-full bg-blue-500"
                        >
                          {skill}
                        </span>
                      ))}
                      {remainingSkills.length > 0 && (
                        <button
                          onClick={() => setShowAllSkills(true)}
                          className="px-3 md:px-4 py-1 text-sm md:text-base text-white rounded-full bg-blue-500"
                        >
                          +{remainingSkills.length}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tab Buttons */}
          <div className="grid grid-cols-2 w-full mt-8 md:mt-16 mb-8">
            <button
              onClick={() => setActiveButton("button1")}
              className={`py-3 md:py-4 text-base md:text-xl font-bold ${
                activeButton === "button1"
                  ? "bg-[#E6ECFF] text-black"
                  : "text-gray-500 hover:bg-gray-50"
              }`}
            >
              {t("nav.profile.project")}
            </button>
            <button
              onClick={() => setActiveButton("button2")}
              className={`py-3 md:py-4 text-base md:text-xl font-bold ${
                activeButton === "button2"
                  ? "bg-[#E6ECFF] text-black"
                  : "text-gray-500 hover:bg-gray-50"
              }`}
            >
              {t("nav.profile.blog")}
            </button>
          </div>

           {/* Projects Grid */}
           {activeButton === "button1" && (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-x-[10px] gap-y-[20px] lg:gap-x-[30px] md:gap-x-[40px] md:gap-y-[40px] mt-5">
              {publishedProject && publishedProject.length > 0 ? (
                publishedProject.map((project, index) => (
                  <Link
                    key={index}
                    href={`/project/projectdetail/${project._id}`}
                  >
                    <div className="relative rounded-[10px] border border-[#BEBEBE] bg-white p-4 w-auto h-auto">
                      <div className="relative w-full h-[150px] mb-4">
                        <Image
                          src={`/api/project/images/${project.imageUrl[0]}`}
                          alt="Project Image"
                          fill
                          className="rounded-md object-cover"
                          sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        />
                      </div>
                      <div className="flex flex-col justify-between h-full">
                        <p className="text-lg font-semibold mb-2 truncate">
                          {project.projectname}
                        </p>
                        <div className="flex items-center mb-2">
                          {project.profileImage &&
                          !failedImages.includes(project._id) ? (
                            <Image
                              src={project.profileImage}
                              alt="Author Profile"
                              width={30}
                              height={30}
                              className="rounded-full mr-2 w-[30px] h-[30px] object-cover"
                              onError={() => {
                                setFailedImages((prev) => [
                                  ...prev,
                                  project._id,
                                ]);
                              }}
                            />
                          ) : (
                            <MdAccountCircle className="w-[30px] h-[30px] text-gray-500 mr-2" />
                          )}
                          <p className="text-sm text-gray-600 truncate">
                            {project.authorName}
                          </p>
                        </div>
                        <div className="flex items-center mb-2">
                          <IoIosStar className="text-yellow-500 mr-2" />
                          <span className="lg:text-sm text-gray-600 text-[12px] truncate">
                            {project.rathing || "N/A"} ({project.review}) |{" "}
                            {t("nav.project.projectdetail.sold")} {project.sold}
                          </span>
                        </div>
                        <p className="text-lg font-bold text-[#33529B]">
                          {project.price} THB
                        </p>
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <p className="text-gray-500">{t("nav.profile.noproject")}</p>
              )}
            </div>
          )}


          {/* Blogs Grid */}
          {activeButton === "button2" && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4 mt-6 md:mt-10">
              {postDataBlog && postDataBlog.length > 0 ? (
                postDataBlog.map((blog, index) => (
                  <Link key={index} href={`/blog/${blog._id}`} className="block w-full">
                    <div className="flex flex-col h-full">
                      <div className="relative w-full pb-[100%]">
                        <Image
                          src={`/api/posts/images/${blog.imageUrl[0]}`}
                          alt={blog.topic || "Blog Image"}
                          fill
                          className="absolute inset-0 object-cover rounded-lg"
                        />
                      </div>
                      <div className="mt-2 px-2">
                        <div className="flex items-center justify-between">
                          <p className="truncate text-xs md:text-sm font-bold flex-grow">
                            {blog.topic || "Untitled Blog"}
                          </p>
                          <div className="flex items-center ml-2">
                            <CiHeart className="text-lg md:text-xl" />
                            <p className="text-gray-500 text-xs md:text-sm ml-1">
                              {blog.heart || 0}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center mt-2">
                          {imageSource && !failedImages.includes(blog._id) ? (
                            <Image
                              src={imageSource}
                              alt="Profile"
                              width={20}
                              height={20}
                              className="rounded-full mr-2"
                              onError={() => setFailedImages((prev) => [...prev, blog._id])}
                            />
                          ) : (
                            <MdAccountCircle className="w-5 h-5 text-gray-500 mr-2" />
                          )}
                          <p className="truncate text-gray-500 text-xs">
                            {blog.authorName || "Unknown Author"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <p className="text-gray-500 col-span-full text-center">{t("nav.profile.noblog")}</p>
              )}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default Page;
