"use client";

import React, { useState } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { GoCheck, GoShare, GoHeartFill } from "react-icons/go";
import { IoIosStar } from "react-icons/io";
import { MdAccountCircle } from "react-icons/md";
import { FaChevronLeft } from "react-icons/fa";
import { FaChevronRight } from "react-icons/fa";
import { GoHeart } from "react-icons/go";
import Link from "next/link";

const Project = () => {
  const { data: session, status } = useSession();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFavorited, setIsFavorited] = useState(false);

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  if (!session) {
    redirect("/auth/signin");
    return null;
  }

  const images = ["/pexample1.png", "/pexample3.png", "/pexample4.png"];

  const handlePrevClick = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + images.length) % images.length
    );
  };

  const handleNextClick = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };
  const handleFavoriteClick = () => {
    setIsFavorited((prev) => !prev);  // เปลี่ยนสถานะเมื่อคลิก
  };

  // ข้อมูลตัวอย่างของสินค้า
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
  ];

  return (
    <main className="bg-[#FBFBFB]">
      <Navbar session={session} />
      <div className="lg:mx-60 lg:mt-20 lg:mb-20 mt-10 mb-10 ">
        <div className="flex flex-col min-h-screen">
          {/* Slider Section */}
          <div className="flex flex-col items-center p-4">
            <div className="w-full">
              <div className="relative w-full h-auto overflow-hidden rounded-lg">
                <img
                  src={images[currentIndex]}
                  alt="Project Image"
                  className="w-full h-[500px] object-cover"
                />
                {/* Slider Controls */}
                <button
                  onClick={handlePrevClick}
                  className="absolute left-10 top-1/2 transform -translate-y-1/2  text-gray-500 p-2 rounded-full text-4xl bg-gray-100"
                >
                  <FaChevronLeft />
                </button>
                <button
                  onClick={handleNextClick}
                  className="absolute right-10 top-1/2 transform -translate-y-1/2 text-gray-500 p-2 rounded-full text-4xl bg-gray-100"
                >
                  <FaChevronRight />
                </button>
              </div>
            </div>

            {/* Information Section */}
            <div className="w-full mt-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xl font-bold text-[24px]">Facebook Website</p>
                  <div className="flex items-center">
                    <p className="text-sm text-gray-600 mr-2">by</p>
                    <span className="text-gray-500 mr-2 text-2xl">
                      <MdAccountCircle />
                    </span>
                    <p className="text-sm text-gray-600 truncate w-[150px]">
                      Titikarn Waitayasuwan
                    </p>
                  </div>
                  <p className="text-lg font-bold mt-3 text-[#33529B]">
                    45,000 THB
                  </p>
                  <div className="flex items-center">
                    <span className="text-yellow-500 mr-2">
                      <IoIosStar />
                    </span>
                    <span className="text-sm text-gray-600">
                      4.8 (28) | Sold 28
                    </span>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <div className="flex space-x-2">
                    <GoShare className="text-gray-600 cursor-pointer text-2xl" />
                    <button onClick={handleFavoriteClick} className="cursor-pointer">
                      {isFavorited ? (
                        <GoHeartFill className="text-gray-600 text-2xl" />
                      ) : (
                        <GoHeart className="text-gray-600 text-2xl" />
                      )}
                    </button>
                  </div>
                  <Link href="/project/OrderItem">
                  <button className="bg-[#33529B] text-white px-20 py-2 rounded-lg mt-11">
                    Buy
                  </button>
                  </Link>
                </div>
              </div>

              {/* Description Section */}
              <div className="bg-white p-6 rounded-lg mt-10 shadow-custom">
                <h2 className="text-lg font-bold text-[#33529B]">
                  Description
                </h2>
                <div className="border-t border-gray-300 my-4"></div>
                <p className="text-sm text-gray-600 mt-2">
                  This is just a dummy text that has been inserted as a
                  placeholder for future content. While it may seem
                  insignificant at first glance, the use of dummy text is a
                  common practice in the design and publishing industry, as it
                  allows designers and developers to visualize the layout and
                  overall aesthetic of a project without being distracted by the
                  actual content.
                </p>
              </div>

              {/* Receive Section */}
              <div className="bg-white p-6 rounded-lg mt-10 shadow-custom">
                <h2 className="text-lg font-bold text-[#33529B]">Receive</h2>
                <div className="border-t border-gray-300 my-4"></div>
                <ul className="list-none text-sm text-gray-600 mt-2">
                  <li className="flex items-center">
                    <GoCheck className="w-5 h-5 text-green-500 mr-2" />
                    รายการ
                  </li>
                  <li className="flex items-center">
                    <GoCheck className="w-5 h-5 text-green-500 mr-2" />
                    ชุดข้อความ
                  </li>
                  <li className="flex items-center">
                    <GoCheck className="w-5 h-5 text-green-500 mr-2" />
                    ข้อมูล
                  </li>
                </ul>
              </div>

              {/* Review Section */}
              <div className="bg-white p-6 rounded-lg mt-10 shadow-custom">
                <h2 className="text-lg font-bold text-[#33529B]">Review</h2>
                <div className="border-t border-gray-300 my-4"></div>
                <div className="mt-2">
                  <div className="flex items-center">
                    <MdAccountCircle className="text-gray-600 text-3xl mr-3" />
                    <p className="flex items-center font-bold">
                      Phornthiwa <IoIosStar className="mx-2 text-yellow-500" />{" "}
                      5.0
                    </p>
                  </div>
                  <p className="text-sm text-gray-600 ml-10">
                    ดีมาก ประทับใจมากค่ะ
                  </p>
                </div>
                <div className="mt-2">
                  <div className="flex items-center">
                    <MdAccountCircle className="text-gray-600 text-3xl mr-3" />
                    <p className="flex items-center font-bold">
                      Stamp <IoIosStar className="mx-2 text-yellow-500" /> 5.0
                    </p>
                  </div>
                  <p className="text-sm text-gray-600 ml-10">
                    ดีมาก ประทับใจมากครับ
                  </p>
                </div>
                <a
                  href="#"
                  className="flex justify-center items-center text-[#33529B] mt-2 inline-block font-bold"
                >
                  <p className="text-center">See more (168)</p>
                </a>
              </div>

              {/* Product List Section */}
              <div className="mt-10">
                <div className="flex items-center">
                  <p className="text-[20px] font-bold">Project by </p>
                  <p className="text-[#33529B] ml-1 text-[20px] font-bold">
                    Titikarn Waitayasuwan
                  </p>
                </div>
                <Link href="/project/projectdetail">
                <div className="flex overflow-x-auto gap-[17px] mt-10">
                  {products.map((product, index) => (
                    <div
                      key={index}
                      className="flex-shrink-0 rounded-[10px] border border-[#BEBEBE] bg-white w-[210px] h-auto p-4"
                    >
                      <div className="w-full h-auto flex flex-col">
                        {/* รูปภาพสินค้า */}
                        <img
                          src={product.image}
                          alt="Product Image"
                          className="w-full h-[150px] rounded-md object-cover mb-4"
                        />
                        <div className="flex flex-col justify-between h-full">
                          <p className="text-lg font-semibold mb-2 truncate w-[150px]">
                            {product.name}
                          </p>
                          <div className="flex items-center mb-2">
                            <span className="text-gray-500 mr-2 text-2xl">
                              <MdAccountCircle />
                            </span>
                            <p className="text-sm text-gray-600 truncate w-[150px]">
                              {product.author}
                            </p>
                          </div>
                          <div className="flex items-center mb-2">
                            <span className="text-yellow-500 mr-2">
                              <IoIosStar />
                            </span>
                            <span className="text-sm text-gray-600">
                              {product.rating} ({product.reviews}) | Sold{" "}
                              {product.sold}
                            </span>
                          </div>
                          <p className="text-lg font-bold text-[#33529B]">
                            {product.price} THB
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                </Link>
              </div>
              <div className="mt-10">
                <p className="text-[20px] font-bold">Other Project </p>
                <Link href="/project/projectdetail">
                <div className="flex overflow-x-auto gap-[17px] mt-10">
                  {products.map((product, index) => (
                    <div
                      key={index}
                      className="flex-shrink-0 rounded-[10px] border border-[#BEBEBE] bg-white w-[210px] h-auto p-4"
                    >
                      <div className="w-full h-auto flex flex-col">
                        {/* รูปภาพสินค้า */}
                        <img
                          src={product.image}
                          alt="Product Image"
                          className="w-full h-[150px] rounded-md object-cover mb-4"
                        />
                        <div className="flex flex-col justify-between h-full">
                          <p className="text-lg font-semibold mb-2 truncate w-[150px]">
                            {product.name}
                          </p>
                          <div className="flex items-center mb-2">
                            <span className="text-gray-500 mr-2 text-2xl">
                              <MdAccountCircle />
                            </span>
                            <p className="text-sm text-gray-600 truncate w-[150px]">
                              {product.author}
                            </p>
                          </div>
                          <div className="flex items-center mb-2">
                            <span className="text-yellow-500 mr-2">
                              <IoIosStar />
                            </span>
                            <span className="text-sm text-gray-600">
                              {product.rating} ({product.reviews}) | Sold{" "}
                              {product.sold}
                            </span>
                          </div>
                          <p className="text-lg font-bold text-[#33529B]">
                            {product.price} THB
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
};

export default Project;
