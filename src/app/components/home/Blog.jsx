"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { CiHeart } from "react-icons/ci";
import { MdAccountCircle } from "react-icons/md";
import { useTranslation } from 'react-i18next';
import Image from "next/image";
import Link from "next/link";

// function BlogPost() {

//   return (
//     <div className="mb-7 w-[280px] flex-shrink-0 ">
//       {/* Blog post image */}
//       <img
//         src={image}
//         alt={title}
//         className="w-full h-[390px] rounded-md object-cover border-2 border-gray-200"
//       />
//       <div className="pt-4">
//         {/* Title and like button */}
//         <div className="flex items-center justify-between">
//           <h3 className="font-bold text-lg">{truncatedTitle}</h3>
//           <button className="flex items-center text-gray-500 ml-2">
//             <CiHeart className="mr-1" size={20} />
//             <span>500</span>
//           </button>
//         </div>

//         {/* Author information */}
//         <div className="flex items-center">
//           <span className="text-gray-500 mr-2 text-2xl">
//             <MdAccountCircle />
//           </span>
//           <p className="text-sm text-gray-600">{author}</p>
//         </div>
//       </div>
//     </div>
//   );
// }

function Blog() {
  const { t, i18n } = useTranslation('translation');

  const [postData, setPostData] = useState([]);

  const getPosts = async () => {

    try {
      const res = await fetch("http://localhost:3000/api/posts", {
        cache: "no-store"
      })

      if (!res.ok) {
        throw new Error("Failed of fetch posts")
      }

      const data = await res.json();
      console.log("Fetched Data: ", data); // Log the data to inspect its structure
      setPostData(data.posts);
      console.log(data); // Check the structure here
      setPostData(data.posts); // Make sure data.posts exists

    } catch (error) {
      console.log("Error loading posts: ", error);
    }
  }

  useEffect(() => {
    getPosts();
  }, []);

  // interface PostData {
  //   _id: string;
  //   topic: string;
  //   course: string;
  //   heart: string;
  //   imageUrl: string[];
  //   author: string;
  //   userprofile: string[];
  //   // Add any other properties that are in your post data
  // }

  return (
    <main className="flex flex-col items-center justify-center px-4 w-full">
      <div className="flex flex-col justify-center w-full">
        <div className="flex items-center space-x-2 mt-3">
          <p className="font-bold" style={{ fontSize: "24px" }}>
          {t("nav.blog.title")}
          </p>
        </div>
        <div className="mt-5 flex overflow-x-auto space-x-5 h-auto">
          {postData && postData.length > 0 ? (
                postData.map(val => (
                  <Link href={`/blog/${val._id}`}>
                    <div key={val._id} className="flex flex-col" style={{ height: "300px", width: "180px" }}>
                      <div className="rounded w-full relative" style={{ height: "250px" }}>
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
                          {postData.length && postData.length > 0 && val.userprofile && val.userprofile[0] ? (
                            <Image
                              width={200}
                              height={200}
                              src={`/api/posts/images/${val.userprofile[0]}`}
                              alt="Profile"
                              // onError={(e) => { e.target.onerror = null; e.target.src = ""; }} // Handle broken image links
                              style={{ objectFit: "cover", borderRadius: "50%", width: "30px", height: "30px", marginRight: "10px" }}
                            />
                          ) : (
                            <MdAccountCircle className="w-8 h-8 rounded-full mr-2 mt-1 text-gray-500" />
                          )}
                          <p className="mt-2 truncate text-gray-500" style={{ fontSize: "12px" }}>
                            {val.author}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))) : (<p>you don't have</p>)}
        </div>
        <div className="flex-grow text-center mt-3">
          <p className="text-[#33529B] font-bold text-[18px]">
          {t("nav.home.seemore")} ({postData.length})
          </p>
        </div>
      </div>
    </main>
  );
}
export default Blog;