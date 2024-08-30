"use client";

import React, { useEffect, useState } from "react";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { GoCheck, GoShare, GoHeartFill } from "react-icons/go";
import { IoIosStar } from "react-icons/io";
import { MdAccountCircle } from "react-icons/md";
import { FaChevronLeft } from "react-icons/fa";
import { FaChevronRight, FaFacebook } from "react-icons/fa";
import { GoHeart } from "react-icons/go";
import { MdClose } from "react-icons/md";
import { RiTwitterXLine } from "react-icons/ri";
import { FaLink, FaFacebookF, FaTwitter } from "react-icons/fa";
import { MdOutlineFileDownload } from "react-icons/md";
import Link from "next/link";
import { useTranslation } from "react-i18next";
interface ProjectData {
  _id: string;
  projectname: string;
  description: string;
  receive: string[];
  category: string;
  price: number;
  imageUrl: string[];
  author: string;
  filesUrl: string[];
}

const ProjectDetail: React.FC<{ params: { id: string } }> = ({ params }) => {
  const { data: session, status } = useSession();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentIndex2, setCurrentIndex2] = useState(0);
  const [isFavorited, setIsFavorited] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isSharePopupOpen, setIsSharePopupOpen] = useState(false);
  const { t, i18n } = useTranslation("translation");
  const [visibleReviewsCount, setVisibleReviewsCount] = useState(3);
  const [project, setProject] = useState<ProjectData | null>(null);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    if (params.id) {
      fetchProjectData(params.id);
    }
  }, [params.id]);

  const fetchProjectData = async (id: string) => {
    try {
      const response = await fetch(`/api/project/${id}`);
      if (response.ok) {
        const data = await response.json();
        setProject(data.post); // Ensure data structure matches your API response
      } else {
        console.error("Failed to fetch project data");
      }
    } catch (error) {
      console.error("Error fetching project data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!project) {
    return <div>Project not found</div>;
  }
  if (status === "loading") {
    return <p>Loading...</p>;
  }

  const images = ["/pexample1.png", "/pexample3.png", "/pexample4.png"];

  const handlePrevClick = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + project.imageUrl.length) % project.imageUrl.length
    );
  };

  const handleNextClick = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % project.imageUrl.length);
  };
  const handleFavoriteClick = () => {
    setIsFavorited((prev) => !prev); // เปลี่ยนสถานะเมื่อคลิก
  };

  const handleBuyClick = () => {
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
  };

  const handleShareClick = () => {
    setIsSharePopupOpen(!isSharePopupOpen); // Toggle popup open/close
  };

  const handleShareClosePopup = () => {
    setIsSharePopupOpen(false); // Close popup
  };

  const handleSeeMoreClick = () => {
    if (visibleReviewsCount + 3 >= reviews.length) {
      setVisibleReviewsCount(reviews.length); // แสดงผลรีวิวทั้งหมด
    } else {
      setVisibleReviewsCount(visibleReviewsCount + 3); // แสดงผลเพิ่ม 3 รีวิว
    }
  };

  const handleShowLessClick = () => {
    setVisibleReviewsCount(3); // กลับไปแสดงผลรีวิว 5 รีวิวแรก
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

  const handleDownload = async (fileName: string) => {
    try {
      if (!project || !project.filesUrl.length) {
        console.error("No files available for download");
        return;
      }

      const fileUrl = `/api/project/files/${fileName}`;
      const response = await fetch(fileUrl);

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
      } else {
        console.error("Failed to download file");
      }
    } catch (error) {
      console.error("Error downloading file:", error);
    }
  };
  return (
    <main className="bg-[#FBFBFB]">
      <Navbar />
      <div className="lg:mx-60 lg:mt-20 lg:mb-20 mt-10 mb-10 ">
        <div className="flex flex-col min-h-screen mt-5">
          {/* Slider Section */}
          <div className="flex flex-col items-center p-4 ">
            <div className="relative w-full h-[500px] overflow-hidden rounded-lg">
              <img
                src={`/api/project/images/${project.imageUrl[currentIndex]}`}
                alt="Project Image"
                className="w-full h-full object-cover"
              />
              {/* Slider Controls */}
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
            {/* Information Section */}
            <div className="w-full mt-4">
              <div className="flex items-start justify-between">
                <div className="mt-5">
                  <p className="text-xl font-bold text-[28px] mt-3">
                    {project.projectname}
                  </p>
                  <div className="flex items-center mt-2">
                    <p className="text-sm text-gray-600 mr-2">
                      {t("nav.project.projectdetail.by")}
                    </p>
                    <span className="text-gray-500 mr-2 text-2xl">
                      <MdAccountCircle />
                    </span>
                    <p className="text-sm text-gray-600 truncate w-[150px]">
                      {project.author}
                    </p>
                  </div>
                  <div>
                    <p className="text-lg font-bold mt-3 text-[#33529B] text-[26px]">
                      {project.price} THB
                    </p>
                  </div>
                  <div className="flex items-center mt-2">
                    <span className="text-yellow-500 mr-2">
                      <IoIosStar className="text-2xl" />
                    </span>
                    <span className="text-sm text-gray-600 ">
                      4.8 (28) | {t("nav.project.projectdetail.sold")} 28
                    </span>
                  </div>
                </div>
                <div className="flex flex-col items-end mt-5">
                  <div className="flex space-x-2">
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
                    {session ? (
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
                    ) : (
                      <>
                        <Link href="/auth/preauth">
                          <button className="cursor-pointer">
                            <GoHeart className="text-gray-600 text-2xl" />
                          </button>
                        </Link>
                      </>
                    )}
                  </div>
                  {session ? (
                    <button
                      className="bg-[#33529B] text-white px-20 py-2 rounded-lg mt-11"
                      onClick={handleBuyClick}
                    >
                      {t("nav.project.projectdetail.buy")}
                    </button>
                  ) : (
                    <Link href="/auth/preauth">
                      <button className="bg-[#33529B] text-white px-5  py-2 lg:px-10 lg:py-2 rounded-lg mt-11">
                        {t("authen.signin.title")}
                      </button>
                    </Link>
                  )}
                </div>
              </div>

              {/* Description Section */}
              <div className="bg-white p-6 rounded-lg mt-10 shadow-custom">
                <h2 className="text-lg font-bold text-[#33529B]">
                  {t("nav.project.projectdetail.description")}
                </h2>
                <div className="border-t border-gray-300 my-4"></div>
                <p className="text-sm text-gray-600 mt-2 text-[18px]">
                  {project.description}
                </p>
              </div>

              {/* Receive Section */}
              <div className="bg-white p-6 rounded-lg mt-10 shadow-custom">
                <h2 className="text-lg font-bold text-[#33529B]">
                  {t("nav.project.projectdetail.receive")}
                </h2>
                <div className="border-t border-gray-300 my-4"></div>
                {project.receive.map((item, index) => (
                  <ul className="list-none  text-gray-600 mt-2">
                    <li className="flex items-center" key={index}>
                      <GoCheck className="w-5 h-5 text-green-500 mr-2" />
                      {item}
                    </li>
                  </ul>
                ))}
              </div>
              <div>
                {/* ไฟล์ */}
                <div className="bg-white p-6 rounded-lg mt-10 shadow-custom">
                  <h2 className="text-lg font-bold text-[#33529B]">
                    {t("nav.project.projectdetail.file")}
                  </h2>
                  <div className="border-t border-gray-300 my-4"></div>
                  <ul className="list-none mt-2">
                      {project.filesUrl.map((fileName, index) => (
                        <li className="flex items-center mb-2 " key={index}>
                          <button
                            onClick={() => handleDownload(fileName)}
                            style={{ cursor: "pointer" }}
                             className="flex items-center space-x-2 hover:text-blue-600"
                          >
                            <MdOutlineFileDownload className="w-5 h-5 text-gray-500" />
                            <span>{fileName}</span>
                          </button>
                        </li>
                      ))}
                    </ul>
                </div>
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
                    {project.author}
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
                              <span className="text-sm text-gray-600 truncate w-[150px]">
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
                </Link>
              </div>
              <div className="mt-10">
                <p className="text-[20px] font-bold">
                  {t("nav.project.projectdetail.otherproject")}
                </p>
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
                              <span className="text-sm text-gray-600 truncate w-[150px]">
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
                </Link>
              </div>
              {/* Popup */}
              {isPopupOpen && (
                <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center">
                  <div className="bg-white p-6 rounded-lg shadow-lg lg:w-[1079px] relative">
                    {/* หัวข้อและปุ่ม Close */}
                    <div className="relative mb-4">
                      <h2 className="text-xl font-bold text-center">
                        {t("nav.project.projectdetail.transaction")}
                      </h2>
                      {/* ปุ่ม Close */}
                      <button
                        onClick={handleClosePopup}
                        className="absolute top-1 right-4 text-gray-500 hover:text-gray-900"
                      >
                        <MdClose size={24} />
                      </button>
                    </div>
                    <div className="border-t border-gray-300 mb-3"></div>
                    <p className="font-semibold">
                      {t("nav.project.projectdetail.project")}:{" "}
                      {project.projectname}
                    </p>
                    <div className="flex items-center">
                      <p className="text-sm text-gray-600 mr-2">
                        {t("nav.project.projectdetail.by")}
                      </p>
                      <span className="text-gray-500 mr-2 text-2xl">
                        <MdAccountCircle />
                      </span>
                      <p className="text-sm text-gray-600 truncate w-[150px]">
                        {project.author}
                      </p>
                    </div>
                    <div className="flex items-center">
                      <p className="font-semibold">
                        {t("nav.project.projectdetail.price")}:
                      </p>
                      <p className="text-[#33529B] ml-2 font-bold">
                        {project.price} THB
                      </p>
                    </div>
                    <div className="flex flex-col sm:flex-col md:flex-row items-center space-y-5 md:space-y-0 md:space-x-5 mt-4">
                      <button
                        type="submit"
                        className="flex-grow flex justify-center rounded-md bg-[#33539B] px-3 py-3 w-full text-sm font-semibold leading-6 text-white shadow-sm hover:bg-slate-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 md:w-1/2"
                      >
                        {t("nav.project.projectdetail.paymentde")}
                      </button>
                      <button
                        type="submit"
                        className="flex-grow flex justify-center rounded-md bg-[#33539B] px-3 py-3 w-full text-sm font-semibold leading-6 text-white shadow-sm hover:bg-slate-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 md:w-1/2"
                      >
                        {t("nav.project.projectdetail.paymentmobile")}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
};

export default ProjectDetail;