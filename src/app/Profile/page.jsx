"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
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
import SkillsSelector from "../components/SkillsSelector";

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
  const [localSkills, setLocalSkills] = useState([]);
  const [showAllSkills, setShowAllSkills] = useState(false);
  const [showSkillsEdit, setShowSkillsEdit] = useState(false);
  const [displaySkills, setDisplaySkills] = useState([]);
  const popupRef = useRef(null);
  const { t, i18n } = useTranslation("translation");
  const router = useRouter();
  const [postData, setPostData] = useState([]);
  const [postDataS, setPostDataS] = useState([]);
  const [publishedProject, setPublishedProjects] = useState([]);
  const [postDataBlog, setPostDataBlog] = useState([]);
  const { data: session, status } = useSession();
  const [failedImages, setFailedImages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  // คงไว้ซึ่ง functions เดิมทั้งหมด...
  const handleClick = (button) => {
    setActiveButton(button === activeButton ? null : button);
  };

  const getImageSource = useCallback(() => {
    if (postData && postData.imageUrl && postData.imageUrl.length > 0) {
      const imageUrl = postData.imageUrl[0];
      if (isValidHttpUrl(imageUrl)) {
        return getProxyUrl(imageUrl);
      }
      return `/api/editprofile/images/${imageUrl}`;
    }
    if (postDataS && postDataS.imageUrl) {
      return `/api/editprofile/images/${postDataS.imageUrl}`;
    }
    if (session?.user?.image) {
      return getProxyUrl(session.user.image);
    }
    return null;
  }, [postData, postDataS, session]);

  const getSkills = useCallback(() => {
    if (session?.user?.role !== "NormalUser") {
      return postDataS?.skills || [];
    }
    return postData?.skills || [];
  }, [session, postData, postDataS]);

  useEffect(() => {
    const currentSkills = getSkills();
    setDisplaySkills(currentSkills);
  }, [getSkills]);

  const handleSkillsChange = (newSkills) => {
    setDisplaySkills(newSkills);
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

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [publishedResponse, blogResponse, profileResponse] = await Promise.all([
        fetch("/api/project/getProjects/user", { method: "GET" }),
        fetch("/api/posts/getposts/user", { cache: "no-store" }),
        fetch(`/api/editprofile/${session.user.id}`, {
          method: "GET",
          cache: "no-store",
        }),
      ]);

      if (publishedResponse.ok) {
        const publishedData = await publishedResponse.json();
        setPublishedProjects(publishedData);
      }

      if (blogResponse.ok) {
        const blogData = await blogResponse.json();
        setPostDataBlog(blogData);
      }

      if (profileResponse.ok) {
        const profileData = await profileResponse.json();
        setPostData(profileData.post);
        setPostDataS(profileData.posts);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  }, [session]);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
    if (status === "authenticated" && session) {
      fetchData();
    }
  }, [status, session, router, fetchData]);

  if (status === "loading") {
    return (
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
        <OrbitProgress variant="track-disc" dense color="#33539B" size="medium" />
      </div>
    );
  }

  const handleSkillsUpdate = (updatedSkills) => {
    if (session?.user?.role !== "NormalUser") {
      setPostDataS(prev => ({ ...prev, skills: updatedSkills }));
    } else {
      setPostData(prev => ({ ...prev, skills: updatedSkills }));
    }
  };

  const imageSource = getImageSource();

  return (
    <div className="flex flex-col min-h-screen ">
      <Navbar session={session} />
      <main className="flex-grow lg:mx-20">
        <div className="container mx-auto px-4 py-8">
          {/* Profile Section - Modified for responsiveness */}
          <div className="flex flex-col md:flex-row items-start mb-8">
            {/* Profile Image */}
            <div className="w-32 h-32 rounded-full overflow-hidden md:mr-6 mx-auto md:mx-0 mb-4 md:mb-0">
              {imageSource && !failedImages.includes(imageSource) ? (
                <Image
                  src={imageSource}
                  alt="Profile"
                  width={128}
                  height={128}
                  className="rounded-full w-full h-full object-cover"
                  onError={() =>
                    setFailedImages((prev) => [...prev, imageSource])
                  }
                />
              ) : (
                <MdAccountCircle className="w-full h-full text-gray-500" />
              )}
            </div>

            {/* Profile Info */}
            <div className="flex-grow w-full">
              <div className="flex flex-col md:flex-row justify-between items-start">
                <div className="w-full md:w-auto">
                  <h1 className="text-3xl font-bold mb-1 text-center md:text-left">
                    {session?.user?.role !== "NormalUser"
                      ? postDataS.name
                      : postData.name}
                  </h1>
                  <p className="text-gray-600 mb-4 text-center md:text-left">
                    {postDataS.briefly}
                  </p>

                  {/* Skills Section */}
                  <div className="relative mb-4 md:mb-0">
                    <div className="flex flex-wrap gap-2 mt-2 justify-center md:justify-start">
                      <span className="text-[#5E5E5E] mr-2 font-bold mt-1 text-[16px] w-full md:w-auto text-center md:text-left">
                        {t("nav.skill.title")} :
                      </span>
                      {visibleSkills.map((skill, index) => (
                        <span
                          key={index}
                          className="px-4 py-1 text-white rounded-full bg-blue-500 hover:bg-blue-600 transition-all duration-200"
                        >
                          {skill}
                        </span>
                      ))}
                      {remainingSkills.length > 0 && (
                        <button
                          onClick={() => setShowAllSkills(true)}
                          className="px-4 py-1 text-white rounded-full bg-blue-500 hover:bg-blue-600 transition-all duration-200"
                        >
                          +{remainingSkills.length}
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 w-full md:w-auto justify-center md:justify-start mt-4 md:mt-0">
                  <Link
                    href={`/Profile/EditProfile/${session?.user?.id}`}
                    className="px-6 py-2 text-[#33539B] font-bold border-3 border-[#C1D3E5] rounded-lg hover:bg-blue-50"
                  >
                    {t("nav.profile.edit")}
                  </Link>
                  <Link
                    href={`/Profile/QRshare/${session?.user?.id}`}
                    className="px-6 py-2 text-[#33539B] font-bold border-3 border-[#C1D3E5] rounded-lg hover:bg-blue-50"
                  >
                    {t("nav.profile.share")}
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
              {t("nav.profile.project")}
            </button>
            <button
              onClick={() => setActiveButton("button2")}
              className={`py-4 text-xl font-bold ${
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
                          src={`/api/posts/images/${blog.imageUrl[0]}`}
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
                              className="rounded-full mr-2 w-[30px] h-[30px] object-cover"
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
          <SkillsSelector
            skills={displaySkills}
            showAllSkills={showAllSkills}
            setShowAllSkills={setShowAllSkills}
            t={t}
            session={session}
            onRefresh={() => {
              // เมื่อมีการเปลี่ยนแปลงใน SkillsSelector จะเรียก API เพื่อดึงข้อมูลใหม่
              fetchData();
            }}
            onSkillsChange={handleSkillsChange} // เพิ่ม prop นี้
          />
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default Profile;
