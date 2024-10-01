"use client";

import React, { useEffect, useState } from "react";
import { IoIosStar } from "react-icons/io";
import { CiHeart } from "react-icons/ci";
import Image from "next/image";
import Link from "next/link";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Container from "../components/Container";
import { useSession } from "next-auth/react";
import QRshare from "./QRshare/page";
import Editprofile from "./EditProfile/page";
import { MdAccountCircle } from "react-icons/md";
import { useTranslation } from "react-i18next";
import { FaPlus } from "react-icons/fa6";
import { OrbitProgress } from "react-loading-indicators";
import { useRouter } from "next/navigation";

function page() {
  const [activeButton, setActiveButton] = useState("button1"); // Set initial state to "button1"
  const { t, i18n } = useTranslation("translation");
  const [activeButton1] = useState("button1");
  const router = useRouter();
  const [postData, setPostData] = useState([]);
  const [postDataS, setPostDataS] = useState([]);
  const [postDataProject, setPostDataProject] = useState([]);
  const [postDataBlog, setPostDataBlog] = useState([]);
  const [publishedProject, setPublishedProjects] = useState([]);
  const { data: session, status } = useSession();

  const handleClick = (button) => {
    setActiveButton(button === activeButton ? null : button);
  };

  console.log("User ID:", session?.user?.id);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }

    if (status === "authenticated" && session) {
      const fetchData = async () => {
        try {
          // Fetch published projects
          const publishedResponse = await fetch(
            "/api/project/getProjects/user",
            {
              method: "GET",
            }
          );
          if (publishedResponse.ok) {
            const publishedData = await publishedResponse.json();
            console.log("Published Data:", publishedData);
            setPublishedProjects(publishedData);
          } else {
            console.error("Failed to fetch published projects");
          }

          // Fetch blog posts
          const blogResponse = await fetch("/api/posts/getposts/user", {
            cache: "no-store",
          });
          if (blogResponse.ok) {
            const blogData = await blogResponse.json();
            setPostDataBlog(blogData);
          } else {
            console.error("Failed to fetch blog posts");
          }

          // Fetch user profile
          const profileResponse = await fetch(
            `/api/editprofile/${session.user.id}`,
            {
              method: "GET",
              cache: "no-store",
            }
          );
          if (profileResponse.ok) {
            const profileData = await profileResponse.json();
            console.log("Edit post: ", profileData);
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

  // const getPosts = async () => {

  //   try {
  //     const res = await fetch("api/project/getProjects/user", {
  //       cache: "no-store"
  //     })

  //     if (!res.ok) {
  //       throw new Error("Failed of fetch posts")
  //     }

  //     const data = await res.json();
  //     console.log("Fetched Data: ", data); // Log the data to inspect its structure
  //     setPostData(data.posts);
  //     console.log(data); // Check the structure here
  //     setPostData(data.posts); // Make sure data.posts exists

  //   } catch (error) {
  //     console.log("Error loading posts: ", error);
  //   }
  // }

  const getPostById = async () => {
    try {
      const res = await fetch(`/api/editprofile/${session?.user?.id}`, {
        method: "GET",
        cache: "no-store",
      });

      if (!res.ok) {
        throw new Error("Failed to fetch a post");
      }

      const data = await res.json();
      console.log("Edit post: ", data);

      const post = data.post;
      setPostData(post);
    } catch (error) {
      console.log(error);
    }
  };

  const getPostByIdS = async () => {
    try {
      const res = await fetch(`/api/editprofile/${session?.user?.id}`, {
        method: "GET",
        cache: "no-store",
      });

      if (!res.ok) {
        throw new Error("Failed to fetch a post");
      }

      const data = await res.json();
      console.log("Edit post: ", data);

      const posts = data.posts;
      setPostDataS(posts);
    } catch (error) {
      console.log(error);
    }
  };

  console.log(postData);
  const getImageSource = () => {
    if (postData && postData.imageUrl && postData.imageUrl.length > 0) {
      if (postData.imageUrl[0].includes("http")) {
        return postData.imageUrl[0];
      } else {
        return `/api/editprofile/images/${postData.imageUrl[0]}`;
      }
    } else if (session?.user?.picture?.[0]) {
      return session.user.picture[0];
    }
    return null;
  };

  const imageSource = getImageSource();

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar session={session} />
      <main className="flex flex-col md:flex-row w-full justify-center p-4 mt-20 mb-10">
        <div className="flex flex-col w-full max-w-auto mb-20">
          {session?.user?.role == "NormalUser" && (
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
                      e.target.src = "/path/to/fallback/image.jpg"; // ระบุ path ของรูปภาพสำรอง
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
                  <MdAccountCircle
                    className="rounded-full text-gray-500"
                    style={{ width: "95px", height: "95px", margin: "15px" }}
                  />
                )}
              </div>
            </div>
          )}
          {session?.user?.role !== "NormalUser" && (
            <div className="flex flex-row justify-center">
              <div className="relative">
                {postDataS && postDataS.imageUrl ? (
                  <Image
                    width={200}
                    height={200}
                    src={`/api/editprofile/images/${postDataS.imageUrl}`}
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
                  <MdAccountCircle
                    className="rounded-full text-gray-500"
                    style={{ width: "95px", height: "95px" }}
                  />
                )}
              </div>
            </div>
          )}
          <div className="flex flex-row justify-center">
            <p
              style={{ fontSize: "24px", fontWeight: "bold" }}
              className="mt-6"
            >
              {session?.user?.name}
            </p>
          </div>

          <div className="flex flex-row justify-center mt-10 mb-10">
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
          </div>

          <div className="flex flex-row justify-center space-x-4 mt-4 w-full">
            <div className="flex flex-row" style={{ width: "100%" }}>
              <div className="flex flex-col mr-3" style={{ width: "100%" }}>
                <div className="flex flex-col" style={{ width: "100%" }}>
                  <button
                    onClick={() => handleClick("button1")}
                    className={`flex flex-row justify-center p-2 bg-white flex-grow ${
                      activeButton === "button1"
                        ? "border-b-[#33539B] border-b-4 rounded-b-lg"
                        : ""
                    }`}
                  >
                    <div className="flex flex-col justify-center w-auto h-10">
                      <p className="font-bold text-[20px]">
                        {t("nav.profile.project")}
                      </p>
                    </div>
                  </button>
                </div>
              </div>
              <div className="flex flex-col ml-3" style={{ width: "100%" }}>
                <div className="flex flex-col" style={{ width: "100%" }}>
                  <button
                    onClick={() => handleClick("button2")}
                    className={`flex flex-row justify-center p-2 bg-white flex-grow ${
                      activeButton === "button2"
                        ? "border-b-[#33539B] border-b-4 rounded-b-lg"
                        : ""
                    }`}
                  >
                    <div className="flex flex-col justify-center w-auto h-10">
                      <p className="font-bold text-[20px]">
                        {t("nav.profile.blog")}
                      </p>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
          {activeButton1 === "button1" && activeButton === "button1" && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 justify-items-center mt-10 w-full">
              {publishedProject && publishedProject.length > 0 ? (
                publishedProject.map((project, index) => (
                  <Link
                    key={index}
                    href={`/project/projectdetail/${project._id}`}
                  >
                    <div
                      className="flex-shrink-0 rounded-[10px] border border-[#BEBEBE] bg-white p-4 m-2"
                      style={{
                        width: "100%",
                        maxWidth: "303px",
                        height: "auto",
                        maxHeight: "375px",
                      }}
                    >
                      <div className="w-full h-full flex flex-col">
                        <Image
                          width={100}
                          height={400}
                          src={`/api/project/images/${project.imageUrl[0]}`} // Replace with the actual image field from your project model
                          alt="Project Image"
                          className="w-full h-[150px] md:h-[120px] lg:h-[150px] rounded-md object-cover mb-4"
                        />
                        <div className="flex flex-col justify-between h-full">
                          <p className="text-base md:text-lg font-semibold mb-2 truncate">
                            {project.name}{" "}
                            {/* Replace with your project title or name */}
                          </p>
                          <div className="flex items-center mb-2">
                            <span className="text-gray-500 mr-2 text-xl md:text-2xl">
                              <MdAccountCircle />
                            </span>
                            <p className="text-xs md:text-sm text-gray-600 truncate">
                              {project.author || session?.user?.name}{" "}
                              {/* Display author or user's name */}
                            </p>
                          </div>
                          <p className="text-base md:text-lg font-bold text-[#33529B]">
                            {project.price || "N/A"} THB{" "}
                            {/* Assuming project has a price */}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <p>No projects found.</p>
              )}
            </div>
          )}

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
                            src={`/api/posts/images/${blog.userprofile}`}
                            alt={blog.topic}
                            className="w-6 h-6 rounded-full mr-2 mt-1 text-gray-500"
                          />
                          <p className="mt-2 truncate text-gray-500 text-xs">
                            {blog.author || session?.user?.name}{" "}
                            {/* ใช้ชื่อผู้ใช้ที่โพสต์ */}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <p>No blogs found.</p>
              )}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default page;
