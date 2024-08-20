"use client";

import React, { useState } from "react";
import { useSession } from "next-auth/react";
import { AiOutlineNotification, AiOutlineToTop } from "react-icons/ai";
import { IoChatbubbleEllipses, IoShareOutline } from "react-icons/io5";
import { CiHeart } from "react-icons/ci";
import Navbar from "../components/Navbar";
import { redirect } from "next/navigation";
import Footer from "../components/Footer";
import Image from "next/image";
import Container from "../components/Container";
import Link from "next/link";
import { MdAccountCircle } from "react-icons/md";
import { useTranslation } from "react-i18next";
import { FaLink, FaFacebookF, FaTwitter } from "react-icons/fa";
import { GoCheck, GoShare, GoHeartFill } from "react-icons/go";
import { FaChevronRight, FaFacebook } from "react-icons/fa";
import { RiTwitterXLine } from "react-icons/ri";

const Blog = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [popupInput, setPopupInput] = useState("");
  const [isSharePopupOpen, setIsSharePopupOpen] = useState(false);
  const { t, i18n } = useTranslation("translation");
  const [input1, setInput1] = useState("");

  const togglePopup = () => {
    setIsPopupOpen(!isPopupOpen);
  };

  const handlePopupSubmit = () => {
    alert(`Popup Input: ${popupInput}`);
    setPopupInput("");
    setIsPopupOpen(false);
  };

  const handleSubmit = () => {
    setInput1("");
  };

  const handleShareClick = () => {
    setIsSharePopupOpen(!isSharePopupOpen); // Toggle popup open/close
  };

  const handleShareClosePopup = () => {
    setIsSharePopupOpen(false); // Close popup
  };

  const { data: session, status } = useSession();

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  if (!session) {
    redirect("/auth/signin");
    return null;
  }

  // const [currentIndex, setCurrentIndex] = useState(0);

  // const handleIndicatorClick = () => {
  //   setCurrentIndex();
  // };

  return (
    <Container>
      <Navbar session={session} />
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
              <MdAccountCircle className="w-9 h-9 flex justify-center items-center rounded-full mr-4 text-gray-500" />
              <div className="flex flex-col justify-center">
                <h1 className="font-bold">Titikarn Waitayasuwan</h1>
              </div>
            </div>

            <div className="flex flex-wrap">
              <Link
                href=""
                className="text-white rounded-md p-2 m-1"
                style={{ backgroundColor: "#33529B" }}
              >
                รหัสวิชา 11010203
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
              <h1 className="font-bold text-2xl">
                แนะนำ Study With Me ฉบับเด็กมทส.
              </h1>
            </div>

            <div className="mt-2 mb-3">
              <p>
                โดยการเปิดคลิป Study with me
                จะเสมือนมีเพื่อนนั่งอ่านหนังสือหรือนั่งทำงานไปด้วยกัน
                โดยบางช่องอาจเพิ่มเสียงเพลงประกอบเพื่อสร้างความผ่อนคลายไปด้วย
                โดยในบทความนี้เราจะมาแนะนำChannel ในYouTube
                ที่ส่วนตัวเราเองเปิดฟังบ่อยๆค่ะ วันนี้เราจะแนะนำ 5 Channel
                จากในYouTube กันค่ะ 1.Abao in Tokyo ช่องที่มีผู้ติดตาม 8.75
                แสนคน โดยนักศึกษาชาวจีนที่อาศัยอยู่ที่ประเทศญี่ปุ่น
                ในคลิปจะเป็นการนำเสนอการนั่งทำงานริมหน้าต่าง ที่ประเทศญี่ปุ่น
                โดยสามารถเห็นวิวของถนนไปด้วย ประกอบกับเสียงฝน และดนตรีบรรเลงเบาๆ
                ทำให้บรรยากาศดูสบายและผ่อนคลายมากขึ้น
              </p>
            </div>

            <div className="flex justify-between items-center border-b-2 border-t-2 border-gray-200 py-3">
              <div className="flex space-x-4">
                <div className="flex items-center">
                  <CiHeart className="text-3xl" />
                  <p className="ml-1">500</p>
                </div>
                <div className="flex items-center">
                  <IoChatbubbleEllipses className="text-2xl" />
                  <p className="ml-1">1</p>
                </div>
              </div>
              <div className="flex space-x-4">
                <div className="relative flex justify-center">
                  <GoShare
                    className="text-gray-600 cursor-pointer text-2xl"
                    onClick={handleShareClick}
                  />
                  {/* Share Popup */}
                  {isSharePopupOpen && (
                    <div className="absolute bottom-full mb-[10px] w-[121px] h-[46px] flex-shrink-0 rounded-[30px] border border-gray-300 bg-white flex items-center justify-center space-x-4 shadow-lg">
                      <FaLink className="text-gray-600 cursor-pointer" />
                      <FaFacebook className="text-gray-600 cursor-pointer" />
                      <RiTwitterXLine className="text-gray-600 cursor-pointer" />
                    </div>
                  )}
                </div>
                <AiOutlineNotification
                  className="text-2xl cursor-pointer text-gray-600"
                  onClick={togglePopup}
                />
              </div>
            </div>

            <div className="mt-5">
              <h1 className="font-bold text-2xl">Comment</h1>
            </div>

            <div className="flex flex-row mt-5 items-start">
              <MdAccountCircle className="w-9 h-9 flex justify-center items-center rounded-full mr-4 text-gray-500" />
              <div className="flex flex-col justify-center">
                <h1 className="">Titikarn Waitayasuwan</h1>
                <p className="font-thin text-sm">8/6/2024 1:15:15</p>
                <p className="text-gray-500 mt-1">แจ่มแมวเลยครับพรี่</p>
              </div>
            </div>
            <hr className="border-t border-gray-300 w-full m-2" />
            <div className="flex flex-row ml-5 items-start">
              <MdAccountCircle className="w-9 h-9 flex justify-center items-center rounded-full mr-4 text-gray-500" />
              <div className="flex flex-col justify-center">
                <h1 className="">Titikarn Waitayasuwan</h1>
                <p className="font-thin text-sm">8/6/2024 1:15:15</p>
                <p className="text-gray-500 mt-1">ดีงาม</p>
              </div>
            </div>

            <div className="flex flex-row mt-5 items-start">
              <MdAccountCircle className="w-9 h-9 flex justify-center items-center rounded-full mr-4 text-gray-500" />
              <div className="flex flex-col justify-center">
                <h1 className="">Titikarn Waitayasuwan</h1>
                <p className="font-thin text-sm">8/6/2024 1:15:15</p>
                <p className="text-gray-500 mt-1">แจ่มแมวเลยครับพรี่</p>
              </div>
            </div>
            <hr className="border-t border-gray-300 w-full m-2" />
            <div className="flex flex-row ml-5 items-start">
              <MdAccountCircle className="w-9 h-9 flex justify-center items-center rounded-full mr-4 text-gray-500" />
              <div className="flex flex-col justify-center">
                <h1 className="">Titikarn Waitayasuwan</h1>
                <p className="font-thin text-sm">8/6/2024 1:15:15</p>
                <p className="text-gray-500 mt-1">ดีงาม</p>
              </div>
            </div>

            <div className="relative mt-4">
              <input
                type="text"
                value={input1}
                onChange={(e) => setInput1(e.target.value)}
                placeholder="Comment"
                className="w-full p-2 mb-2 border border-gray-300 rounded h-36"
                style={{ flexDirection: "column", textAlign: "start" }}
              />
              <button
                onClick={handleSubmit}
                className="absolute bottom-2 right-2 w-36 p-2 text-white rounded bg-blue-500 mb-3 mr-1"
                style={{ backgroundColor: "#33539B" }}
              >
                Send
              </button>
            </div>

            {isPopupOpen && (
              <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                <div className="bg-white p-5 rounded-lg shadow-lg w-full max-w-md relative">
                  <button
                    onClick={() => setIsPopupOpen(false)}
                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                  >
                    &times;
                  </button>
                  <div className="flex flex-row justify-center">
                    <h2
                      className="text-lg font-bold mb-4"
                      style={{ fontWeight: "bold", fontSize: "26px" }}
                    >
                      Report
                    </h2>
                  </div>
                  <div className="flex flex-col mb-4">
                    <p
                      className="mb-4"
                      style={{ fontWeight: "bold", fontSize: "20px" }}
                    >
                      Blog : แนะนำ Study With Me ฉบับเด็กมทส.
                    </p>
                    <hr className="border-t border-gray-300 w-full" />
                  </div>
                  <div className="flex flex-row">
                    <p
                      className="mb-4"
                      style={{ fontWeight: "bold", fontSize: "20px" }}
                    >
                      Reason
                    </p>
                  </div>
                  <div className="flex flex-row">
                    <select
                      id="report-reason"
                      className="block w-full p-3 border border-gray-300 rounded my-1 mb-2"
                    >
                      <option value="profanity">
                        มีคำไม่สุภาพ หรือ คำหยาบคาย
                      </option>
                      <option value="off-topic">เนื้อหาไม่ตรงกับหัวข้อ</option>
                      <option value="illegal-ads">
                        มีการโฆษณาสิ่งผิดกฎหมาย
                      </option>
                      <option value="unrelated">
                        บทความไม่เกี่ยวข้องกับวิชาเรียน
                      </option>
                    </select>
                  </div>
                  <p
                    className="mb-4"
                    style={{ fontWeight: "bold", fontSize: "20px" }}
                  >
                    Additional message (200 Characters)
                  </p>
                  <input
                    type="text"
                    value={popupInput}
                    onChange={(e) => setPopupInput(e.target.value)}
                    placeholder="Enter your message"
                    className="w-full p-2 mb-4 border border-gray-300 rounded h-32"
                  />
                  <div className="flex justify-cendter w-full">
                    <button
                      onClick={handlePopupSubmit}
                      className="p-2 text-white rounded w-full"
                      style={{ backgroundColor: "#FF2727" }}
                    >
                      Send Report
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </Container>
  );
};

export default Blog;
