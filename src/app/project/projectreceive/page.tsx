"use client";

import React, { useState } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { GoCheck, GoShare, GoHeartFill, GoHeart } from "react-icons/go";
import { IoIosStar } from "react-icons/io";
import { MdAccountCircle } from "react-icons/md";
import { FaChevronLeft, FaChevronRight, FaFacebook } from "react-icons/fa";
import { AiOutlineNotification } from "react-icons/ai";
import Report from "./report";
import { RiTwitterXLine } from "react-icons/ri";
import { FaLink, FaFacebookF, FaTwitter } from "react-icons/fa";
import { useTranslation } from "react-i18next";

const ProjectReceive = () => {
  const { data: session, status } = useSession();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFavorited, setIsFavorited] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSharePopupOpen, setIsSharePopupOpen] = useState(false);
  const { t, i18n } = useTranslation("translation");
  const [visibleReviewsCount, setVisibleReviewsCount] = useState(3);
  const router = useRouter();

  if (status === "loading") {
    return <p>Loading...</p>;
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
    setIsFavorited((prev) => !prev);
  };

  const handleNotificationClick = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleShareClick = () => {
    setIsSharePopupOpen(!isSharePopupOpen); // Toggle popup open/close
  };

  const handleShareClosePopup = () => {
    setIsSharePopupOpen(false); // Close popup
  };

  const handleShowLessClick = () => {
    setVisibleReviewsCount(3); // กลับไปแสดงผลรีวิว 5 รีวิวแรก
  };
  const handleSeeMoreClick = () => {
    if (visibleReviewsCount + 3 >= reviews.length) {
      setVisibleReviewsCount(reviews.length); // แสดงผลรีวิวทั้งหมด
    } else {
      setVisibleReviewsCount(visibleReviewsCount + 3); // แสดงผลเพิ่ม 3 รีวิว
    }
  };

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

  const reviews = [
    {
      name: "Phornthi",
      rating: "4.5",
      comment: "ดีมากๆเลยค่ะ",
    },
    {
      name: "Aumti",
      rating: "5.0",
      comment: "ช่วยเรื่องโปรเจกต์ได้ดีมากเลยค่ะ",
    },
    {
      name: "Stamp",
      rating: "3.5",
      comment: "ไฟล์แอบไม่เป็นระเบียนนิดนึง",
    },
    {
      name: "สมชาย",
      rating: "1.0",
      comment: "ไม่ค่อยตรงปก",
    },
    {
      name: "Phornthi",
      rating: "4.5",
      comment: "ดีมากๆเลยค่ะ",
    },
    {
      name: "Phornthi",
      rating: "4.5",
      comment: "ดีมากๆเลยค่ะ",
    },
    {
      name: "สมชาย",
      rating: "1.0",
      comment: "ไม่ค่อยตรงปก",
    },
    {
      name: "Phornthi",
      rating: "4.5",
      comment: "ดีมากๆเลยค่ะ",
    },
    {
      name: "Phornthi",
      rating: "4.5",
      comment: "ดีมากๆเลยค่ะ",
    },
    {
      name: "Phornthi",
      rating: "4.5",
      comment: "ดีมากๆเลยค่ะ",
    },
  ];

  return (
    <main className="bg-[#FBFBFB]">
      <Navbar />
      <div className="lg:mx-60 lg:mt-20 lg:mb-20 mt-10 mb-10">
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
                <button
                  onClick={handlePrevClick}
                  className="absolute left-10 top-1/2 transform -translate-y-1/2 text-gray-500 p-2 rounded-full text-4xl bg-gray-100"
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
                  <p className="text-xl font-bold text-[24px]">
                    Facebook Website
                  </p>
                  <div className="flex items-center">
                    <p className="text-sm text-gray-600 mr-2">
                      {t("nav.project.projectdetail.by")}
                    </p>
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
                      4.8 (28) | {t("nav.project.projectdetail.sold")} 28
                    </span>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <div className="flex space-x-5">
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
                    <button
                      onClick={handleFavoriteClick}
                      className="cursor-pointer"
                    >
                      {isFavorited ? (
                        <GoHeartFill className="text-gray-600 text-2xl" />
                      ) : (
                        <GoHeart className="text-gray-600 text-2xl" />
                      )}
                    </button>
                    <AiOutlineNotification
                      onClick={handleNotificationClick}
                      className="text-gray-600 cursor-pointer text-2xl"
                    />
                  </div>
                </div>
              </div>

              {/* Description Section */}
              <div className="bg-white p-6 rounded-lg mt-10 shadow-custom">
                <h2 className="text-lg font-bold text-[#33529B]">
                  {t("nav.project.projectdetail.description")}
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
                <h2 className="text-lg font-bold text-[#33529B]">
                  {t("nav.project.projectdetail.receive")}
                </h2>
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
                <button
                  type="submit"
                  className="mt-5 flex w-full justify-center rounded-md bg-[#33539B] px-3 py-3 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-slate-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  {t("nav.project.projectdetail.download")}
                </button>
              </div>

              {/* Reviews Section */}
              <div className="bg-white p-6 rounded-lg mt-10 shadow-custom">
                <h2 className="text-lg font-bold text-[#33529B]">
                  {t("nav.project.projectdetail.review")}
                </h2>
                <div className="border-t border-gray-300 my-4"></div>
                <ul>
                  {reviews
                    .slice(0, visibleReviewsCount)
                    .map((review, index) => (
                      <li key={index} className="mb-4">
                        <div className="flex items-center">
                          <MdAccountCircle className="text-gray-500 text-5xl mr-2" />
                          <div className="flex flex-col">
                            <div className="flex items-center">
                              <p className="text-sm font-bold mr-2">
                                {review.name}
                              </p>
                              <span className="flex items-center">
                                <IoIosStar className="text-yellow-500 mr-1" />
                                <span className="text-sm">{review.rating}</span>
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 mt-1">
                              {review.comment}
                            </p>
                          </div>
                        </div>
                      </li>
                    ))}
                </ul>
                <div className="flex justify-center">
                  {visibleReviewsCount < reviews.length && (
                    <button
                      onClick={handleSeeMoreClick}
                      className="text-[#33529B] mt-2 font-bold"
                    >
                      <p className="text-center">{t("nav.home.seemore")}</p>
                    </button>
                  )}
                  {visibleReviewsCount >= reviews.length && (
                    <button
                      onClick={handleShowLessClick}
                      className="text-[#33529B] mt-2 font-bold"
                    >
                      <p className="text-center">
                        {t("nav.project.projectdetail.hidden")}
                      </p>
                    </button>
                  )}
                </div>
              </div>

              {/* Product List Section */}
              <div className="mt-10">
                <div className="flex items-center">
                  <p className="text-[20px] font-bold">
                    {t("nav.project.projectdetail.projectby")}{" "}
                  </p>
                  <p className="text-[#33529B] ml-1 text-[20px] font-bold">
                    Titikarn Waitayasuwan
                  </p>
                </div>
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
                              {product.rating} ({product.reviews}) |{" "}
                              {t("nav.project.projectdetail.sold")}{" "}
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
              </div>
              <div className="mt-10">
                <p className="text-[20px] font-bold">
                  {t("nav.project.projectdetail.otherproject")}{" "}
                </p>
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
                              {product.rating} ({product.reviews}) |{" "}
                              {t("nav.project.projectdetail.sold")}{" "}
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
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Report Modal */}
      {isModalOpen && (
        <Report project="Facebook Website" onClose={closeModal} />
      )}

      <Footer />
    </main>
  );
};

export default ProjectReceive;
