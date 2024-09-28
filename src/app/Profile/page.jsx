"use client";

import React, { useEffect, useState } from "react";
import { IoIosStar } from "react-icons/io";
import { CiHeart } from "react-icons/ci";
import Image from 'next/image'
import Link from 'next/link';
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Container from "../components/Container";
import { useSession } from "next-auth/react";
import QRshare from "./QRshare/page"
import Editprofile from "./EditProfile/page"
import { MdAccountCircle } from "react-icons/md";
import { useTranslation } from "react-i18next";
import { FaPlus } from "react-icons/fa6";
import { OrbitProgress } from "react-loading-indicators";

function page() {
  const [activeButton, setActiveButton] = useState("button1");  // Set initial state to "button1"
  const { t, i18n } = useTranslation("translation");
  const [activeButton1] = useState("button1");

  const [postData, setPostData] = useState([]);
  const [postDataS, setPostDataS] = useState([]);
  const [postDataProject, setPostDataProject] = useState([]);
  const [postDataBlog, setPostDataBlog] = useState([]);
  const [publishedProject, setPublishedProjects] = useState([]);

  const handleClick = (button) => {
    setActiveButton(button === activeButton ? null : button);
  };

  const { data: session, status } = useSession();

  console.log("User ID:", session?.user?.id);

  console.log("this is id kub " + session._id)

  console.log("this is id photo " + session.user.image)

  if (status === "loading") {
    return <div style={{
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      textAlign: "center",
    }}>
      <OrbitProgress variant="track-disc" dense color="#33539B" size="medium" text="" textColor="" />
    </div>;
  }

  const getPosts = async () => {
    try {
      const res = await fetch("api/project/getProjects/user", {
        cache: "no-store"
      });

      if (!res.ok) {
        throw new Error("Failed to fetch posts");
      }

      const data = await res.json();
      console.log("Fetched Data: ", data); // Log the data to inspect its structure

      // Update the state with the data
      // setPublishedProjects(data); // Assuming the API returns an array of projects
      console.log("เช็คข้อมูลโครงงาน", data)
    } catch (error) {
      console.log("Error loading posts: ", error);
    }
  };

  useEffect(() => {
    getPosts();
  }, []);


  const getPostsblog = async () => {
    try {
      const res = await fetch("/api/posts/getposts/user", {
        cache: "no-store"
      });

      if (!res.ok) {
        throw new Error("Failed to fetch posts");
      }

      const data = await res.json();
      setPostDataBlog(data); // บันทึกข้อมูลใน state
    } catch (error) {
      console.log("Error loading posts: ", error);
    }
  };

  // ใช้ useEffect เพื่อเรียกฟังก์ชัน getPostsblog เมื่อ component โหลด
  useEffect(() => {
    getPostsblog();
  }, []);


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

  useEffect(() => {
    const getPosts = async () => {
      if (status === "authenticated" && session) {
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
            console.log("Published Data:", publishedData); // Debug log
            setPublishedProjects(publishedData);
          } else {
            console.error("Failed to fetch published projects");
          }
        } catch (error) {
          console.error("Error fetching projects:", error);
        }
      }
    };

    getPosts();
  }, [status, session]);

  const products = [
    {
      image:
        "https://cdn.stock2morrow.com/upload/book/1555_s2m-standard-banner-5.jpg",
      name: "Hi5 Website",
      author: "Titikarn Waitayasuwan",
      rating: "4.8",
      reviews: 28,
      sold: 29,
      price: "50,000",
    },
    {
      image:
        "https://cdn.stock2morrow.com/upload/book/1555_s2m-standard-banner-5.jpg",
      name: "Hi5 Website",
      author: "Titikarn Waitayasuwan",
      rating: "4.8",
      reviews: 28,
      sold: 29,
      price: "50,000",
    },
    {
      image:
        "https://cdn.stock2morrow.com/upload/book/1555_s2m-standard-banner-5.jpg",
      name: "Hi5 Website",
      author: "Titikarn Waitayasuwan",
      rating: "4.8",
      reviews: 28,
      sold: 29,
      price: "50,000",
    },
    {
      image:
        "https://cdn.stock2morrow.com/upload/book/1555_s2m-standard-banner-5.jpg",
      name: "Hi5 Website",
      author: "Titikarn Waitayasuwan",
      rating: "4.8",
      reviews: 28,
      sold: 29,
      price: "50,000",
    },
    {
      image:
        "https://cdn.stock2morrow.com/upload/book/1555_s2m-standard-banner-5.jpg",
      name: "Hi5 Website",
      author: "Titikarn Waitayasuwan",
      rating: "4.8",
      reviews: 28,
      sold: 29,
      price: "50,000",
    },
    {
      image:
        "https://cdn.stock2morrow.com/upload/book/1555_s2m-standard-banner-5.jpg",
      name: "Hi5 Website",
      author: "Titikarn Waitayasuwan",
      rating: "4.8",
      reviews: 28,
      sold: 29,
      price: "50,000",
    },
    {
      image:
        "https://cdn.stock2morrow.com/upload/book/1555_s2m-standard-banner-5.jpg",
      name: "Hi5 Website",
      author: "Titikarn Waitayasuwan",
      rating: "4.8",
      reviews: 28,
      sold: 29,
      price: "50,000",
    },
    {
      image:
        "https://cdn.stock2morrow.com/upload/book/1555_s2m-standard-banner-5.jpg",
      name: "Hi5 Website",
      author: "Titikarn Waitayasuwan",
      rating: "4.8",
      reviews: 28,
      sold: 29,
      price: "50,000",
    },
    {
      image:
        "https://cdn.stock2morrow.com/upload/book/1555_s2m-standard-banner-5.jpg",
      name: "Hi5 Website",
      author: "Titikarn Waitayasuwan",
      rating: "4.8",
      reviews: 28,
      sold: 29,
      price: "50,000",
    },
    {
      image:
        "https://cdn.stock2morrow.com/upload/book/1555_s2m-standard-banner-5.jpg",
      name: "Hi5 Website",
      author: "Titikarn Waitayasuwan",
      rating: "4.8",
      reviews: 28,
      sold: 29,
      price: "50,000",
    },
    {
      image:
        "https://cdn.stock2morrow.com/upload/book/1555_s2m-standard-banner-5.jpg",
      name: "Hi5 Website",
      author: "Titikarn Waitayasuwan",
      rating: "4.8",
      reviews: 28,
      sold: 29,
      price: "50,000",
    },
    {
      image:
        "https://cdn.stock2morrow.com/upload/book/1555_s2m-standard-banner-5.jpg",
      name: "Hi5 Website",
      author: "Titikarn Waitayasuwan",
      rating: "4.8",
      reviews: 28,
      sold: 29,
      price: "50,000",
    },
  ];

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

  useEffect(() => {
    getPostById();
  }, []);

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

  useEffect(() => {
    getPostByIdS();
  }, []);

  return (
    <Container>
      <Navbar session={session} />
      <main className="flex flex-col md:flex-row w-full justify-center p-4 mt-20">
        <div className="flex flex-col w-full max-w-auto mb-20">
          {session?.user?.role == "NormalUser" && (
            <div className="flex flex-row justify-center">
              <div className="relative">
                {postData && postData.imageUrl && postData.imageUrl.length > 0 ? (
                  postData.imageUrl[0].includes('http') ? (
                    // If the imageUrl is an external URL (starting with http)
                    <img
                      width={200}
                      height={200}
                      src={session.user.image}
                      alt="Getgmail"
                      style={{
                        objectFit: "cover",
                        borderRadius: "50%",
                        width: "95px",
                        height: "95px",
                        margin: "15px",
                      }}
                    />
                  ) : (
                    // If the imageUrl is a local file (stored in the system)
                    <Image
                      width={200}
                      height={200}
                      src={`/api/editprofile/images/${postData.imageUrl[0]}`}
                      alt="Profile"
                      style={{
                        objectFit: "cover",
                        borderRadius: "50%",
                        width: "95px",
                        height: "95px",
                        margin: "15px",
                      }}
                    />
                  )
                ) : (
                  // If no imageUrl is provided, show the default icon
                  <MdAccountCircle
                    className="rounded-full text-gray-500"
                    style={{ width: "95px", height: "95px" }}
                  />
                )}
                {/* {postData && postData.imageUrl && postData.imageUrl !== "" && postData.imageUrl !== "undefined" ? (
                  <Image
                    width={200}
                    height={200}
                    src={`/api/editprofile/images/${postData.imageUrl}`}
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
                )} */}
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
            <p style={{ fontSize: "24px", fontWeight: "bold" }} className="mt-6">{session?.user?.name}</p>
          </div>

          <div className="flex flex-row justify-center mt-10 mb-10">
            <Link href={`/Profile/EditProfile/${session?.user?.id}`} className="bg-blue-500 text-white px-4 py-2 rounded mx-2 hover:bg-blue-600 w-64 flex items-center justify-center" style={{ backgroundColor: "#33539B" }}>
              <p>{t("nav.profile.edit")}</p>
            </Link>
            <Link href={`/Profile/QRshare/${session?.user?.id}`} className="bg-green-500 text-white px-4 py-2 rounded mx-2 hover:bg-green-600 w-64 flex items-center justify-center" style={{ backgroundColor: "#33539B" }}>
              {t("nav.profile.share")}
            </Link>
          </div>


          <div className="flex flex-row justify-center space-x-4 mt-4 w-full">
            <div className="flex flex-row" style={{ width: "100%" }}>
              <div className="flex flex-col mr-3" style={{ width: "100%" }}>
                <div className="flex flex-col" style={{ width: "100%" }}>
                  <button
                    onClick={() => handleClick("button1")}
                    className={`flex flex-row justify-center p-2 bg-white flex-grow ${activeButton === "button1"
                      ? "border-b-[#33539B] border-b-4 rounded-b-lg"
                      : ""
                      }`}
                  >
                    <div className="flex flex-col justify-center w-auto h-10">
                      <p className="font-bold text-[20px]">{t("nav.profile.project")}</p>
                    </div>
                  </button>
                </div>
              </div>
              <div className="flex flex-col ml-3" style={{ width: "100%" }}>
                <div className="flex flex-col" style={{ width: "100%" }}>
                  <button
                    onClick={() => handleClick("button2")}
                    className={`flex flex-row justify-center p-2 bg-white flex-grow ${activeButton === "button2"
                      ? "border-b-[#33539B] border-b-4 rounded-b-lg"
                      : ""
                      }`}
                  >
                    <div className="flex flex-col justify-center w-auto h-10">
                      <p className="font-bold text-[20px]">{t("nav.profile.blog")}</p>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
          {activeButton1 === "button1" && activeButton === "button1" && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 justify-items-center mt-10 w-full">
              {publishedProject && publishedProject.length > 0 ? (
                publishedProject.map((project, index) => (
                  <Link key={index} href={`/project/projectdetail/${project._id}`}>
                    <div
                      className="flex-shrink-0 rounded-[10px] border border-[#BEBEBE] bg-white p-4 m-2"
                      style={{ width: "100%", maxWidth: "303px", height: "auto", maxHeight: "375px" }}
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
                            {project.name}  {/* Replace with your project title or name */}
                          </p>
                          <div className="flex items-center mb-2">
                            <span className="text-gray-500 mr-2 text-xl md:text-2xl">
                              <MdAccountCircle />
                            </span>
                            <p className="text-xs md:text-sm text-gray-600 truncate">
                              {project.author || session?.user?.name} {/* Display author or user's name */}
                            </p>
                          </div>
                          <p className="text-base md:text-lg font-bold text-[#33529B]">
                            {project.price || 'N/A'} THB  {/* Assuming project has a price */}
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
                      <div className="rounded w-full relative" style={{ height: "200px" }}>
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
                              <p className="text-gray-500 text-sm">{blog.heart || 0}</p>
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
                            {blog.author || session?.user?.name} {/* ใช้ชื่อผู้ใช้ที่โพสต์ */}
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
    </Container>
  );
}

export default page;
