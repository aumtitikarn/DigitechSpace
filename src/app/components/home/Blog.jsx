"use client";

import React from "react";
import { CiHeart } from "react-icons/ci";
import { MdAccountCircle } from "react-icons/md";
import { useTranslation } from 'react-i18next';

function BlogPost({ image, title, author }) {
  const truncatedTitle = title.length > 23 ? `${title.slice(0, 23)}...` : title;

  return (
    <div className="mb-7 w-[280px] flex-shrink-0">
      {/* Blog post image */}
      <img
        src={image}
        alt={title}
        className="w-full h-[390px] rounded-md object-cover border-2 border-gray-200"
      />
      <div className="pt-4">
        {/* Title and like button */}
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-lg">{truncatedTitle}</h3>
          <button className="flex items-center text-gray-500 ml-2">
            <CiHeart className="mr-1" size={20} />
            <span>500</span>
          </button>
        </div>

        {/* Author information */}
        <div className="flex items-center">
          <span className="text-gray-500 mr-2 text-2xl">
            <MdAccountCircle />
          </span>
          <p className="text-sm text-gray-600">{author}</p>
        </div>
      </div>
    </div>
  );
}

export default function Blog() {
  const { t, i18n } = useTranslation('translation');
  const posts = [
    {
      image: "https://shovelapp.io/wp-content/uploads/2021/03/Student-Studying-This-Is-How-To-Study-1080x648.png",
      title: "This is a very long blog post title",
      author: "Titikarn Waitayasuwan",
    },
    {
      image: "https://64.media.tumblr.com/52eaf78ffa891980b680c5e12b15437e/tumblr_pmhq6nlBzJ1tk9psf_1280.jpg",
      title: "This is a very long blog post title",
      author: "Titikarn Waitayasuwan",
    },
    {
        image: "https://shovelapp.io/wp-content/uploads/2021/03/Student-Studying-This-Is-How-To-Study-1080x648.png",
        title: "This is a very long blog post title",
        author: "Titikarn Waitayasuwan",
      },
      {
        image: "https://64.media.tumblr.com/52eaf78ffa891980b680c5e12b15437e/tumblr_pmhq6nlBzJ1tk9psf_1280.jpg",
        title: "This is a very long blog post title",
        author: "Titikarn Waitayasuwan",
      },
      {
        image: "https://shovelapp.io/wp-content/uploads/2021/03/Student-Studying-This-Is-How-To-Study-1080x648.png",
        title: "This is a very long blog post title",
        author: "Titikarn Waitayasuwan",
      },
      {
        image: "https://64.media.tumblr.com/52eaf78ffa891980b680c5e12b15437e/tumblr_pmhq6nlBzJ1tk9psf_1280.jpg",
        title: "This is a very long blog post title",
        author: "Titikarn Waitayasuwan",
      },
      {
        image: "https://shovelapp.io/wp-content/uploads/2021/03/Student-Studying-This-Is-How-To-Study-1080x648.png",
        title: "This is a very long blog post title",
        author: "Titikarn Waitayasuwan",
      },
      {
        image: "https://64.media.tumblr.com/52eaf78ffa891980b680c5e12b15437e/tumblr_pmhq6nlBzJ1tk9psf_1280.jpg",
        title: "This is a very long blog post title",
        author: "Titikarn Waitayasuwan",
      },
    
    // Add more posts here
  ];

  return (
    <main className="flex flex-col items-center justify-center px-4 w-full">
      <div className="flex flex-col justify-center w-full">
        <div className="flex items-center space-x-2 mt-3">
          <p className="font-bold" style={{ fontSize: "24px" }}>
          {t("nav.blog.title")}
          </p>
        </div>
        <div className="mt-5 flex overflow-x-auto space-x-5">
          {posts.map((post, index) => (
            <BlogPost key={index} {...post} />
          ))}
        </div>
        <div className="flex-grow text-center mt-3">
          <p className="text-[#33529B] font-bold text-[18px]">
          {t("nav.home.seemore")} (20)
          </p>
        </div>
      </div>
    </main>
  );
}
