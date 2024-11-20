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
import { MdAccountCircle } from "react-icons/md";
import { useTranslation } from "react-i18next";
import { FaPlus } from "react-icons/fa6";
import { OrbitProgress } from "react-loading-indicators";
import { useRouter } from "next/navigation";

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
  const { t, i18n } = useTranslation("translation");
  const [activeButton1] = useState("button1");
  const router = useRouter();
  const [postData, setPostData] = useState([]);
  const [postDataS, setPostDataS] = useState([]);
  const [postDataProject, setPostDataProject] = useState([]);
  const [postDataBlog, setPostDataBlog] = useState([]);
  const [publishedProject, setPublishedProjects] = useState([]);
  const { data: session, status } = useSession();
  const [failedImages, setFailedImages] = useState([]);

  const handleClick = (button) => {
    setActiveButton(button === activeButton ? null : button);
  };

  // Move getImageSource logic into the component
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

  useEffect(() => {
    const fetchData = async () => {
      if (status === "authenticated" && session) {
        try {
          // Fetch profile data first
          const profileResponse = await fetch(`/api/editprofile/${id}`);
          if (profileResponse.ok) {
            const profileData = await profileResponse.json();
            setPostData(profileData.post || profileData.posts);
            setPostDataS(profileData.posts);
            
            // Store author name from profile data
            const authorName = profileData.post?.name || profileData.posts?.name;

            // Fetch projects with author data
            const publishedResponse = await fetch(`/api/project/getProjects/${id}`);
            if (publishedResponse.ok) {
              const publishedData = await publishedResponse.json();
              // Add author name to each project
              const projectsWithAuthor = publishedData.map(project => ({
                ...project,
                authorName: authorName // Add author name from profile
              }));
              setPublishedProjects(projectsWithAuthor);
            }

          // Fetch blog posts with author data
          const blogResponse = await fetch(`/api/posts/getposts/${id}`);
          if (blogResponse.ok) {
            const blogData = await blogResponse.json();
            // Add author name to each blog post
            const blogsWithAuthor = blogData.map(blog => ({
              ...blog,
              authorName: authorName // Add author name from profile
            }));
            setPostDataBlog(blogsWithAuthor);
          }
          }
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      }
    };

    fetchData();
  }, [id, status, session]);

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

  const imageSource = getImageSource();

  console.log("postdata :", postDataBlog);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar session={session} />
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col w-full max-w-auto mb-20">
            <div className="flex flex-row justify-center">
              <div className="relative">
                {imageSource &&
                Array.isArray(failedImages) &&
                !failedImages.includes(imageSource) ? (
                  <Image
                    width={95}
                    height={95}
                    src={imageSource || ""}
                    alt="Profile Image"
                    unoptimized={true}
                    style={{
                      objectFit: "cover",
                      borderRadius: "50%",
                      width: "95px",
                      height: "95px",
                      margin: "15px",
                    }}
                    onError={() => {
                      setFailedImages((prev) => [...prev, imageSource]);
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

            <div className="flex flex-row justify-center">
              {session?.user?.role !== "NormalUser" && (
                <p
                  style={{ fontSize: "24px", fontWeight: "bold" }}
                  className="mt-6"
                >
                  {postDataS.name}
                </p>
              )}
              {session?.user?.role == "NormalUser" && (
                <p
                  style={{ fontSize: "24px", fontWeight: "bold" }}
                  className="mt-6"
                >
                  {postData.name}
                </p>
              )}
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
                            Array.isArray(failedImages) &&
                            !failedImages.includes(project._id) ? (
                              <Image
                                src={project.profileImage || ""}
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
                              <span className="text-gray-500 mr-2 text-3xl">
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
                  <p className="text-gray-500">{t("nav.profile.noproject")}</p>
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
                            {imageSource &&
                            Array.isArray(failedImages) &&
                            !failedImages.includes(id) ? (
                              <Image
                                width={24}
                                height={24}
                                src={imageSource || ""}
                                alt="Profile"
                                className="w-6 h-6 rounded-full mr-2 mt-1"
                                onError={() => {
                                  setFailedImages((prev) => [...prev, id]);
                                }}
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
      </main>
      <Footer />
    </div>
  );
}

export default Profile;
