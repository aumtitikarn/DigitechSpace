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

interface PostData {
  _id: string;
  topic: string;
  course: string;
  heart: string;
  imageUrl: string[];
  selectedCategory: string;
  author: string;
  authorName: string;
  profileImage: string;
  description: string;
  userprofile?: string[];
}
export default function Page() {
  const [postData, setPostData] = useState<PostData[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const { t } = useTranslation("translation");
  const { data: session, status } = useSession();
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredPosts, setFilteredPosts] = useState<PostData[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [failedImages, setFailedImages] = useState(new Set());

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
    if (e.key === "Enter") {
      setIsSearching(true);
      const value = searchTerm.toLowerCase();

      const filtered = postData.filter(
        (post) =>
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

  const getProxyUrl = (url: string): string =>
    `/api/proxy?url=${encodeURIComponent(url)}`;

  const isValidHttpUrl = (string: string): boolean => {
    let url;
    try {
      url = new URL(string);
    } catch (_) {
      return false;
    }
    return url.protocol === "http:" || url.protocol === "https:";
  };

  const getImageSource = (post: PostData): string => {
    if (post.profileImage && post.profileImage.length > 0) {
      const profileImage = post.profileImage[0];
      if (isValidHttpUrl(profileImage)) {
        return getProxyUrl(profileImage);
      } else {
        return `/api/posts/images/${profileImage}`;
      }
    }
    return "/default-profile-icon.png";
  };
  const getImageUrl = (imageUrl: string[] | string) => {
    if (Array.isArray(imageUrl)) {
      return imageUrl.length > 0
        ? `/api/posts/images/${imageUrl[0]}`
        : "/default-image.png";
    }
    return `/api/posts/images/${imageUrl}`;
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
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
                <OrbitProgress
                  variant="track-disc"
                  dense
                  color="#33539B"
                  size="medium"
                  text=""
                  textColor=""
                />
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
                            src={getImageUrl(val.imageUrl)}
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
                            {val.profileImage && !failedImages.has(val._id) ? (
                              <Image
                                width={30}
                                height={30}
                                src={val.profileImage}
                                alt={`${val.authorName}'s profile`}
                                style={{
                                  objectFit: "cover",
                                  borderRadius: "50%",
                                  width: "30px",
                                  height: "30px",
                                  marginRight: "10px",
                                }}
                                className="w-8 h-8 rounded-full mr-2 mt-1 text-gray-500"
                                onError={() => {
                                  setFailedImages(
                                    (prev) => new Set([...prev, val._id])
                                  );
                                }}
                              />
                            ) : (
                              <MdAccountCircle className="w-8 h-8 rounded-full mr-2 mt-1 text-gray-500" />
                            )}
                            <p className="mt-3 truncate text-gray-500 text-xs font-semibold">
                              {val.authorName}
                            </p>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))
                ) : (
                  <p className="col-span-full text-center text-gray-500">
                    {t("nav.project.noresult")}
                  </p>
                )}
              </div>
            )}

            <div className="sticky bottom-8 w-full max-w-screen-lg mx-auto px-4 mt-8">
              {session?.user?.role !== "NormalUser" && (
                <div className="flex justify-end">
                  {session && (
                    <Link href={`/Addblog/${session?.user?.id}`}>
                      {/* <Link href={`/Addblog`}> */}
                      <div className="w-14 h-14 flex items-center justify-center bg-blue-500 text-white rounded-full hover:bg-blue-600 shadow-lg transition-all duration-300 ease-in-out transform hover:scale-110">
                        <FaPlus size={24} />
                      </div>
                    </Link>
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
