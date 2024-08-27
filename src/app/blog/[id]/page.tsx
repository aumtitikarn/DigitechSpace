"use client";

import React from "react";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { AiOutlineNotification } from "react-icons/ai";
import { IoShareOutline } from "react-icons/io5";
import { CiHeart } from "react-icons/ci";
import Navbar from "../../components/Navbar";
import { redirect, useRouter } from "next/navigation";
import Footer from "../../components/Footer";
import Container from "../../components/Container";
import Link from "next/link";
import { MdAccountCircle } from "react-icons/md";
import { FaRegCommentDots } from "react-icons/fa6";
import { MdOutlineCancel } from "react-icons/md";
import { set } from "mongoose";
import { GoX } from "react-icons/go";
import { useTranslation } from "react-i18next";
import { BsChatDots } from "react-icons/bs";

function Blog({ params }) {
  const [review, setReview] = useState("");
  const [selectedReason, setSelectedReason] = useState<string>("");
  const maxLength = 200;

  const { id } = params;

  const router = useRouter();

  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [popupInput, setPopupInput] = useState("");

  const [postData, setPostData] = useState<PostData[]>([]);

  const [topic, setTopic] = useState("");
  const [course, setCourse] = useState("");
  const [description, setDescription] = useState("");
  const { t, i18n } = useTranslation("translation");

  const [input1, setInput1] = useState("");
  const handleReviewChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setReview(event.target.value);
  };

  const handleReasonChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedReason(event.target.value);
  };

  const getPostById = async (id: string) => {
    try {
      const res = await fetch(`http://localhost:3000/api/posts/${id}`, {
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
      setTopic(post.topic);
      setCourse(post.course);
      setDescription(post.description);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getPostById(id);
  }, []);

  const togglePopup = () => {
    setIsPopupOpen(!isPopupOpen);
  };

  const handlePopupSubmit = () => {
    alert(`Popup Input: ${popupInput}`);
    setPopupInput("");
    setIsPopupOpen(false);
  };
  const charactersRemaining = maxLength - review.length;
  const handleSubmit = () => {
    setInput1("");
  };

  const { data: session, status } = useSession();

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  // const [currentIndex, setCurrentIndex] = useState(0);

  // const handleIndicatorClick = () => {
  //   setCurrentIndex();
  // };
  interface PostData {
    _id: string;
    topic: string;
    course: string;
    onClose: () => void;
    // Add any other properties that are in your post data
  }

  return (
    <Container>
      <Navbar />
      <main className="flex flex-col items-center w-full">
        <div className="w-full max-w-screen-lg p-4">
          <div className="flex flex-col">
            <div className="relative w-auto h-96 md:h-[860px] lg:h-[860px] rounded-xl">
              <img
                src="https://64.media.tumblr.com/52eaf78ffa891980b680c5e12b15437e/tumblr_pmhq6nlBzJ1tk9psf_1280.jpg"
                className="object-cover w-full h-full md:aspect-w-3 md:aspect-h-4 rounded-xl"
                alt="Blog Image"
              />
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                <button
                  className={`w-3 h-3 rounded-full`}
                  // onClick={() => handleIndicatorClick()}
                ></button>
              </div>
            </div>

            <div className="flex flex-row mt-5 mb-5 items-center">
              <MdAccountCircle className="text-gray-500 w-9 h-9 flex justify-center items-center rounded-full mr-4" />
              <div className="flex flex-col justify-center">
                <h1 className="font-bold">T</h1>
              </div>
            </div>

            <div className="flex flex-wrap my-2">
              <Link
                href=""
                className="text-white rounded-md p-2 m-1"
                style={{ backgroundColor: "#33529B" }}
              >
                {t("nav.blog.code")} 11010203
              </Link>
              <Link
                href=""
                className="text-white rounded-md p-2 m-1"
                style={{ backgroundColor: "#33529B" }}
              >
                Datasets
              </Link>
            </div>

            <div className="mt-5">
              <h1 className="font-bold text-2xl">{postData.topic}</h1>
            </div>

            <div className="mt-2 mb-3">
              <p>{postData.description}</p>
            </div>

            <div className="flex justify-between items-center border-b-2 border-t-2 border-gray-200 py-3">
              <div className="flex space-x-4">
                <div className="flex items-center">
                  <CiHeart className="text-3xl" />
                  <p className="ml-1">500</p>
                </div>
                <div className="flex items-center">
                  <BsChatDots className="text-2xl" />
                  <p className="ml-1">1</p>
                </div>
              </div>
              <div className="flex space-x-4">
                <IoShareOutline className="text-2xl" />
                <AiOutlineNotification
                  className="text-2xl cursor-pointer"
                  onClick={togglePopup}
                />
              </div>
            </div>

            <div className="mt-5">
              <h1 className="font-bold text-2xl">{t("nav.blog.comment")}</h1>
            </div>

            <div className="flex flex-row mt-5 items-start">
              <MdAccountCircle className="text-gray-500 w-9 h-9 flex justify-center items-center rounded-full mr-4" />
              <div className="flex flex-col justify-center">
                <h1 className="font-bold">Titikarn Waitayasuwan</h1>
                <div className="flex flex-row">
                  <p className="font-thin text-sm mt-1">8/6/2024</p>
                  <button>
                    <p className="underline decoration-[#0E6FFF] decoration-2 underline-offset-2 ml-3 font-semibold text-[#0E6FFF]">
                      {t("nav.blog.reply")}
                    </p>
                  </button>
                </div>
                <p>แจ่มแมวเลยครับพรี่</p>
              </div>
            </div>
            <hr className="border-t border-gray-300 w-full m-2" />
            <div className="flex flex-row ml-5 items-start">
              <MdAccountCircle className="text-gray-500 w-9 h-9 flex justify-center items-center rounded-full mr-4" />
              <div className="flex flex-col justify-center">
                <h1 className="font-bold">Titikarn Waitayasuwan</h1>
                <p className="font-thin text-sm">8/6/2024</p>
                <p>ดีงาม</p>
              </div>
            </div>

            <div className="flex flex-row mt-5 items-start">
              <MdAccountCircle className="text-gray-500 w-9 h-9 flex justify-center items-center rounded-full mr-4" />
              <div className="flex flex-col justify-center">
                <h1 className="font-bold">Titikarn Waitayasuwan</h1>
                <div className="flex flex-row">
                  <p className="font-thin text-sm mt-1">8/6/2024</p>
                  <button>
                    <p className="underline decoration-[#0E6FFF] decoration-2 underline-offset-2 ml-3 font-semibold text-[#0E6FFF]">
                    {t("nav.blog.reply")}
                    </p>
                  </button>
                </div>
                <p>แจ่มแมวเลยครับพรี่</p>
              </div>
            </div>
            <hr className="border-t border-gray-300 w-full m-2" />
            <div className="flex flex-row ml-5 items-start">
              <MdAccountCircle className="text-gray-500 w-9 h-9 flex justify-center items-center rounded-full mr-4" />
              <div className="flex flex-col justify-center">
                <h1 className="font-bold">Titikarn Waitayasuwan</h1>
                <p className="font-thin text-sm">8/6/2024</p>
                <p>ดีงาม</p>
              </div>
            </div>

            <div className="relative mt-4">
              <input
                type="text"
                value={input1}
                onChange={(e) => setInput1(e.target.value)}
                placeholder="Enter first message"
                className="w-full p-2 mb-2 border border-gray-300 rounded h-36"
                style={{ flexDirection: "column", textAlign: "start" }}
              />
              <button
                onClick={handleSubmit}
                className="absolute bottom-2 right-2 w-36 p-2 text-white rounded bg-blue-500 mb-3 mr-1"
                style={{ backgroundColor: "#33529B" }}
              >
                {t("nav.blog.send")}
              </button>
            </div>

            {isPopupOpen && (
              <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-50">
                <div className="relative max-w-lg w-full p-8 bg-white shadow-md rounded-lg">
                  <GoX
                    onClick={() => setIsPopupOpen(false)} // Use the onClose prop to close the modal
                    className="absolute top-4 right-4 text-red-600 text-3xl cursor-pointer"
                  />
                  <h2 className="text-2xl font-bold mb-4 text-center">
                  {t("report.title")}
                  </h2>
                  <p className="text-lg font-medium mb-4 ">
                  {t("report.blog.topic")} : {postData.topic}
                  </p>
                  <div className="border-b border-gray-300 my-3"></div>

                  <p className="text-lg font-medium mb-2">{t("report.blog.reason")}</p>
                  <select
                    value={selectedReason}
                    onChange={handleReasonChange}
                    className="w-full p-2 border rounded-md mb-5"
                  >
                    <option value="profanity">
                    {t("report.blog.r1")}
                    </option>
                    <option value="off-topic">
                    {t("report.blog.r2")}
                    </option>
                    <option value="illegal-ads">
                    {t("report.blog.r3")}
                    </option>
                    <option value="unrelated">
                    {t("report.blog.r4")}
                    </option>
                    <option value="unrelated">
                    {t("report.blog.r5")}
                    </option>
                  </select>
                  <p className="text-lg font-medium mb-2">
                  {t("report.blog.add")}
                  </p>
                  <div className="relative mb-5">
                    <textarea
                      placeholder={t("report.text")}
                      value={review}
                      onChange={(e) => setPopupInput(e.target.value)}
                      className="w-full h-40 p-3 border-2 border-gray-300 rounded-md resize-none"
                      maxLength={maxLength}
                    />
                    <div className="absolute bottom-2 right-2 text-gray-500 text-sm">
                      {charactersRemaining} / {maxLength}
                    </div>
                  </div>
                  <button
                    onClick={handlePopupSubmit}
                    className="w-full bg-red-500 text-white py-2 rounded-md hover:bg-red-600 transition-colors duration-200"
                  >
                    {t("report.send")}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </Container>
  );
}

export default Blog;
