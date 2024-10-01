"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { CiHeart } from "react-icons/ci";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Container from "../components/Container";
import Link from "next/link";
import { FaPlus, FaSearch } from "react-icons/fa";
import { MdAccountCircle } from "react-icons/md";
import { useTranslation } from "react-i18next";
import Image from "next/image";
import { OrbitProgress } from "react-loading-indicators";

// Update the PostData interface to include userprofile
interface PostData {
  _id: string;
  topic: string;
  course: string;
  heart: string;
  imageUrl: string[];
  selectedCategory : string;
  author: string;
  description: string;
  userprofile?: string[]; // ทำให้ userprofile เป็น optional
}
export default function Page() {
  const [postData, setPostData] = useState<PostData[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const { t } = useTranslation("translation");
  const { data: session, status } = useSession();
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredPosts, setFilteredPosts] = useState<PostData[]>([]);
  const [isSearching, setIsSearching] = useState(false);


  
  const getPosts = async () => {
    try {
      const res = await fetch("/api/posts", {
        cache: "no-store",
      });

      if (!res.ok) {
        throw new Error("Failed to fetch posts");
      }

      const data = await res.json();
      console.log("Fetched Data: ", data);
      setPostData(data.posts);
      setFilteredPosts(data.posts);
      setPostData(data.posts);
    } catch (error) {
      console.log("Error loading posts: ", error);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  
  const handleSearch = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      setIsSearching(true);
      const value = searchTerm.toLowerCase();
      
      const filtered = postData.filter(post =>
        post.topic.toLowerCase().includes(value) ||
        post.course.toLowerCase().includes(value) ||
        post.selectedCategory.toLowerCase().includes(value) ||
        post.description.toLowerCase().includes(value) ||
        post.author.toLowerCase().includes(value)

      );
      
      setFilteredPosts(filtered);
      setIsSearching(false);
    }
  };

  useEffect(() => {
    getPosts();
  }, []);


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
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <Container>
          <div className="w-full max-w-screen-lg p-4 mx-auto">
            <div className="flex flex-col">
              <p className="mt-3 text-2xl font-bold">{t("nav.blog.title")}</p>
              <div className="mt-4 w-full max-w-screen-lg flex justify-center relative">
                <input
                  type="text"
                  placeholder={t("nav.home.search")}
                  className="w-full p-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  onKeyPress={handleSearch}
                />
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
  
              {isSearching ? (
                <div className="flex justify-center items-center mt-10">
                  <OrbitProgress variant="track-disc" dense color="#33539B" size="medium" text="" textColor="" />
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 justify-items-center mt-10 w-full">
                  {filteredPosts.length > 0 ? (
                    filteredPosts.map((val) => (
                      <Link href={`/blog/${val._id}`} key={val._id}>
                        <div
                          className="flex flex-col"
                          style={{ height: "300px", width: "180px" }}
                        >
                          <div
                            className="rounded w-full relative"
                            style={{ height: "250px" }}
                          >
                            <Image
                              width={300}
                              height={300}
                              src={`/api/posts/images/${val.imageUrl[currentIndex]}`}
                              alt={val.topic}
                              className="w-full object-cover rounded-lg h-full"
                              style={{ height: "220px" }}
                            />
                          </div>
                          <div className="ml-2 mt-2">
                            <div className="flex flex-col mt-1 justify-center">
                              <div className="flex flex-row">
                                <p className="truncate mt-1 w-full text-sm font-bold">
                                  {val.topic}
                                </p>
                                <div className="flex items-center">
                                  <div className="w-6 h-6 ml-1 mt-1 text-gray-500">
                                    <CiHeart style={{ fontSize: "20px" }} />
                                  </div>
                                  <p className="text-gray-500 text-base">
                                    {val.heart}
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div className="flex flex-row mb-3">
                              {val.userprofile &&
                              val.userprofile.length > 0 &&
                              val.userprofile[0] ? (
                                <Image
                                  width={30}
                                  height={30}
                                  src={`/api/posts/images/${val.userprofile[0]}`}
                                  alt="Profile"
                                  onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                                    const target = e.target as HTMLImageElement;
                                    target.onerror = null;
                                    target.src = "/default-profile-icon.png";
                                  }}
                                  className="w-8 h-8 rounded-full mr-2 mt-1 text-gray-500"
                                />
                              ) : (
                                <MdAccountCircle className="w-9 h-9 rounded-full mr-2 mt-1 text-gray-500" />
                              )}
                              <p className="mt-2 truncate text-gray-500 text-xs">
                                {val.author}
                              </p>
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))
                  ) : (
                    <p className="col-span-full text-center">{t("nav.project.noresult")}</p>
                  )}
                </div>
              )}
  
              <div className="sticky bottom-8 w-full max-w-screen-lg mx-auto px-4 mt-8">
                <div className="flex justify-end">
                {session && (
                  <Link href="/Addblog">
                    <div className="w-14 h-14 flex items-center justify-center bg-blue-500 text-white rounded-full hover:bg-blue-600 shadow-lg transition-all duration-300 ease-in-out transform hover:scale-110">
                      <FaPlus size={24} />
                    </div>
                  </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        </Container>
      </main>
      <Footer />
    </div>
  );
}
