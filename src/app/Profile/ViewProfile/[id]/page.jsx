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
          // Fetch published projects
          const publishedResponse = await fetch("/api/project/getProjects/user");
          if (publishedResponse.ok) {
            const publishedData = await publishedResponse.json();
            setPublishedProjects(publishedData);
          } else {
            console.error("Failed to fetch published projects");
          }

          // Fetch profile data for the authenticated user
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

      // Fetch blog posts (not dependent on authentication status)
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
    <Container>
      <Navbar session={session} />
      <main className="flex flex-col md:flex-row w-full justify-center p-4 mt-20">
        <div className="flex flex-col w-full max-w-auto mb-20">
          {session?.user?.role === "NormalUser" ? (
            <div className="flex flex-row justify-center">
              <div className="relative">
              {imageSource ? (
                  <Image
                    width={200}
                    height={200}
                    src={imageSource}
                    alt="Profile"
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
                    width={200}
                    height={200}
                    src={`/api/editprofile/images/${imageSource}`}
                    alt="Profile"
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

          </div>

          <div className="flex flex-row justify-center space-x-4 mt-4 w-full">
            <div className="flex flex-row" style={{ width: "100%" }}>
              <div className="flex flex-col mr-3" style={{ width: "100%" }}>
                <button
                  onClick={() => handleClick("button1")}
                  className={`flex flex-row justify-center p-2 bg-white flex-grow ${
                    activeButton === "button1" ? "border-b-[#33539B] border-b-4 rounded-b-lg" : ""
                  }`}
                >
                  <p className="font-bold text-[20px]">{t("nav.profile.project")}</p>
                </button>
              </div>
              <div className="flex flex-col ml-3" style={{ width: "100%" }}>
                <button
                  onClick={() => handleClick("button2")}
                  className={`flex flex-row justify-center p-2 bg-white flex-grow ${
                    activeButton === "button2" ? "border-b-[#33539B] border-b-4 rounded-b-lg" : ""
                  }`}
                >
                  <p className="font-bold text-[20px]">{t("nav.profile.blog")}</p>
                </button>
              </div>
            </div>
          </div>

          {activeButton === "button1" && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 justify-items-center mt-10 w-full">
              {publishedProjects.length > 0 ? (
                publishedProjects.map((project, index) => (
                  <Link key={index} href={`/project/projectdetail/${project._id}`}>
                    <div className="flex-shrink-0 rounded-[10px] border border-[#BEBEBE] bg-white p-4 m-2">
                      <Image
                        width={100}
                        height={150}
                        src={`/api/project/images/${project.imageUrl[0]}`}
                        alt="Project Image"
                        className="w-full h-[150px] rounded-md object-cover mb-4"
                      />
                      <p className="text-base font-semibold mb-2 truncate">{project.name}</p>
                      <p className="text-sm text-gray-600 truncate">{project.author || session?.user?.name}</p>
                      <p className="text-lg font-bold text-[#33529B]">{project.price || "N/A"} THB</p>
                    </div>
                  </Link>
                ))
              ) : (
                <p>No projects found.</p>
              )}
            </div>
          )}

          {activeButton === "button2" && (
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
                          {/* <MdAccountCircle className="w-6 h-6 rounded-full mr-2 mt-1 text-gray-500" /> */}
                          <Image
                            width={200}
                            height={200}
                            src={imageSource}
                            alt={blog.topic}
                            className="w-6 h-6 rounded-full mr-2 mt-1 text-gray-500"
                          />
                          <p className="mt-2 truncate text-gray-500 text-xs">
                          {postData.name}
                            {/* ใช้ชื่อผู้ใช้ที่โพสต์ */}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <p>No blog posts found.</p>
              )}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </Container>
  );
}

export default page;
