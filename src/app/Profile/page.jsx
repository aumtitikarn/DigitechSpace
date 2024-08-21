"use client";

import React, { useState } from "react";
import { IoIosStar } from "react-icons/io";
import { CiHeart } from "react-icons/ci";
import Image from 'next/image'
import Link from 'next/link';
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Container from "../components/Container";
import { useSession } from "next-auth/react";
import QRshare from "../QRshare/page"
import Editprofile from "../EditProfile/page"
import { MdAccountCircle } from "react-icons/md";
import { useTranslation } from "react-i18next";

function page() {
  const [activeButton, setActiveButton] = useState(null);
  const { t, i18n } = useTranslation("translation");

  const handleClick = (button) => {
    setActiveButton(button === activeButton ? null : button);
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
    <main className="flex flex-col md:flex-row w-full justify-center p-4 mt-20">
      <div className="flex flex-col w-full max-w-auto mb-20">

      <div className="flex flex-row justify-center">
      <MdAccountCircle className=" rounded-full text-gray-600" style={{ width:"100px" , height:"100px"}}/>
      </div>

      <div className="flex flex-row justify-center">
        <p style={{fontSize:"24px",fontWeight:"bold"}} className="mt-6">Titikarn Waitayasuwan</p>
      </div>
      
      <div className="flex flex-row justify-center mt-10 mb-10">
      <Link href="/EditProfile" className="bg-blue-500 text-white px-4 py-2 rounded mx-2 hover:bg-blue-600 w-64 flex items-center justify-center" style={{backgroundColor:"#33539B"}}>
      <p>{t("nav.profile.edit")}</p>
      </Link>
      <Link href="/QRshare" className="bg-green-500 text-white px-4 py-2 rounded mx-2 hover:bg-green-600 w-64 flex items-center justify-center" style={{backgroundColor:"#33539B"}}>
      {t("nav.profile.share")}
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
                    <p className="font-bold text-[20px]">{t("nav.profile.project")}</p>
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
                    <p className="font-bold text-[20px]">{t("nav.profile.blog")}</p>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
        {activeButton === "button1" && (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 justify-items-center mt-10 w-full">

    <div className="rounded border-2 w-full max-w-xs flex flex-col m-5">
      <div className="rounded w-full h-96 relative">
      <img
    src="/pexample3.png"
    className="object-cover w-full h-full md:aspect-w-3 md:aspect-h-4 rounded-mb"
    alt="Blog Image"
  />
      </div>
      <div className="p-4">
        <p className="text-lg sm:text-xl font-bold">Hi5 Website</p>

        <div className="flex items-center mt-2">
        <MdAccountCircle className="w-7 h-7 rounded-full mr-2"/>
          <p className="text-sm">Titikarn Waitayasuwan</p>
        </div>

        <div className="flex items-center mt-2">
          <IoIosStar className="text-xl mr-1"/>
          <p className="text-sm mr-2">4.8</p>
          <p className="text-lg mt-1">╵</p>
          <p className="text-sm ml-2">ขายได้ 28</p>
        </div>

        <p className="text-xl sm:text-2xl font-bold text-[#33529B] mt-2">25,000</p>
      </div>
    </div>

    <div className="rounded border-2 w-full max-w-xs flex flex-col m-5">
      <div className="rounded w-full h-96 relative">
      <img
    src="/pexample3.png"
    className="object-cover w-full h-full md:aspect-w-3 md:aspect-h-4 rounded-mb"
    alt="Blog Image"
  />
      </div>
      <div className="p-4">
        <p className="text-lg sm:text-xl font-bold">Hi5 Website</p>

        <div className="flex items-center mt-2">
        <MdAccountCircle className="w-7 h-7 rounded-full mr-2"/>
          <p className="text-sm">Titikarn Waitayasuwan</p>
        </div>

        <div className="flex items-center mt-2">
          <IoIosStar className="text-xl mr-1"/>
          <p className="text-sm mr-2">4.8</p>
          <p className="text-lg mt-1">╵</p>
          <p className="text-sm ml-2">ขายได้ 28</p>
        </div>

        <p className="text-xl sm:text-2xl font-bold text-[#33529B] mt-2">25,000</p>
      </div>
    </div>

    <div className="rounded border-2 w-full max-w-xs flex flex-col m-5">
      <div className="rounded w-full h-96 relative">
      <img
    src="/pexample3.png"
    className="object-cover w-full h-full md:aspect-w-3 md:aspect-h-4 rounded-mb"
    alt="Blog Image"
  />
      </div>
      <div className="p-4">
        <p className="text-lg sm:text-xl font-bold">Hi5 Website</p>

        <div className="flex items-center mt-2">
        <MdAccountCircle className="w-7 h-7 rounded-full mr-2"/>
          <p className="text-sm">Titikarn Waitayasuwan</p>
        </div>

        <div className="flex items-center mt-2">
          <IoIosStar className="text-xl mr-1"/>
          <p className="text-sm mr-2">4.8</p>
          <p className="text-lg mt-1">╵</p>
          <p className="text-sm ml-2">ขายได้ 28</p>
        </div>

        <p className="text-xl sm:text-2xl font-bold text-[#33529B] mt-2">25,000</p>
      </div>
    </div>

    <div className="rounded border-2 w-full max-w-xs flex flex-col m-5">
      <div className="rounded w-full h-96 relative">
      <img
    src="/pexample3.png"
    className="object-cover w-full h-full md:aspect-w-3 md:aspect-h-4 rounded-mb"
    alt="Blog Image"
  />
      </div>
      <div className="p-4">
        <p className="text-lg sm:text-xl font-bold">Hi5 Website</p>

        <div className="flex items-center mt-2">
        <MdAccountCircle className="w-7 h-7 rounded-full mr-2"/>
          <p className="text-sm">Titikarn Waitayasuwan</p>
        </div>

        <div className="flex items-center mt-2">
          <IoIosStar className="text-xl mr-1"/>
          <p className="text-sm mr-2">4.8</p>
          <p className="text-lg mt-1">╵</p>
          <p className="text-sm ml-2">ขายได้ 28</p>
        </div>

        <p className="text-xl sm:text-2xl font-bold text-[#33529B] mt-2">25,000</p>
      </div>
    </div>

    <div className="rounded border-2 w-full max-w-xs flex flex-col m-5">
      <div className="rounded w-full h-96 relative">
      <img
    src="/pexample3.png"
    className="object-cover w-full h-full md:aspect-w-3 md:aspect-h-4 rounded-mb"
    alt="Blog Image"
  />
      </div>
      <div className="p-4">
        <p className="text-lg sm:text-xl font-bold">Hi5 Website</p>

        <div className="flex items-center mt-2">
        <MdAccountCircle className="w-7 h-7 rounded-full mr-2"/>
          <p className="text-sm">Titikarn Waitayasuwan</p>
        </div>

        <div className="flex items-center mt-2">
          <IoIosStar className="text-xl mr-1"/>
          <p className="text-sm mr-2">4.8</p>
          <p className="text-lg mt-1">╵</p>
          <p className="text-sm ml-2">ขายได้ 28</p>
        </div>

        <p className="text-xl sm:text-2xl font-bold text-[#33529B] mt-2">25,000</p>
      </div>
    </div>

    <div className="rounded border-2 w-full max-w-xs flex flex-col m-5">
      <div className="rounded w-full h-96 relative">
      <img
    src="/pexample3.png"
    className="object-cover w-full h-full md:aspect-w-3 md:aspect-h-4 rounded-mb"
    alt="Blog Image"
  />
      </div>
      <div className="p-4">
        <p className="text-lg sm:text-xl font-bold">Hi5 Website</p>

        <div className="flex items-center mt-2">
        <MdAccountCircle className="w-7 h-7 rounded-full mr-2"/>
          <p className="text-sm">Titikarn Waitayasuwan</p>
        </div>

        <div className="flex items-center mt-2">
          <IoIosStar className="text-xl mr-1"/>
          <p className="text-sm mr-2">4.8</p>
          <p className="text-lg mt-1">╵</p>
          <p className="text-sm ml-2">ขายได้ 28</p>
        </div>

        <p className="text-xl sm:text-2xl font-bold text-[#33529B] mt-2">25,000</p>
      </div>
    </div>

    <div className="rounded border-2 w-full max-w-xs flex flex-col m-5">
      <div className="rounded w-full h-96 relative">
      <img
    src="/pexample3.png"
    className="object-cover w-full h-full md:aspect-w-3 md:aspect-h-4 rounded-mb"
    alt="Blog Image"
  />
      </div>
      <div className="p-4">
        <p className="text-lg sm:text-xl font-bold">Hi5 Website</p>

        <div className="flex items-center mt-2">
        <MdAccountCircle className="w-7 h-7 rounded-full mr-2"/>
          <p className="text-sm">Titikarn Waitayasuwan</p>
        </div>

        <div className="flex items-center mt-2">
          <IoIosStar className="text-xl mr-1"/>
          <p className="text-sm mr-2">4.8</p>
          <p className="text-lg mt-1">╵</p>
          <p className="text-sm ml-2">ขายได้ 28</p>
        </div>

        <p className="text-xl sm:text-2xl font-bold text-[#33529B] mt-2">25,000</p>
      </div>
    </div>

    <div className="rounded border-2 w-full max-w-xs flex flex-col m-5">
      <div className="rounded w-full h-96 relative">
      <img
    src="/pexample3.png"
    className="object-cover w-full h-full md:aspect-w-3 md:aspect-h-4 rounded-mb"
    alt="Blog Image"
  />
      </div>
      <div className="p-4">
        <p className="text-lg sm:text-xl font-bold">Hi5 Website</p>

        <div className="flex items-center mt-2">
        <MdAccountCircle className="w-7 h-7 rounded-full mr-2"/>
          <p className="text-sm">Titikarn Waitayasuwan</p>
        </div>

        <div className="flex items-center mt-2">
          <IoIosStar className="text-xl mr-1"/>
          <p className="text-sm mr-2">4.8</p>
          <p className="text-lg mt-1">╵</p>
          <p className="text-sm ml-2">ขายได้ 28</p>
        </div>

        <p className="text-xl sm:text-2xl font-bold text-[#33529B] mt-2">25,000</p>
      </div>
    </div>

    <div className="rounded border-2 w-full max-w-xs flex flex-col m-5">
      <div className="rounded w-full h-96 relative">
      <img
    src="/pexample3.png"
    className="object-cover w-full h-full md:aspect-w-3 md:aspect-h-4 rounded-mb"
    alt="Blog Image"
  />
      </div>
      <div className="p-4">
        <p className="text-lg sm:text-xl font-bold">Hi5 Website</p>

        <div className="flex items-center mt-2">
        <MdAccountCircle className="w-7 h-7 rounded-full mr-2"/>
          <p className="text-sm">Titikarn Waitayasuwan</p>
        </div>

        <div className="flex items-center mt-2">
          <IoIosStar className="text-xl mr-1"/>
          <p className="text-sm mr-2">4.8</p>
          <p className="text-lg mt-1">╵</p>
          <p className="text-sm ml-2">ขายได้ 28</p>
        </div>

        <p className="text-xl sm:text-2xl font-bold text-[#33529B] mt-2">25,000</p>
      </div>
    </div>

    <div className="rounded border-2 w-full max-w-xs flex flex-col m-5">
      <div className="rounded w-full h-96 relative">
      <img
    src="/pexample3.png"
    className="object-cover w-full h-full md:aspect-w-3 md:aspect-h-4 rounded-mb"
    alt="Blog Image"
  />
      </div>
      <div className="p-4">
        <p className="text-lg sm:text-xl font-bold">Hi5 Website</p>

        <div className="flex items-center mt-2">
        <MdAccountCircle className="w-7 h-7 rounded-full mr-2"/>
          <p className="text-sm">Titikarn Waitayasuwan</p>
        </div>

        <div className="flex items-center mt-2">
          <IoIosStar className="text-xl mr-1"/>
          <p className="text-sm mr-2">4.8</p>
          <p className="text-lg mt-1">╵</p>
          <p className="text-sm ml-2">ขายได้ 28</p>
        </div>

        <p className="text-xl sm:text-2xl font-bold text-[#33529B] mt-2">25,000</p>
      </div>
    </div>

    <div className="rounded border-2 w-full max-w-xs flex flex-col m-5">
      <div className="rounded w-full h-96 relative">
      <img
    src="/pexample3.png"
    className="object-cover w-full h-full md:aspect-w-3 md:aspect-h-4 rounded-mb"
    alt="Blog Image"
  />
      </div>
      <div className="p-4">
        <p className="text-lg sm:text-xl font-bold">Hi5 Website</p>

        <div className="flex items-center mt-2">
        <MdAccountCircle className="w-7 h-7 rounded-full mr-2"/>
          <p className="text-sm">Titikarn Waitayasuwan</p>
        </div>

        <div className="flex items-center mt-2">
          <IoIosStar className="text-xl mr-1"/>
          <p className="text-sm mr-2">4.8</p>
          <p className="text-lg mt-1">╵</p>
          <p className="text-sm ml-2">ขายได้ 28</p>
        </div>

        <p className="text-xl sm:text-2xl font-bold text-[#33529B] mt-2">25,000</p>
      </div>
    </div>

    <div className="rounded border-2 w-full max-w-xs flex flex-col m-5">
      <div className="rounded w-full h-96 relative">
      <img
    src="/pexample3.png"
    className="object-cover w-full h-full md:aspect-w-3 md:aspect-h-4 rounded-mb"
    alt="Blog Image"
  />
      </div>
      <div className="p-4">
        <p className="text-lg sm:text-xl font-bold">Hi5 Website</p>

        <div className="flex items-center mt-2">
        <MdAccountCircle className="w-7 h-7 rounded-full mr-2"/>
          <p className="text-sm">Titikarn Waitayasuwan</p>
        </div>

        <div className="flex items-center mt-2">
          <IoIosStar className="text-xl mr-1"/>
          <p className="text-sm mr-2">4.8</p>
          <p className="text-lg mt-1">╵</p>
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
      <img
    src="https://64.media.tumblr.com/52eaf78ffa891980b680c5e12b15437e/tumblr_pmhq6nlBzJ1tk9psf_1280.jpg"
    className="object-cover w-full h-full md:aspect-w-3 md:aspect-h-4 rounded-mb"
    alt="Blog Image"
  />
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
          <MdAccountCircle className="w-7 h-7 rounded-full mr-2 mt-2"/>
          <p className="mt-3" style={{fontSize:"14px"}}>Titikarn Waitayasuwan</p>
        </div>
      </div>
    </div>

    <div className="rounded border-2 w-full max-w-xs flex flex-col m-5">
      <div className="rounded w-full h-96 relative">
      <img
    src="https://64.media.tumblr.com/52eaf78ffa891980b680c5e12b15437e/tumblr_pmhq6nlBzJ1tk9psf_1280.jpg"
    className="object-cover w-full h-full md:aspect-w-3 md:aspect-h-4 rounded-mb"
    alt="Blog Image"
  />
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
        <MdAccountCircle className="w-7 h-7 rounded-full mr-2 mt-2"/>
          <p className="mt-3" style={{fontSize:"14px"}}>Titikarn Waitayasuwan</p>
        </div>
      </div>
    </div>

    <div className="rounded border-2 w-full max-w-xs flex flex-col m-5">
      <div className="rounded w-full h-96 relative">
      <img
    src="https://64.media.tumblr.com/52eaf78ffa891980b680c5e12b15437e/tumblr_pmhq6nlBzJ1tk9psf_1280.jpg"
    className="object-cover w-full h-full md:aspect-w-3 md:aspect-h-4 rounded-mb"
    alt="Blog Image"
  />
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
        <MdAccountCircle className="w-7 h-7 rounded-full mr-2 mt-2"/>
          <p className="mt-3" style={{fontSize:"14px"}}>Titikarn Waitayasuwan</p>
        </div>
      </div>
    </div>

    <div className="rounded border-2 w-full max-w-xs flex flex-col m-5">
      <div className="rounded w-full h-96 relative">
      <img
    src="https://64.media.tumblr.com/52eaf78ffa891980b680c5e12b15437e/tumblr_pmhq6nlBzJ1tk9psf_1280.jpg"
    className="object-cover w-full h-full md:aspect-w-3 md:aspect-h-4 rounded-mb"
    alt="Blog Image"
  />
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
          <MdAccountCircle className="w-7 h-7 rounded-full mr-2 mt-2"/>
          <p className="mt-3" style={{fontSize:"14px"}}>Titikarn Waitayasuwan</p>
        </div>
      </div>
    </div>

    <div className="rounded border-2 w-full max-w-xs flex flex-col m-5">
      <div className="rounded w-full h-96 relative">
      <img
    src="https://64.media.tumblr.com/52eaf78ffa891980b680c5e12b15437e/tumblr_pmhq6nlBzJ1tk9psf_1280.jpg"
    className="object-cover w-full h-full md:aspect-w-3 md:aspect-h-4 rounded-mb"
    alt="Blog Image"
  />
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
          <MdAccountCircle className="w-7 h-7 rounded-full mr-2 mt-2"/>
          <p className="mt-3" style={{fontSize:"14px"}}>Titikarn Waitayasuwan</p>
        </div>
      </div>
    </div>

    <div className="rounded border-2 w-full max-w-xs flex flex-col m-5">
      <div className="rounded w-full h-96 relative">
      <img
    src="https://64.media.tumblr.com/52eaf78ffa891980b680c5e12b15437e/tumblr_pmhq6nlBzJ1tk9psf_1280.jpg"
    className="object-cover w-full h-full md:aspect-w-3 md:aspect-h-4 rounded-mb"
    alt="Blog Image"
  />
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
          <MdAccountCircle className="w-7 h-7 rounded-full mr-2 mt-2"/>
          <p className="mt-3" style={{fontSize:"14px"}}>Titikarn Waitayasuwan</p>
        </div>
      </div>
    </div>

    <div className="rounded border-2 w-full max-w-xs flex flex-col m-5">
      <div className="rounded w-full h-96 relative">
      <img
    src="https://64.media.tumblr.com/52eaf78ffa891980b680c5e12b15437e/tumblr_pmhq6nlBzJ1tk9psf_1280.jpg"
    className="object-cover w-full h-full md:aspect-w-3 md:aspect-h-4 rounded-mb"
    alt="Blog Image"
  />
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
          <MdAccountCircle className="w-7 h-7 rounded-full mr-2 mt-2"/>
          <p className="mt-3" style={{fontSize:"14px"}}>Titikarn Waitayasuwan</p>
        </div>
      </div>
    </div>

    <div className="rounded border-2 w-full max-w-xs flex flex-col m-5">
      <div className="rounded w-full h-96 relative">
      <img
    src="https://64.media.tumblr.com/52eaf78ffa891980b680c5e12b15437e/tumblr_pmhq6nlBzJ1tk9psf_1280.jpg"
    className="object-cover w-full h-full md:aspect-w-3 md:aspect-h-4 rounded-mb"
    alt="Blog Image"
  />
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
          <MdAccountCircle className="w-7 h-7 rounded-full mr-2 mt-2"/>
          <p className="mt-3" style={{fontSize:"14px"}}>Titikarn Waitayasuwan</p>
        </div>
      </div>
    </div>

    <div className="rounded border-2 w-full max-w-xs flex flex-col m-5">
      <div className="rounded w-full h-96 relative">
      <img
    src="https://64.media.tumblr.com/52eaf78ffa891980b680c5e12b15437e/tumblr_pmhq6nlBzJ1tk9psf_1280.jpg"
    className="object-cover w-full h-full md:aspect-w-3 md:aspect-h-4 rounded-mb"
    alt="Blog Image"
  />
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
          <MdAccountCircle className="w-7 h-7 rounded-full mr-2 mt-2"/>
          <p className="mt-3" style={{fontSize:"14px"}}>Titikarn Waitayasuwan</p>
        </div>
      </div>
    </div>

    <div className="rounded border-2 w-full max-w-xs flex flex-col m-5">
      <div className="rounded w-full h-96 relative">
      <img
    src="https://64.media.tumblr.com/52eaf78ffa891980b680c5e12b15437e/tumblr_pmhq6nlBzJ1tk9psf_1280.jpg"
    className="object-cover w-full h-full md:aspect-w-3 md:aspect-h-4 rounded-mb"
    alt="Blog Image"
  />
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
          <MdAccountCircle className="w-7 h-7 rounded-full mr-2 mt-2"/>
          <p className="mt-3" style={{fontSize:"14px"}}>Titikarn Waitayasuwan</p>
        </div>
      </div>
    </div>

    <div className="rounded border-2 w-full max-w-xs flex flex-col m-5">
      <div className="rounded w-full h-96 relative">
      <img
    src="https://64.media.tumblr.com/52eaf78ffa891980b680c5e12b15437e/tumblr_pmhq6nlBzJ1tk9psf_1280.jpg"
    className="object-cover w-full h-full md:aspect-w-3 md:aspect-h-4 rounded-mb"
    alt="Blog Image"
  />
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
          <MdAccountCircle className="w-7 h-7 rounded-full mr-2 mt-2"/>
          <p className="mt-3" style={{fontSize:"14px"}}>Titikarn Waitayasuwan</p>
        </div>
      </div>
    </div>

    <div className="rounded border-2 w-full max-w-xs flex flex-col m-5">
      <div className="rounded w-full h-96 relative">
      <img
    src="https://64.media.tumblr.com/52eaf78ffa891980b680c5e12b15437e/tumblr_pmhq6nlBzJ1tk9psf_1280.jpg"
    className="object-cover w-full h-full md:aspect-w-3 md:aspect-h-4 rounded-mb"
    alt="Blog Image"
  />
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
          <MdAccountCircle className="w-7 h-7 rounded-full mr-2 mt-2"/>
          <p className="mt-3" style={{fontSize:"14px"}}>Titikarn Waitayasuwan</p>
        </div>
      </div>
    </div>

  </div>
)}
      </div>
    </main>
    <Footer />
    </Container>
  );
}

export default page;
