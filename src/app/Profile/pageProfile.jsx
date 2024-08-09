"use client";

import React, { useState } from "react";
import { IoIosStar } from "react-icons/io";
import { CiHeart } from "react-icons/ci";
import Image from 'next/image'
import Link from 'next/link';

function pageProfile() {
  const [activeButton, setActiveButton] = useState(null);

  const handleClick = (button) => {
    setActiveButton(button === activeButton ? null : button);
  };

  return (
    <main className="flex flex-col md:flex-row w-full justify-center p-4">
      <div className="flex flex-col w-full max-w-auto">

      <div className="flex flex-row justify-center">
      <div className="bg-gray-300 w-40 h-40 rounded-full">
      </div>
      </div>

      <div className="flex flex-row justify-center">
        <p style={{fontSize:"24px",fontWeight:"bold"}} className="mt-6">Titikarn Waitayasuwan</p>
      </div>

      <div className="flex flex-row justify-center mt-10">
      <Link href="" className="bg-blue-500 text-white px-4 py-2 rounded mx-2 hover:bg-blue-600 w-64 flex items-center justify-center" style={{backgroundColor:"#33539B"}}>
      <p>แก้ไขโปรไฟล์</p>
      </Link>
      <Link href="" className="bg-green-500 text-white px-4 py-2 rounded mx-2 hover:bg-green-600 w-64 flex items-center justify-center" style={{backgroundColor:"#33539B"}}>
      แชร์โปรไฟล์
      </Link>
      </div>

        <div className="flex flex-row justify-center space-x-4 mt-4 w-full">
          <div className="flex flex-row" style={{ width: "100%" }}>
            <div className="flex flex-col" style={{ width: "100%" }}>
              <div className="flex flex-col" style={{ width: "100%" }}>
                <button
                  onClick={() => handleClick("button1")}
                  className={`flex flex-row justify-center p-2 bg-white flex-grow ${
                    activeButton === "button1"
                      ? "border-b-indigo-700 border-b-4"
                      : ""
                  }`}
                >
                  <div className="flex flex-col justify-center w-auto h-10">
                    <p>Project 1</p>
                  </div>
                </button>
              </div>
            </div>
            <div className="flex flex-col" style={{ width: "100%" }}>
              <div className="flex flex-col" style={{ width: "100%" }}>
                <button
                  onClick={() => handleClick("button2")}
                  className={`flex flex-row justify-center p-2 bg-white flex-grow ${
                    activeButton === "button2"
                      ? "border-b-indigo-700 border-b-4"
                      : ""
                  }`}
                >
                  <div className="flex flex-col justify-center w-auto h-10">
                    <p>Project 2</p>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
        {activeButton === "button1" && (
  <div className="flex flex-col mt-10 w-full">
    <div className="rounded border-2 w-full flex flex-col sm:flex-row h-auto sm:h-40 mt-5">
      <div className="rounded w-full sm:w-64 h-64 sm:h-40 relative">
        <Image src="/Image/Timg.png" layout="fill" objectFit="cover" className="rounded"/>
      </div>
      <div className="p-5">
        <p className="text-lg sm:text-xl font-bold">Hi5 Website</p>

        <div className="flex items-center mt-2">
          <div className="w-7 h-7 bg-slate-400 rounded-full mr-2"></div>
          <p className="text-sm">Titikarn Waitayasuwan</p>
        </div>

        <div className="flex items-center mt-2">
          <IoIosStar className="text-xl mr-1"/>
          <p className="text-sm mr-2">4.8</p>
          <p className="text-lg">╵</p>
          <p className="text-sm ml-2">ขายได้ 28</p>
        </div>

        <p className="text-xl sm:text-2xl font-bold text-[#33529B] mt-2">25,000</p>
      </div>
    </div>

    <div className="rounded border-2 w-full flex flex-col sm:flex-row h-auto sm:h-40 mt-5">
      <div className="rounded w-full sm:w-64 h-64 sm:h-40 relative">
        <Image src="/Image/Timg.png" layout="fill" objectFit="cover" className="rounded"/>
      </div>
      <div className="p-5">
        <p className="text-lg sm:text-xl font-bold">Hi5 Website</p>

        <div className="flex items-center mt-2">
          <div className="w-7 h-7 bg-slate-400 rounded-full mr-2"></div>
          <p className="text-sm">Titikarn Waitayasuwan</p>
        </div>

        <div className="flex items-center mt-2">
          <IoIosStar className="text-xl mr-1"/>
          <p className="text-sm mr-2">4.8</p>
          <p className="text-lg">╵</p>
          <p className="text-sm ml-2">ขายได้ 28</p>
        </div>

        <p className="text-xl sm:text-2xl font-bold text-[#33529B] mt-2">25,000</p>
      </div>
    </div>
  </div>
)}

{activeButton === "button2" && (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 justify-items-center mt-10 w-full">
    <div className="rounded border-2 w-full max-w-xs flex flex-col m-5">
      <div className="rounded w-full h-96 relative">
        <Image src="/Image/Timg.png" layout="fill" objectFit="cover" className="rounded"/>
      </div>
      <div className="ml-5 mt-2">
        <div className="flex flex-col mt-1 justify-center">
          <div className="flex flex-row">
            <p style={{fontSize:"20px",fontWeight:"bold"}}>แนะนำ Study With</p>
            <p className="w-10 h-10 ml-1">
              <CiHeart style={{ fontSize: "32px" }} />
            </p>
            <p className="mt-1">
              500
            </p>
          </div>
        </div>
        <div className="flex flex-row mb-3">
          <div className="w-7 h-7 bg-slate-400 rounded-full mr-2 mt-2"></div>
          <p className="mt-3" style={{fontSize:"14px"}}>Titikarn Waitayasuwan</p>
        </div>
      </div>
    </div>

    <div className="rounded border-2 w-full max-w-xs flex flex-col m-5">
      <div className="rounded w-full h-96 relative">
        <Image src="/Image/Timg.png" layout="fill" objectFit="cover" className="rounded"/>
      </div>
      <div className="ml-5 mt-2">
        <div className="flex flex-col mt-1 justify-center">
          <div className="flex flex-row">
            <p style={{fontSize:"20px",fontWeight:"bold"}}>แนะนำ Study With</p>
            <p className="w-10 h-10 ml-1">
              <CiHeart style={{ fontSize: "32px" }} />
            </p>
            <p className="mt-1">
              500
            </p>
          </div>
        </div>
        <div className="flex flex-row mb-3">
          <div className="w-7 h-7 bg-slate-400 rounded-full mr-2 mt-2"></div>
          <p className="mt-3" style={{fontSize:"14px"}}>Titikarn Waitayasuwan</p>
        </div>
      </div>
    </div>

    <div className="rounded border-2 w-full max-w-xs flex flex-col m-5">
      <div className="rounded w-full h-96 relative">
        <Image src="/Image/Timg.png" layout="fill" objectFit="cover" className="rounded"/>
      </div>
      <div className="ml-5 mt-2">
        <div className="flex flex-col mt-1 justify-center">
          <div className="flex flex-row">
            <p style={{fontSize:"20px",fontWeight:"bold"}}>แนะนำ Study With</p>
            <p className="w-10 h-10 ml-1">
              <CiHeart style={{ fontSize: "32px" }} />
            </p>
            <p className="mt-1">
              500
            </p>
          </div>
        </div>
        <div className="flex flex-row mb-3">
          <div className="w-7 h-7 bg-slate-400 rounded-full mr-2 mt-2"></div>
          <p className="mt-3" style={{fontSize:"14px"}}>Titikarn Waitayasuwan</p>
        </div>
      </div>
    </div>

    <div className="rounded border-2 w-full max-w-xs flex flex-col m-5">
      <div className="rounded w-full h-96 relative">
        <Image src="/Image/Timg.png" layout="fill" objectFit="cover" className="rounded"/>
      </div>
      <div className="ml-5 mt-2">
        <div className="flex flex-col mt-1 justify-center">
          <div className="flex flex-row">
            <p style={{fontSize:"20px",fontWeight:"bold"}}>แนะนำ Study With</p>
            <p className="w-10 h-10 ml-1">
              <CiHeart style={{ fontSize: "32px" }} />
            </p>
            <p className="mt-1">
              500
            </p>
          </div>
        </div>
        <div className="flex flex-row mb-3">
          <div className="w-7 h-7 bg-slate-400 rounded-full mr-2 mt-2"></div>
          <p className="mt-3" style={{fontSize:"14px"}}>Titikarn Waitayasuwan</p>
        </div>
      </div>
    </div>

    <div className="rounded border-2 w-full max-w-xs flex flex-col m-5">
      <div className="rounded w-full h-96 relative">
        <Image src="/Image/Timg.png" layout="fill" objectFit="cover" className="rounded"/>
      </div>
      <div className="ml-5 mt-2">
        <div className="flex flex-col mt-1 justify-center">
          <div className="flex flex-row">
            <p style={{fontSize:"20px",fontWeight:"bold"}}>แนะนำ Study With</p>
            <p className="w-10 h-10 ml-1">
              <CiHeart style={{ fontSize: "32px" }} />
            </p>
            <p className="mt-1">
              500
            </p>
          </div>
        </div>
        <div className="flex flex-row mb-3">
          <div className="w-7 h-7 bg-slate-400 rounded-full mr-2 mt-2"></div>
          <p className="mt-3" style={{fontSize:"14px"}}>Titikarn Waitayasuwan</p>
        </div>
      </div>
    </div>

  </div>
)}
      </div>
    </main>
  );
}

export default pageProfile;
