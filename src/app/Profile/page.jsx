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
import QRshare from "./QRshare/page"
import Editprofile from "./EditProfile/page"
import { MdAccountCircle } from "react-icons/md";
import { useTranslation } from "react-i18next";
import { FaPlus } from "react-icons/fa6";

function page() {
  const [activeButton, setActiveButton] = useState("button1");  // Set initial state to "button1"
  const { t, i18n } = useTranslation("translation");
  const [activeButton1] = useState("button1");

  const handleClick = (button) => {
    setActiveButton(button === activeButton ? null : button);
  };

  const { data: session, status } = useSession();

  console.log("this is id kub "+session._id)
    
  if (status === "loading") {
      return <p>Loading...</p>;
    }

    // const getPosts = async ()=> {

    //   try{
    //     const res = await fetch("http://localhost:3000/api/posts",{
    //       cache:"no-store"
    //     })
  
    //     if(!res.ok){
    //       throw new Error("Failed of fetch posts")
    //     }
  
    //     const data = await res.json();
    //     console.log("Fetched Data: ", data); // Log the data to inspect its structure
    //     setPostData(data.posts);
    //     console.log(data); // Check the structure here
    //     setPostData(data.posts); // Make sure data.posts exists
  
    //   } catch(error) {
    //     console.log("Error loading posts: ",error);
    //   }
    // }
  
    // useEffect(()=>{
    //   getPosts();
    // },[]);


    const products = [
      {
        image:
          "https://cdn.stock2morrow.com/upload/book/1555_s2m-standard-banner-5.jpg",
        name: "Hi5 Website",
        author: "Titikarn Waitayasuwan",
        rating: "4.8",
        reviews: 28,
        sold: 29,
        price: "50,000",
      },
      {
        image:
          "https://cdn.stock2morrow.com/upload/book/1555_s2m-standard-banner-5.jpg",
        name: "Hi5 Website",
        author: "Titikarn Waitayasuwan",
        rating: "4.8",
        reviews: 28,
        sold: 29,
        price: "50,000",
      },
      {
        image:
          "https://cdn.stock2morrow.com/upload/book/1555_s2m-standard-banner-5.jpg",
        name: "Hi5 Website",
        author: "Titikarn Waitayasuwan",
        rating: "4.8",
        reviews: 28,
        sold: 29,
        price: "50,000",
      },
      {
        image:
          "https://cdn.stock2morrow.com/upload/book/1555_s2m-standard-banner-5.jpg",
        name: "Hi5 Website",
        author: "Titikarn Waitayasuwan",
        rating: "4.8",
        reviews: 28,
        sold: 29,
        price: "50,000",
      },
      {
        image:
          "https://cdn.stock2morrow.com/upload/book/1555_s2m-standard-banner-5.jpg",
        name: "Hi5 Website",
        author: "Titikarn Waitayasuwan",
        rating: "4.8",
        reviews: 28,
        sold: 29,
        price: "50,000",
      },
      {
        image:
          "https://cdn.stock2morrow.com/upload/book/1555_s2m-standard-banner-5.jpg",
        name: "Hi5 Website",
        author: "Titikarn Waitayasuwan",
        rating: "4.8",
        reviews: 28,
        sold: 29,
        price: "50,000",
      },
      {
        image:
          "https://cdn.stock2morrow.com/upload/book/1555_s2m-standard-banner-5.jpg",
        name: "Hi5 Website",
        author: "Titikarn Waitayasuwan",
        rating: "4.8",
        reviews: 28,
        sold: 29,
        price: "50,000",
      },
      {
        image:
          "https://cdn.stock2morrow.com/upload/book/1555_s2m-standard-banner-5.jpg",
        name: "Hi5 Website",
        author: "Titikarn Waitayasuwan",
        rating: "4.8",
        reviews: 28,
        sold: 29,
        price: "50,000",
      },
      {
        image:
          "https://cdn.stock2morrow.com/upload/book/1555_s2m-standard-banner-5.jpg",
        name: "Hi5 Website",
        author: "Titikarn Waitayasuwan",
        rating: "4.8",
        reviews: 28,
        sold: 29,
        price: "50,000",
      },
      {
        image:
          "https://cdn.stock2morrow.com/upload/book/1555_s2m-standard-banner-5.jpg",
        name: "Hi5 Website",
        author: "Titikarn Waitayasuwan",
        rating: "4.8",
        reviews: 28,
        sold: 29,
        price: "50,000",
      },
      {
        image:
          "https://cdn.stock2morrow.com/upload/book/1555_s2m-standard-banner-5.jpg",
        name: "Hi5 Website",
        author: "Titikarn Waitayasuwan",
        rating: "4.8",
        reviews: 28,
        sold: 29,
        price: "50,000",
      },
      {
        image:
          "https://cdn.stock2morrow.com/upload/book/1555_s2m-standard-banner-5.jpg",
        name: "Hi5 Website",
        author: "Titikarn Waitayasuwan",
        rating: "4.8",
        reviews: 28,
        sold: 29,
        price: "50,000",
      },
    ];

    return (
      <Container>
        <Navbar session={session} />
      <main className="flex flex-col md:flex-row w-full justify-center p-4 mt-20">
        <div className="flex flex-col w-full max-w-auto mb-20">
  
      <div className="flex flex-row justify-center">
        <div className="relative">
            <MdAccountCircle 
            className="rounded-full text-gray-500" 
            style={{ width: "95px", height: "95px" }} 
            />
        </div>
      </div>
  
        <div className="flex flex-row justify-center">
          <p style={{fontSize:"24px",fontWeight:"bold"}} className="mt-6">{session?.user?.name}</p>
        </div>
        
        <div className="flex flex-row justify-center mt-10 mb-10">
        <Link href={`/Profile/EditProfile/${session.id}`} className="bg-blue-500 text-white px-4 py-2 rounded mx-2 hover:bg-blue-600 w-64 flex items-center justify-center" style={{backgroundColor:"#33539B"}}>
        <p>{t("nav.profile.edit")}</p>
        </Link>
        <Link href="/Profile/QRshare" className="bg-green-500 text-white px-4 py-2 rounded mx-2 hover:bg-green-600 w-64 flex items-center justify-center" style={{backgroundColor:"#33539B"}}>
        {t("nav.profile.share")}
        </Link>
        </div>
       
  
          <div className="flex flex-row justify-center space-x-4 mt-4 w-full">
            <div className="flex flex-row" style={{ width: "100%" }}>
              <div className="flex flex-col mr-3" style={{ width: "100%" }}>
                <div className="flex flex-col" style={{ width: "100%" }}>
                  <button
                    onClick={() => handleClick("button1")}
                    className={`flex flex-row justify-center p-2 bg-white flex-grow ${
                      activeButton === "button1"
                        ? "border-b-[#33539B] border-b-4 rounded-b-lg"
                        : ""
                    }`}
                  >
                    <div className="flex flex-col justify-center w-auto h-10">
                      <p className="font-bold text-[20px]">{t("nav.profile.project")}</p>
                    </div>
                  </button>
                </div>
              </div>
              <div className="flex flex-col ml-3" style={{ width: "100%" }}>
                <div className="flex flex-col" style={{ width: "100%" }}>
                  <button
                    onClick={() => handleClick("button2")}
                    className={`flex flex-row justify-center p-2 bg-white flex-grow ${
                      activeButton === "button2"
                        ? "border-b-[#33539B] border-b-4 rounded-b-lg"
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
          {activeButton1 === "button1" && activeButton === "button1" &&(
  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 justify-items-center mt-10 w-full">
    {products.map((product, index) => (
      <Link key={index} href="/project/projectdetail">
        <div
          className="flex-shrink-0 rounded-[10px] border border-[#BEBEBE] bg-white p-4 m-5"
          style={{ width: "100%", maxWidth: "303px", height: "auto", maxHeight: "375px" }}
        >
          <div className="w-full h-full flex flex-col">
            <img
              src={product.image}
              alt="Product Image"
              className="w-full h-[150px] md:h-[120px] lg:h-[150px] rounded-md object-cover mb-4"
            />
            <div className="flex flex-col justify-between h-full">
              <p className="text-base md:text-lg font-semibold mb-2 truncate">
                {product.name}
              </p>
              <div className="flex items-center mb-2">
                <span className="text-gray-500 mr-2 text-xl md:text-2xl">
                  <MdAccountCircle />
                </span>
                <p className="text-xs md:text-sm text-gray-600 truncate">
                  {product.author}
                </p>
              </div>
              <div className="flex items-center mb-2">
                <span className="text-yellow-500 mr-2">
                  <IoIosStar />
                </span>
                <span className="text-[10px] md:text-sm lg:text-sm text-gray-600">
                  {product.rating} ({product.reviews}) | {t("nav.project.projectdetail.sold")}{" "}
                  {product.sold}
                </span>
              </div>
              <p className="text-base md:text-lg font-bold text-[#33529B]">
                {product.price} THB
              </p>
            </div>
          </div>
        </div>
      </Link>
    ))}
  </div>
)}
  
          {activeButton === "button2" && (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 justify-items-center mt-10 w-full">
              {Array(10)
                .fill("")
                .map((_, index) => (
                  <Link key={index} href="/blog">
                    <div className="w-[150px] sm:w-[180px] md:w-[200px] h-auto flex flex-col">
                      <div className="rounded w-full relative" style={{ height: "200px" }}>
                        <img
                          src="https://64.media.tumblr.com/52eaf78ffa891980b680c5e12b15437e/tumblr_pmhq6nlBzJ1tk9psf_1280.jpg"
                          className="object-cover w-full h-full"
                          alt="Blog Image"
                        />
                      </div>
                      <div className="ml-2 mt-2">
                        <div className="flex flex-col mt-1 justify-center">
                          <div className="flex flex-row">
                            <p className="truncate mt-1 text-sm font-bold w-full">
                              แนะนำ Study With
                            </p>
                            <div className="flex items-center">
                              <div className="w-6 h-6 ml-1 mt-1 text-gray-500">
                                <CiHeart style={{ fontSize: "20px" }} />
                              </div>
                              <p className="text-gray-500 text-sm">500</p>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-row mb-3">
                          <MdAccountCircle className="w-6 h-6 rounded-full mr-2 mt-1 text-gray-500" />
                          <p className="mt-2 truncate text-gray-500 text-xs">
                            Titikarn Waitayasuwan
                          </p>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
      </Container>
    );
  }

export default page;
