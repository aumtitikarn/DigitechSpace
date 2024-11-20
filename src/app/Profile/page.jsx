"use client";

import React, { useState, useEffect, useRef } from 'react';
import { IoIosStar } from "react-icons/io";
import { CiHeart } from "react-icons/ci";
import Image from "next/image";
import Link from "next/link";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Container from "../components/Container";
import { useSession } from "next-auth/react";
import { MdAccountCircle } from "react-icons/md";
import { useTranslation } from "react-i18next";
import { FaPlus } from "react-icons/fa6";
import { OrbitProgress } from "react-loading-indicators";
import { useRouter } from "next/navigation";
import { MdClose } from "react-icons/md";

const getProxyUrl = (url) => `/api/proxy?url=${encodeURIComponent(url)}`;

const isValidHttpUrl = (string) => {
  let url;
  try {
    url = new URL(string);
  } catch (_) {
    return false;
  }
  return url.protocol === "http:" || url.protocol === "https:";
};
function Profile() {
  const [activeButton, setActiveButton] = useState("button1");
  const [showAllSkills, setShowAllSkills] = useState(false);
  const popupRef = useRef(null);
  const { t, i18n } = useTranslation("translation");
  const router = useRouter();
  const [postData, setPostData] = useState([]);
  const [postDataS, setPostDataS] = useState([]);
  const [publishedProject, setPublishedProjects] = useState([]);
  const [postDataBlog, setPostDataBlog] = useState([]);
  const { data: session, status } = useSession();
  const [failedImages, setFailedImages] = useState([]);

  // คงไว้ซึ่ง functions เดิมทั้งหมด...
  const handleClick = (button) => {
    setActiveButton(button === activeButton ? null : button);
  };

  const getImageSource = () => {
    if (postData && postData.imageUrl && postData.imageUrl.length > 0) {
      const imageUrl = postData.imageUrl[0];
      if (isValidHttpUrl(imageUrl)) {
        return getProxyUrl(imageUrl);
      } else {
        return `/api/editprofile/images/${imageUrl}`;
      }
    }
    if (postDataS && postDataS.imageUrl) {
      return `/api/editprofile/images/${postDataS.imageUrl}`;
    }
    if (session?.user?.image) {
      return getProxyUrl(session.user.image);
    }
    return null;
  };
  const getSkills = () => {
    if (session?.user?.role !== "NormalUser") {
      return postDataS?.skills || [];
    }
    return postData?.skills || [];
  };

  const skills = getSkills();
  const visibleSkills = skills.slice(0, 5);
  const remainingSkills = skills.length > 5 ? skills.slice(5) : [];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setShowAllSkills(false);
      }
    };

    if (showAllSkills) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [showAllSkills]);
  // คงไว้ซึ่ง useEffect และ functions อื่นๆ เหมือนเดิม...
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
    if (status === "authenticated" && session) {
      const fetchData = async () => {
        try {
          const publishedResponse = await fetch("/api/project/getProjects/user", {
            method: "GET",
          });
          if (publishedResponse.ok) {
            const publishedData = await publishedResponse.json();
            setPublishedProjects(publishedData);
          } else {
            console.error("Failed to fetch published projects");
          }

          const blogResponse = await fetch("/api/posts/getposts/user", {
            cache: "no-store",
          });
          if (blogResponse.ok) {
            const blogData = await blogResponse.json();
            setPostDataBlog(blogData);
          } else {
            console.error("Failed to fetch blog posts");
          }

          const profileResponse = await fetch(
            `/api/editprofile/${session.user.id}`,
            {
              method: "GET",
              cache: "no-store",
            }
          );
          if (profileResponse.ok) {
            const profileData = await profileResponse.json();
            setPostData(profileData.post);
            setPostDataS(profileData.posts);
          } else {
            console.error("Failed to fetch user profile");
          }
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };

      fetchData();
    }
  }, [status, session, router]);

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

  const imageSource = getImageSource();

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar session={session} />
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-8">
          {/* Profile Section - ปรับให้เหมือนต้นฉบับ */}
          <div className="flex items-start mb-8">
            {/* Profile Image */}
            <div className="w-32 h-32 rounded-full overflow-hidden mr-6">
              {imageSource && !failedImages.includes(imageSource) ? (
                <Image
                  src={imageSource}
                  alt="Profile"
                  width={128}
                  height={128}
                  className="w-full h-full object-cover"
                  onError={() => setFailedImages(prev => [...prev, imageSource])}
                />
              ) : (
                <MdAccountCircle className="w-full h-full text-gray-500" />
              )}
            </div>

            {/* Profile Info */}
            <div className="flex-grow">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-3xl font-bold mb-1">
                    {session?.user?.role !== "NormalUser" ? postDataS.name : postData.name}
                  </h1>
                  <p className="text-gray-600 mb-4">{postDataS.briefly}</p>
                  
                {/* Skills Section */}
          <div className="relative">
            <span className="text-gray-700 mr-2 font-bold">Skill :</span>
            <div className="flex flex-wrap gap-2 mt-2">
              {/* แสดง 5 skills แรก */}
              {visibleSkills.map((skill, index) => (
                <span 
                  key={index} 
                  className="px-4 py-1 text-white rounded-full bg-blue-500 hover:bg-blue-600 transition-all duration-200"
                >
                  {skill}
                </span>
              ))}
              
              {/* ปุ่มแสดง skills ที่เหลือ */}
              {remainingSkills.length > 0 && (
                <button
                  onClick={() => setShowAllSkills(true)}
                  className="px-4 py-1 text-white rounded-full bg-blue-500 hover:bg-blue-600 transition-all duration-200"
                >
                  +{remainingSkills.length}
                </button>
              )}
            </div>

            {/* Modern Popup with Backdrop */}
            {showAllSkills && (
              <>
                {/* Backdrop with blur effect */}
                <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40" />
                
                {/* Popup */}
                <div 
                  ref={popupRef}
                  className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-[600px] bg-white rounded-2xl shadow-2xl z-50 transition-all duration-300 ease-out"
                  style={{
                    transform: `translate(-50%, -50%) scale(${showAllSkills ? '1' : '0.9'})`,
                    opacity: showAllSkills ? 1 : 0
                  }}
                >
                  {/* Popup Header */}
                  <div className="flex justify-between items-center p-6 border-b">
                    <h3 className="text-xl font-bold text-gray-800">All Skills</h3>
                    <button 
                      onClick={() => setShowAllSkills(false)}
                      className="p-1 hover:bg-gray-100 rounded-full transition-colors duration-200"
                      aria-label="Close popup"
                    >
                      <MdClose className="w-6 h-6 text-gray-500" />
                    </button>
                  </div>

                  {/* Popup Content */}
                  <div className="p-6">
                    <div className="flex flex-wrap gap-3">
                      {skills.map((skill, index) => (
                        <span 
                          key={index}
                          className="px-4 py-1 text-white rounded-full bg-blue-500 hover:bg-blue-600 transition-all duration-200"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
          </div>
                {/* Action Buttons */}
                <div className="flex gap-4">
                  <Link
                    href={`/Profile/EditProfile/${session?.user?.id}`}
                    className="px-6 py-2 text-[#33539B] font-bold border-3 border-[#C1D3E5] rounded-lg hover:bg-blue-50"
                  >
                    แก้ไขโปรไฟล์
                  </Link>
                  <Link
                    href={`/Profile/QRshare/${session?.user?.id}`}
                    className="px-6 py-2 text-[#33539B] font-bold border-3 border-[#C1D3E5] rounded-lg hover:bg-blue-50"
                  >
                    แชร์โปรไฟล์
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 w-full mt-16 mb-8">
            <button
              onClick={() => setActiveButton("button1")}
              className={`py-4 text-xl font-bold ${
                activeButton === "button1" 
                ? "bg-[#E6ECFF] text-black" 
                : "text-gray-500 hover:bg-gray-50"
              }`}
            >
              Project
            </button>
            <button
              onClick={() => setActiveButton("button2")}
              className={`py-4 text-xl font-bold ${
                activeButton === "button2" 
                ? "bg-[#E6ECFF] text-black" 
                : "text-gray-500 hover:bg-gray-50"
              }`}
            >
              Blog
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
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 justify-items-center mt-10 w-full">
                {postDataBlog && postDataBlog.length > 0 ? (
                  postDataBlog.map((blog, index) => (
                    <Link key={index} href={`/blog/${blog._id}`}>
                      <div className="w-[150px] sm:w-[180px] md:w-[200px] h-auto flex flex-col">
                        <div
                          className="rounded w-full relative"
                          style={{ height: "200px" }}
                        >
                          <Image
                            src={`/api/posts/images/${blog.imageUrl}`}
                            alt={blog.topic || "Blog Image"}
                            fill
                            className="w-full object-cover rounded-lg"
                          />
                        </div>
                        <div className="ml-2 mt-2">
                          <div className="flex flex-col mt-1 justify-center">
                            <div className="flex flex-row">
                              <p className="truncate mt-1 text-sm font-bold w-full">
                                {blog.topic || "Untitled Blog"}
                              </p>
                              <div className="flex items-center">
                                <CiHeart className="text-xl" />
                                <p className="text-gray-500 text-sm">
                                  {blog.heart || 0}
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-row mb-3">
                            {imageSource && !failedImages.includes(blog._id) ? (
                              <Image
                                src={imageSource}
                                alt="Profile"
                                width={24}
                                height={24}
                                className="rounded-full mr-2 mt-1"
                                onError={() => {
                                  setFailedImages((prev) => [...prev, blog._id]);
                                }}
                              />
                            ) : (
                              <MdAccountCircle className="w-6 h-6 text-gray-500 mr-2 mt-1" />
                            )}
                            <p className="mt-2 truncate text-gray-500 text-xs">
                              {blog.authorName || "Unknown Author"}
                            </p>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))
                ) : (
                  <p className="text-gray-500">{t("nav.profile.noblog")}</p>
                )}
              </div>
            )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default Profile;