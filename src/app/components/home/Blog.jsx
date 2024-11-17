"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { CiHeart } from "react-icons/ci";
import { MdAccountCircle } from "react-icons/md";
import { useTranslation } from "react-i18next";
import Image from "next/image";
import Link from "next/link";

function Blog() {
  const { t, i18n } = useTranslation("translation");

  const [postData, setPostData] = useState([]);

  const getPosts = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/posts", {
        cache: "no-store",
      });

      if (!res.ok) {
        throw new Error("Failed of fetch posts");
      }

      const data = await res.json();
      console.log("Fetched Data: ", data);
      setPostData(data.posts);
      console.log(data);
      setPostData(data.posts);
    } catch (error) {
      console.log("Error loading posts: ", error);
    }
  };

  useEffect(() => {
    getPosts();
  }, []);

  const getImageSource = (post) => {
    // Changed from useProxy to regular function
    const proxyUrl = (url) => `/api/proxy?url=${encodeURIComponent(url)}`;

    const isValidHttpUrl = (string) => {
      let url;
      try {
        url = new URL(string);
      } catch (_) {
        return false;
      }
      return url.protocol === "http:" || url.protocol === "https:";
    };

    if (post.profileImage && post.profileImage.length > 0) {
      const profileImage = post.profileImage[0];
      if (isValidHttpUrl(profileImage)) {
        return proxyUrl(profileImage);
      } else {
        return `/api/posts/images/${profileImage}`;
      }
    }

    return "/default-profile-icon.png";
  };

  return (
    <main className="flex flex-col items-center justify-center px-4 w-full">
      <div className="flex flex-col justify-center w-full h-auto">
        <div className="flex items-center space-x-2 mt-3">
          <p className="font-bold" style={{ fontSize: "24px" }}>
            {t("nav.blog.title")}
          </p>
        </div>
        <div className="mt-5 flex overflow-x-auto space-x-5 h-96">
          {postData && postData.length > 0 ? (
            postData.map((val) => (
              <Link href={`/blog/${val._id}`} key={val._id}>
                {" "}
                {/* Added key prop here */}
                <div
                  key={val._id}
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
                      src={`/api/posts/images/${val.imageUrl}`}
                      alt={val.topic}
                      className="w-full object-cover rounded-lg h-full"
                      style={{ height: "220px" }}
                    />
                  </div>
                  <div className="ml-2 mt-2">
                    <div className="flex flex-col mt-1 justify-center">
                      <div className="flex flex-row">
                        <p
                          className="truncate mt-1 w-full"
                          style={{ fontSize: "14px", fontWeight: "bold" }}
                        >
                          {val.topic}
                        </p>
                        <div className="flex items-center">
                          <div className="w-6 h-6 ml-1 mt-1 text-gray-500">
                            <CiHeart style={{ fontSize: "20px" }} />
                          </div>
                          <p
                            className="text-gray-500"
                            style={{ fontSize: "16px" }}
                          >
                            {val.heart}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-row mb-3">
                      {postData.length &&
                      postData.length > 0 &&
                      val.profileImage &&
                      val.profileImage[0] ? (
                        <Image
                          width={30}
                          height={30}
                          src={val.profileImage}
                          alt="Profile"
                          style={{
                            objectFit: "cover",
                            borderRadius: "50%",
                            width: "30px",
                            height: "30px",
                            marginRight: "10px",
                          }}
                          onError={(e) => {
                            const target = e.target;
                            target.onerror = null;
                            target.src = "/default-profile-icon.png";
                          }}
                          className="w-8 h-8 rounded-full mr-2 mt-1 text-gray-500"
                        />
                      ) : (
                        <MdAccountCircle className="w-8 h-8 rounded-full mr-2 mt-1 text-gray-500" />
                      )}
                      <p
                        className="mt-2 truncate text-gray-500"
                        style={{ fontSize: "12px" }}
                      >
                        {val.authorName}
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="text-gray-500 text-center">
            <p>{t("nav.blog.noblog")}</p>
            </div>
          )}{" "}
          {/* Fixed apostrophe here */}
        </div>
        <div className="flex-grow text-center mt-3">
          <Link href={`/listblog`}>
            <p className="text-[#33529B] font-bold text-[18px]">
              {t("nav.home.seemore")} ({postData.length})
            </p>
          </Link>
        </div>
      </div>
    </main>
  );
}
export default Blog;
