import React, { useEffect, useState } from "react";
import { CiHeart } from "react-icons/ci";
import { MdAccountCircle } from "react-icons/md";
import { useTranslation } from "react-i18next";
import Link from "next/link";
import Image from "next/image";

function Blog() {
  const { t } = useTranslation("translation");
  const [postData, setPostData] = useState([]);
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
      // Sort by heart count and limit to 20 posts
      const sortedPosts = data.posts
        .sort((a, b) => b.heart - a.heart)
        .slice(0, 20);
      setPostData(sortedPosts);
    } catch (error) {
      console.log("Error loading posts: ", error);
    }
  };

  useEffect(() => {
    getPosts();
  }, []);

  const getImageUrl = (imageUrl) => {
    if (Array.isArray(imageUrl)) {
      return imageUrl.length > 0
        ? `/api/posts/images/${imageUrl[0]}`
        : "/default-image.png";
    }
    return `/api/posts/images/${imageUrl}`;
  };

  if (!postData || postData.length === 0) {
    return (
      <main className="flex flex-col items-center justify-center px-4 w-full">
        <div className="flex flex-col justify-center w-full">
          <div className="flex items-center space-x-2 mt-3">
            <p className="font-bold" style={{ fontSize: "24px" }}>
              {t("nav.blog.title")}
            </p>
          </div>
          <div className="text-gray-500 text-center mt-4">
            <p>{t("nav.blog.noblog")}</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex flex-col items-center justify-center px-4 w-full">
      <div className="flex flex-col justify-center w-full h-auto">
        <div className="flex items-center space-x-2 mt-3">
          <p className="font-bold" style={{ fontSize: "24px" }}>
            {t("nav.blog.title")}
          </p>
        </div>
        <div className="mt-5 flex overflow-x-auto space-x-5 h-96">
          {postData.map((val) => (
            <Link href={`/blog/${val._id}`} key={val._id}>
              <div
                className="flex flex-col"
                style={{ height: "300px", width: "180px" }}
              >
                <div
                  className="rounded w-full relative overflow-hidden group"
                  style={{ height: "250px" }}
                >
                  <div className="relative h-[220px] transform transition-transform duration-300 group-hover:scale-[1.02]">
                    <Image
                      width={300}
                      height={300}
                      src={getImageUrl(val.imageUrl)}
                      alt={val.topic}
                      className="w-full object-cover rounded-lg h-full shadow-md group-hover:shadow-lg transition-all duration-300 group-hover:brightness-105"
                      style={{ 
                        height: "220px",
                        filter: "drop-shadow(0 4px 3px rgb(0 0 0 / 0.07)) drop-shadow(0 2px 2px rgb(0 0 0 / 0.06))"
                      }}
                      quality={100}
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 100vw, 100vw"
                    />
                  </div>
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
                        <p className="text-gray-500 text-base">{val.heart}</p>
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
                          setFailedImages((prev) => new Set([...prev, val._id]));
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
          ))}
        </div>
        <div className="flex-grow text-center mt-3">
          <Link href="/listblog">
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