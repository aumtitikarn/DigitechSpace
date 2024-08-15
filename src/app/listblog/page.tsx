"use client";

import React, { useState } from "react";
import { useSession } from "next-auth/react";
import { CiHeart } from "react-icons/ci";
import Navbar from "../components/Navbar";
import { redirect } from "next/navigation";
import Footer from "../components/Footer";
import Container from "../components/Container";
import Link from "next/link";
import { FaPlus } from "react-icons/fa6";
import { IoIosSearch } from "react-icons/io";
import { MdAccountCircle } from "react-icons/md";

function page() {
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
            <p
              className="mt-3"
              style={{ fontSize: "24px", fontWeight: "bold" }}
            >
              Blog
            </p>
            <div className="mt-4 w-full max-w-screen-lg flex justify-center relative">
              <input
                type="text"
                placeholder="ค้นหาสินค้า..."
                className="w-full p-2 pl-10 border border-gray-300 rounded"
              />
              <IoIosSearch className="absolute left-3 top-3 text-gray-400" />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 justify-items-center mt-10 w-full">
              {Array(5)
                .fill("")
                .map((_, index) => (
                  <Link href="/blog">
                    <div
                      key={index}
                      className=" w-[180px] h-[260px] flex flex-col"
                    >
                      <div className="rounded w-full h-40 relative">
                        <img
                          src="https://64.media.tumblr.com/52eaf78ffa891980b680c5e12b15437e/tumblr_pmhq6nlBzJ1tk9psf_1280.jpg"
                          className="object-cover w-full"
                          alt="Blog Image"
                        />
                      </div>
                      <div className="ml-2 mt-2">
                        <div className="flex flex-col mt-1 justify-center">
                          <div className="flex flex-row">
                            <p
                              className="truncate mt-1"
                              style={{ fontSize: "14px", fontWeight: "bold" }}
                            >
                              แนะนำ Study With
                            </p>
                            <div className="flex items-center">
                              <div className="w-6 h-6 ml-1 mt-1 text-gray-500">
                                <CiHeart style={{ fontSize: "20px" }} />
                              </div>
                              <p
                                className="text-gray-500"
                                style={{ fontSize: "16px" }}
                              >
                                500
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-row mb-3">
                          <MdAccountCircle className="w-6 h-6 rounded-full mr-2 mt-1 text-gray-500" />
                          <p
                            className="mt-2 truncate text-gray-500"
                            style={{ fontSize: "12px" }}
                          >
                            Titikarn Waitayasuwan
                          </p>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}

              {Array(5)
                .fill("")
                .map((_, index) => (
                  <Link href="/blog">
                    <div
                      key={index}
                      className=" w-[180px] h-[260px] flex flex-col"
                    >
                      <div className="rounded w-full h-40 relative">
                        <img
                          src="https://64.media.tumblr.com/52eaf78ffa891980b680c5e12b15437e/tumblr_pmhq6nlBzJ1tk9psf_1280.jpg"
                          className="object-cover w-full h-full"
                          alt="Blog Image"
                        />
                      </div>
                      <div className="ml-2 mt-2">
                        <div className="flex flex-col mt-1 justify-center">
                          <div className="flex flex-row">
                            <p
                              className="truncate mt-1"
                              style={{ fontSize: "14px", fontWeight: "bold" }}
                            >
                              แนะนำ Study With
                            </p>
                            <div className="flex items-center">
                              <div className="w-6 h-6 ml-1 mt-1 text-gray-500">
                                <CiHeart style={{ fontSize: "20px" }} />
                              </div>
                              <p
                                className="text-gray-500"
                                style={{ fontSize: "16px" }}
                              >
                                500
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-row mb-3">
                          <MdAccountCircle className="w-6 h-6 rounded-full mr-2 mt-1 text-gray-500" />
                          <p
                            className="mt-2 truncate text-gray-500"
                            style={{ fontSize: "12px" }}
                          >
                            Titikarn Waitayasuwan
                          </p>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}

              {Array(5)
                .fill("")
                .map((_, index) => (
                  <Link href="/blog">
                    <div
                      key={index}
                      className=" w-[180px] h-[260px] flex flex-col"
                    >
                      <div className="rounded w-full h-40 relative">
                        <img
                          src="https://64.media.tumblr.com/52eaf78ffa891980b680c5e12b15437e/tumblr_pmhq6nlBzJ1tk9psf_1280.jpg"
                          className="object-cover w-full h-full"
                          alt="Blog Image"
                        />
                      </div>
                      <div className="ml-2 mt-2">
                        <div className="flex flex-col mt-1 justify-center">
                          <div className="flex flex-row">
                            <p
                              className="truncate mt-1"
                              style={{ fontSize: "14px", fontWeight: "bold" }}
                            >
                              แนะนำ Study With
                            </p>
                            <div className="flex items-center">
                              <div className="w-6 h-6 ml-1 mt-1 text-gray-500">
                                <CiHeart style={{ fontSize: "20px" }} />
                              </div>
                              <p
                                className="text-gray-500"
                                style={{ fontSize: "16px" }}
                              >
                                500
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-row mb-3">
                          <MdAccountCircle className="w-6 h-6 rounded-full mr-2 mt-1 text-gray-500" />
                          <p
                            className="mt-2 truncate text-gray-500"
                            style={{ fontSize: "12px" }}
                          >
                            Titikarn Waitayasuwan
                          </p>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
            </div>

            <div className="mt-6 w-full flex justify-end">
              {session?.user?.role !== "NormalUser" && (
                <Link href="">
                  <div className="w-12 h-12 flex items-center justify-center bg-blue-500 text-white rounded-full hover:bg-blue-600">
                    <FaPlus size={24} />
                  </div>
                </Link>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </Container>
  );
}

export default page;
