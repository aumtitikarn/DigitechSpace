"use client";

import React, { useEffect, useState } from "react";
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
import { OrbitProgress } from "react-loading-indicators";

function page({ params, initialComments }) {

  const { id } = params;

  const [activeButton, setActiveButton] = useState("button1");
  const { t } = useTranslation("translation");

  const [postData, setPostData] = useState([]);
  const [postDataS, setPostDataS] = useState([]);
  const [postDataBlog, setPostDataBlog] = useState([]);
  const [publishedProjects, setPublishedProjects] = useState([]);

  const { data: session, status } = useSession();

  const handleClick = (button) => {
    setActiveButton(button === activeButton ? null : button);
  };

  useEffect(() => {
    const fetchData = async () => {
      if (status === "authenticated" && session) {
        try {
          const publishedResponse = await fetch(`/api/project/getProjects/${id}`);
          if (publishedResponse.ok) {
            const publishedData = await publishedResponse.json();
            setPublishedProjects(publishedData);
          } else {
            console.error("Failed to fetch published projects");
          }

          const profileResponse = await fetch(`/api/editprofile/${id}`);
          if (profileResponse.ok) {
            const profileData = await profileResponse.json();
            setPostData(profileData.post || profileData.posts);
            setPostDataS(profileData.posts);
          } else {
            console.error("Failed to fetch profile data");
          }
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      }

      try {
        const blogResponse = await fetch(`/api/posts/getposts/${id}`, { cache: "no-store" });
        if (blogResponse.ok) {
          const blogData = await blogResponse.json();
          setPostDataBlog(blogData);
        } else {
          console.error("Failed to fetch blog posts");
        }
      } catch (error) {
        console.error("Error loading posts:", error);
      }
    };

    fetchData();
  }, [status, session]);

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
        <OrbitProgress variant="track-disc" dense color="#33539B" size="medium" />
      </div>
    );
  }


  const getImageSource = () => {
    const useProxy = (url) => `/api/proxy?url=${encodeURIComponent(url)}`;


    const isValidHttpUrl = (string) => {
      let url;
      try {
        url = new URL(string);
      } catch (_) {
        return false;
      }
      return url.protocol === "http:" || url.protocol === "https:";
    };
    if (postData && postData.imageUrl && postData.imageUrl.length > 0) {
      const imageUrl = postData.imageUrl[0];
      if (isValidHttpUrl(imageUrl)) {
        return useProxy(imageUrl);
      } else {
        return `/api/editprofile/images/${imageUrl}`;
      }
    }
    if (postDataS && postDataS.imageUrl) {
      return `/api/editprofile/images/${postDataS.imageUrl}`;
    }
    if (session?.user?.image) {
      return useProxy(session.user.image);
    }
    return null;
  };

  const imageSource = getImageSource();

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar session={session} />
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row w-full justify-center p-4 mt-20">
        <div className="flex flex-col w-full max-w-auto mb-20">
          {session?.user?.role === "NormalUser" ? (
            <div className="flex flex-row justify-center">
              <div className="relative">
                {imageSource ? (
                  <Image
                    width={95}
                    height={95}
                    src={imageSource}
                    alt="Profile Image"
                    unoptimized={true}
                    onError={(e) => {
                      e.target.onerror = null;
                    }}
                    style={{
                      objectFit: "cover",
                      borderRadius: "50%",
                      width: "95px",
                      height: "95px",
                      margin: "15px",
                    }}
                  />
                ) : (
                  <MdAccountCircle className="rounded-full text-gray-500" style={{ width: "95px", height: "95px" }} />
                )}
              </div>
            </div>
          ) : (
            <div className="flex flex-row justify-center">
              <div className="relative">
                {imageSource ? (
                  <Image
                    width={95}
                    height={95}
                    src={imageSource}
                    alt="Profile Image"
                    unoptimized={true}
                    onError={(e) => {
                      e.target.onerror = null;
                    }}
                    style={{
                      objectFit: "cover",
                      borderRadius: "50%",
                      width: "95px",
                      height: "95px",
                      margin: "15px",
                    }}
                  />
                ) : (
                  <MdAccountCircle className="rounded-full text-gray-500" style={{ width: "95px", height: "95px" }} />
                )}
              </div>
            </div>
          )}

          <div className="flex flex-row justify-center">
            <p style={{ fontSize: "24px", fontWeight: "bold" }} className="mt-6">
              {postData.name}
            </p>
          </div>

          <div className="flex flex-row justify-center mt-10 mb-10">
            {session?.user?.email === postDataS?.email && (
              <>
                <Link
                  href={`/Profile/EditProfile/${session?.user?.id}`}
                  className="bg-blue-500 text-white px-4 py-2 rounded mx-2 hover:bg-blue-600 w-64 flex items-center justify-center"
                  style={{ backgroundColor: "#33539B" }}
                >
                  <p>{t("nav.profile.edit")}</p>
                </Link>
                <Link
                  href={`/Profile/QRshare/${session?.user?.id}`}
                  className="bg-green-500 text-white px-4 py-2 rounded mx-2 hover:bg-green-600 w-64 flex items-center justify-center"
                  style={{ backgroundColor: "#33539B" }}
                >
                  {t("nav.profile.share")}
                </Link>
              </>
            )}
          </div>

          <div className="flex flex-row justify-center space-x-4 mt-4 w-full">
            <div className="flex flex-row" style={{ width: "100%" }}>
              <div className="flex flex-col mr-3" style={{ width: "100%" }}>
                <button
                  onClick={() => handleClick("button1")}
                  className={`flex flex-row justify-center p-2 bg-white flex-grow ${activeButton === "button1" ? "border-b-[#33539B] border-b-4 rounded-b-lg" : ""
                    }`}
                >
                  <p className="font-bold text-[20px]">{t("nav.profile.project")}</p>
                </button>
              </div>
              <div className="flex flex-col ml-3" style={{ width: "100%" }}>
                <button
                  onClick={() => handleClick("button2")}
                  className={`flex flex-row justify-center p-2 bg-white flex-grow ${activeButton === "button2" ? "border-b-[#33539B] border-b-4 rounded-b-lg" : ""
                    }`}
                >
                  <p className="font-bold text-[20px]">{t("nav.profile.blog")}</p>
                </button>
              </div>
            </div>
          </div>

          {activeButton === "button1" && (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-x-[10px] gap-y-[20px] lg:gap-x-[30px] md:gap-x-[40px] md:gap-y-[40px] mt-5">
              {publishedProjects.length > 0 ? (
                publishedProjects.map((project, index) => (
                  <Link
                      key={index}
                      href={`/project/projectdetail/${project._id}`}
                    >
                      <div className="relative rounded-[10px] border border-[#BEBEBE] bg-white p-4 w-auto h-auto">
                        <img
                          src={`/api/project/images/${project.imageUrl[0]}`}
                          alt="Project Image"
                          className="w-full h-[150px] rounded-md object-cover mb-4"
                        />
                        <div className="flex flex-col justify-between h-full">
                          <p className="text-lg font-semibold mb-2 truncate">
                            {project.projectname}
                          </p>
                          <div className="flex items-center mb-2">
                            {project.profileImage ? (
                              <Image
                                src={project.profileImage}
                                alt="Author Profile"
                                width={20}
                                height={20}
                                className="rounded-full mr-2 w-[30px] h-[30px] object-cover"
                              />
                            ) : (
                              <span className="text-gray-500 mr-2 text-2xl">
                                <MdAccountCircle />
                              </span>
                            )}
                            <p className="text-sm text-gray-600 truncate">
                              {project.authorName}
                            </p>
                          </div>
                          <div className="flex items-center mb-2">
                            <span className="text-yellow-500 mr-2">
                              <IoIosStar />
                            </span>
                            <span className="lg:text-sm text-gray-600 text-[12px] truncate">
                              {project.rathing || "N/A"} ({project.review}) |{" "}
                              {t("nav.project.projectdetail.sold")}{" "}
                              {project.sold}
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
                  <p>{t("nav.profile.noproject")}</p>
                )}
            </div>
          )}

          {/* {activeButton === "button2" && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 justify-items-center mt-10 w-full">
              {postDataBlog.length > 0 ? (
                postDataBlog.map((blog, index) => (
                  <Link key={index} href={`/blog/${blog._id}`}>
                    <div className="w-[150px] sm:w-[180px] md:w-[200px] h-auto flex flex-col">
                      <div
                        className="rounded w-full relative"
                        style={{ height: "200px" }}
                      >
                        <Image
                          width={100}
                          height={400}
                          src={`/api/posts/images/${blog.imageUrl}`}
                          alt={blog.topic}
                          className="w-full object-cover rounded-lg h-full"
                        />
                        <div className="flex flex-col justify-between h-full">
                          <p className="text-lg font-semibold mb-2 truncate">
                            {project.projectname}
                          </p>
                          <div className="flex items-center mb-2">
                            {project.profileImage ? (
                              <Image
                                src={project.profileImage}
                                alt="Author Profile"
                                width={20}
                                height={20}
                                className="rounded-full mr-2 w-[30px] h-[30px] object-cover"
                              />
                            ) : (
                              <span className="text-gray-500 mr-2 text-2xl">
                                <MdAccountCircle />
                              </span>
                            )}
                            <p className="text-sm text-gray-600 truncate">
                              {project.authorName}
                            </p>
                          </div>
                          <div className="flex items-center mb-2">
                            <span className="text-yellow-500 mr-2">
                              <IoIosStar />
                            </span>
                            <span className="lg:text-sm text-gray-600 text-[12px] truncate">
                              {project.rathing || "N/A"} ({project.review}) |{" "}
                              {t("nav.project.projectdetail.sold")}{" "}
                              {project.sold}
                            </span>
                          </div>
                          <p className="text-lg font-bold text-[#33529B]">
                            {project.price} THB
                          </p>
                        </div>
                      </div>
                      </div>
                    </Link>
                  ))
                ) : (
                  <p>{t("nav.profile.noproject")}</p>
                )}
              </div>
            )} */}

          {activeButton === "button2" && (
             <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 justify-items-center mt-10 w-full">
              {postDataBlog.length > 0 ? (
                postDataBlog.map((blog, index) => (
                  <Link key={index} href={`/blog/${blog._id}`}>
                  <div className="w-[150px] sm:w-[180px] md:w-[200px] h-auto flex flex-col">
                    <div
                      className="rounded w-full relative"
                      style={{ height: "200px" }}
                    >
                      <Image
                        width={100}
                        height={400}
                        src={
                          blog.imageUrl
                            ? `/api/posts/images/${blog.imageUrl}`
                            : "/path/to/default/image.jpg"
                        }
                        alt={blog.topic || "Blog Image"}
                        className="w-full object-cover rounded-lg h-full"
                      />
                    </div>
                    <div className="ml-2 mt-2">
                      <div className="flex flex-col mt-1 justify-center">
                        <div className="flex flex-row">
                          <p className="truncate mt-1 text-sm font-bold w-full">
                            {blog.topic || "Untitled Blog"}
                          </p>
                          <div className="flex items-center">
                            <CiHeart style={{ fontSize: "20px" }} />
                            <p className="text-gray-500 text-sm">
                              {blog.heart || 0}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-row mb-3">
                        {imageSource ? (
                          <Image
                            width={24}
                            height={24}
                            src={imageSource}
                            alt="Profile"
                            className="w-6 h-6 rounded-full mr-2 mt-1"
                          />
                        ) : (
                          <MdAccountCircle className="w-6 h-6 rounded-full mr-2 mt-1 text-gray-500" />
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
        </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default page;
