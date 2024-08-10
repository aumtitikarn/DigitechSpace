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
    
  const [input1, setInput1] = useState("");

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
        <Navbar session={session}/>
        <main className="flex justify-center w-full p-1 m-5">
    <div className="flex flex-col w-full max-w-screen-lg">
    <div style={{borderRadius:"50px"}} className="w-full h-96 flex justify-center border-2">
      <img src="https://64.media.tumblr.com/52eaf78ffa891980b680c5e12b15437e/tumblr_pmhq6nlBzJ1tk9psf_1280.jpg" className="object-cover h-full w-full" style={{borderRadius:"15px"}} />
    </div>

    <div className="flex flex-row m-5 ml-0 sm:ml-10 items-center">
    <div className="bg-gray-300 w-9 h-9 sm:w-7 sm:h-7 md:w-9 md:h-9 flex justify-center items-center rounded-full mr-4">
        {/* <img src="" className="object-cover h-full w-full" style={{borderRadius:"100%"}} /> */}
        </div>
      <div className="flex flex-col justify-center w-full">
        <h1 className="font-bold">Titikarn Waitayasuwan</h1>
      </div>
    </div>

    <div className="flex flex-row mt-3 mb-3 ml-0 sm:ml-10">
      <Link href="" className="w-auto h-7 rounded-md ml-2 flex items-center justify-center text-white p-3" style={{backgroundColor:"#33529B"}}><p>รหัสวิชา 11010203</p></Link>
      <Link href="" className="w-auto h-7 rounded-md ml-2 flex items-center justify-center text-white p-3" style={{backgroundColor:"#33529B"}}><p>Datasets</p></Link>
    </div>

    <div className="flex flex-row ml-0 sm:ml-10 mt-5">
      <div className="flex flex-col justify-center w-full">
        <h1 className="font-bold text-lg text-2xl">แนะนำ Study With Me ฉบับเด็กมทส.</h1>
      </div>
    </div>

    <div className="flex flex-row ml-0 sm:ml-10 mt-2  mb-3">
      <div className="flex flex-col justify-center w-full">
        <p>
        โดยการเปิดคลิป Study with me จะเสมือนมีเพื่อนนั่งอ่านหนังสือหรือนั่งทำงานไปด้วยกัน โดยบางช่องอาจเพิ่มเสียงเพลงประกอบเพื่อสร้างความผ่อนคลายไปด้วย โดยในบทความนี้เราจะมาแนะนำChannel ในYouTube ที่ส่วนตัวเราเองเปิดฟังบ่อยๆค่ะ
วันนี้เราจะแนะนำ 5 Channel จากในYouTube กันค่ะ

1.Abao in Tokyo
ช่องที่มีผู้ติดตาม 8.75 แสนคน โดยนักศึกษาชาวจีนที่อาศัยอยู่ที่ประเทศญี่ปุ่น ในคลิปจะเป็นการนำเสนอการนั่งทำงานริมหน้าต่าง ที่ประเทศญี่ปุ่น โดยสามารถเห็นวิวของถนนไปด้วย ประกอบกับเสียงฝน และดนตรีบรรเลงเบาๆ ทำให้บรรยากาศดูสบายและผ่อนคลายมากขึ้น
        </p>
      </div>
    </div>

    <div className="flex justify-between items-center border-b-2 border-t-2 border-gray-200 m-5 py-3">
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
        <Link href="">
        <AiOutlineNotification className="text-2xl" />
        </Link>
      </div>
    </div>

    <div className="flex flex-row ml-0 sm:ml-10 mt-5">
      <div className="flex flex-col justify-center w-full">
        <h1 className="font-bold text-2xl">Comment</h1>
      </div>
    </div>

    <div className="flex flex-row m-5 ml-0 sm:ml-10 items-start">
    <div className="bg-gray-300 w-9 h-9 sm:w-7 sm:h-7 md:w-9 md:h-9 flex justify-center items-center rounded-full mr-4"></div>
      <div className="flex flex-col justify-center w-full">
        <h1 className="font-bold">Titikarn Waitayasuwan</h1>
        <p className="font-thin text-sm">8/6/2024</p>
        <p>แจ่มแมวเลยครับพรี่</p>
      </div>
    </div>

    <div className="mt-4">
      <input
        type="text"
        value={input1}
        onChange={(e) => setInput1(e.target.value)}
        placeholder="Enter first message"
        className="w-full p-2 mb-2 border border-gray-300 rounded h-36"
      />
      <button
        onClick={handleSubmit}
        className="w-full sm:w-36 p-2 text-white rounded bg-blue-500"
        style={{ backgroundColor: "#0B1E48" }}
      >
        Send
      </button>
    </div>
  </div>
</main>

      <Footer/>
    </Container>  
  )
}

export default Blog