"use client";

import React, { useState } from "react";
import { AiOutlineNotification,AiOutlineToTop } from "react-icons/ai";
import { IoChatbubbleEllipses,IoShareOutline } from "react-icons/io5";
import { CiHeart } from "react-icons/ci";
import { Navbar } from "react-bootstrap";
import Footer from "../components/Footer";

function Blog() {
    
  const [input1, setInput1] = useState("");

  const handleSubmit = () => {
    alert(`Input 1: ${input1}`);
    setInput1("");
  };

  return (
    
      <main className='flex flex-row justify-center w-full p-4'>
        <Navbar/>
    <div className='flex flex-col max-w-auto w-full'>
    
        <div className='bg-[#ffff] w-auto h-96 flex justify-center border-2 border-black-500 rounded-md'>
        {/* <img src={T1} width="100" height="100" /> */}
        </div>
    <div className='flex flex-row m-5 ml-10'>
        <div style={{backgroundColor:"#1111", width: "40px", height: "40px", justifyContent: "center", borderRadius: "50px", marginRight: "10px"}}>
            <h1></h1>
        </div>
        <div style={{justifyContent: "center", width: "800px"}} className='flex flex-col justify-center'>
            <h1 className='font-bold'>Titikarn Waitayasuwan</h1>
        </div>
    </div>
    <div className='flex flex-row m-5'>
    <div style={{backgroundColor:"#1111", width: "140px", height: "20px", justifyContent: "center", borderRadius: "5px", marginRight: "10px"}}>
            <h1></h1>
        </div>
    </div>
    <div className='flex flex-row ml-5 mt-5'>
        <div style={{justifyContent: "center", width: "800px"}} className='flex flex-col justify-center'>
            <h1 className='font-bold text-lg' style={{fontSize:"24px"}}>PageBlog</h1>
        </div>
    </div>
    <div className='flex flex-row ml-5 mt-2'>
        <div style={{justifyContent: "center", width: "auto"}} className='flex flex-col justify-center'>
            <p>โดยการเปิดคลิป Study with me จะเสมือนมีเพื่อนนั่งอ่านหนังสือหรือนั่งทำงานไปด้วยกัน โดยบางช่องอาจเพิ่มเสียงเพลงประกอบเพื่อสร้างความผ่อนคลายไปด้วย โดยในบทความนี้เราจะมาแนะนำChannel ในYouTube ที่ส่วนตัวเราเองเปิดฟังบ่อยๆค่ะ
วันนี้เราจะแนะนำ 5 Channel จากในYouTube กันค่ะ

1.Abao in Tokyo
ช่องที่มีผู้ติดตาม 8.75 แสนคน โดยนักศึกษาชาวจีนที่อาศัยอยู่ที่ประเทศญี่ปุ่น ในคลิปจะเป็นการนำเสนอการนั่งทำงานริมหน้าต่าง ที่ประเทศญี่ปุ่น โดยสามารถเห็นวิวของถนนไปด้วย ประกอบกับเสียงฝน และดนตรีบรรเลงเบาๆ ทำให้บรรยากาศดูสบายและผ่อนคลายมากขึ้น
            </p>
        </div>
    </div>
    <div className='w-auto h-14 flex justify-center border-b-2 border-t-2 border-black-100 m-5 justify-between'>
        <div className="flex flex-row mt-3">
            <div className="flex flex-row mr-4">
            <p className="w-10 h-10">
             <CiHeart style={{ fontSize: "32px" }} />
            </p>
            <p className="mt-1">
            500
            </p>
            </div>
            <div className="flex flex-row">
            <p className="w-10 h-10">
             <IoChatbubbleEllipses style={{ fontSize: "30px" }}/>
            </p>
            <p className="mt-1">
            1
            </p>
            </div>
        </div>
        <div className="flex flex-row mt-3">
            <div>
            <p className="w-10 h-10">
             <IoShareOutline style={{ fontSize: "30px" }}/>
            </p>    
            </div>
            <div>
            <p className="w-10 h-10 ml-2">    
             <AiOutlineNotification style={{ fontSize: "30px" }}/>
            </p>    
            </div> 
        </div>    
    </div>
    <div className='flex flex-row ml-5 mt-5'>
        <div style={{justifyContent: "center", width: "800px"}} className='flex flex-col justify-center'>
            <h1 style={{fontSize:"24px"}} className='font-bold text-lg'>Comment</h1>
        </div>
    </div>
    <div className='flex flex-row m-5 ml-10'>
        <div style={{backgroundColor:"#1111", width: "40px", height: "40px", justifyContent: "center", borderRadius: "50px", marginRight: "10px"}}>
            <h1></h1>
        </div>
        <div style={{justifyContent: "center", width: "800px"}} className='flex flex-col justify-center'>
            <h1 className='font-bold'>Titikarn Waitayasuwan</h1>
            <p className='font-thin text-sm'>8/6/2024</p>
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
              className="w-36 p-2 text-white bg-blue-500 rounded"
              style={{backgroundColor:"#0B1E48"}}
            >
              Send
            </button>
          </div>
          <Footer/>
    </div>
    
      </main>
  )
}

export default Blog