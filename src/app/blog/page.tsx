"use client";

import React, { useState } from "react";
import { useSession } from "next-auth/react";
import { AiOutlineNotification,AiOutlineToTop } from "react-icons/ai";
import { IoChatbubbleEllipses,IoShareOutline } from "react-icons/io5";
import { CiHeart } from "react-icons/ci";
import Navbar from "../components/Navbar";
import { redirect } from "next/navigation";
import Footer from "../components/Footer";
import Image from "next/image";
import Container from "../components/Container";
import Link from 'next/link';

const Blog =()=> {


  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [popupInput, setPopupInput] = useState("");

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
    alert(`Input 1: ${input1}`);
    setInput1("");

    };

    const { data: session, status } = useSession();
    
    if (status === "loading") {
        return <p>Loading...</p>;
      }
    
      if (!session) {
        redirect("/auth/signin");
        return null;
      } 


  return (
    <Container>
    <Navbar session={session} />
    <main className="flex flex-col items-center w-full">
      <div className="w-full max-w-screen-lg p-4">
        <div className="flex flex-col">
        <div className="relative w-auto h-96 md:h-[860px] lg:h-[860px]">
  <img
    src="https://64.media.tumblr.com/52eaf78ffa891980b680c5e12b15437e/tumblr_pmhq6nlBzJ1tk9psf_1280.jpg"
    className="object-cover w-full h-full md:aspect-w-3 md:aspect-h-4"
    alt="Blog Image"
  />
</div>

          <div className="flex flex-row mt-5 mb-5 items-center">
            <div className="bg-gray-300 w-9 h-9 flex justify-center items-center rounded-full mr-4"></div>
            <div className="flex flex-col justify-center">
              <h1 className="font-bold">Titikarn Waitayasuwan</h1>
            </div>
          </div>

          <div className="flex flex-wrap my-2">
            <Link href="" className="bg-blue-700 text-white rounded-md p-2 m-1">
              รหัสวิชา 11010203
            </Link>
            <Link href="" className="bg-blue-700 text-white rounded-md p-2 m-1">
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
              โดยการเปิดคลิป Study with me จะเสมือนมีเพื่อนนั่งอ่านหนังสือหรือนั่งทำงานไปด้วยกัน โดยบางช่องอาจเพิ่มเสียงเพลงประกอบเพื่อสร้างความผ่อนคลายไปด้วย โดยในบทความนี้เราจะมาแนะนำChannel ในYouTube ที่ส่วนตัวเราเองเปิดฟังบ่อยๆค่ะ
              วันนี้เราจะแนะนำ 5 Channel จากในYouTube กันค่ะ
              1.Abao in Tokyo ช่องที่มีผู้ติดตาม 8.75 แสนคน โดยนักศึกษาชาวจีนที่อาศัยอยู่ที่ประเทศญี่ปุ่น ในคลิปจะเป็นการนำเสนอการนั่งทำงานริมหน้าต่าง ที่ประเทศญี่ปุ่น โดยสามารถเห็นวิวของถนนไปด้วย ประกอบกับเสียงฝน และดนตรีบรรเลงเบาๆ ทำให้บรรยากาศดูสบายและผ่อนคลายมากขึ้น
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
              <IoShareOutline className="text-2xl" />
              <AiOutlineNotification
                className="text-2xl cursor-pointer"
                onClick={togglePopup}
              />
              {isPopupOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                  <div className="bg-white p-5 rounded-lg shadow-lg w-full max-w-md">
                    <h2 className="text-lg font-bold mb-4">
                      Notification Popup
                    </h2>
                    <p className="mb-4">
                      This is your notification content.
                    </p>
                    <input
                      type="text"
                      value={popupInput}
                      onChange={(e) => setPopupInput(e.target.value)}
                      placeholder="Enter your message"
                      className="w-full p-2 mb-4 border border-gray-300 rounded"
                    />
                    <div className="flex justify-end">
                      <button
                        onClick={handlePopupSubmit}
                        className="p-2 bg-blue-500 text-white rounded"
                      >
                        Submit
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="mt-5">
            <h1 className="font-bold text-2xl">Comment</h1>
          </div>

          <div className="flex flex-row mt-5 items-start">
            <div className="bg-gray-300 w-9 h-9 flex justify-center items-center rounded-full mr-4"></div>
            <div className="flex flex-col justify-center">
              <h1 className="font-bold">Titikarn Waitayasuwan</h1>
              <p className="font-thin text-sm">8/6/2024</p>
              <p>แจ่มแมวเลยครับพรี่</p>
            </div>
          </div>

          <div className="relative mt-4">
  <input
    type="text"
    value={input1}
    onChange={(e) => setInput1(e.target.value)}
    placeholder="Enter first message"
    className="w-full p-2 mb-2 border border-gray-300 rounded h-36"
    style={{flexDirection:"column", textAlign:"start"}}
  />
  <button
    onClick={handleSubmit}
    className="absolute bottom-2 right-2 w-36 p-2 text-white rounded bg-blue-500 mb-3 mr-1"
    style={{ backgroundColor: "#0B1E48" }}
  >
    Send
  </button>
</div>

        </div>
      </div>
    </main>
    <Footer />
  </Container>
  )
}

export default Blog