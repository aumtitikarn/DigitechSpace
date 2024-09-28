"use client";

import React, { useEffect, useState, useCallback } from "react";
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
import { OrbitProgress } from "react-loading-indicators";
import Link from "next/link";
import Report from "./report";
import { AiOutlineNotification } from "react-icons/ai";
import { useTranslation } from "react-i18next";
import { MdOutlineFileDownload } from "react-icons/md";


interface ProjectData {
  _id: string;
  projectname: string;
  description: string;
  receive: string[];
  category: string;
  price: number;
  review: number;
  sold: number;
  rathing: number;
  imageUrl: string[];
  author: string;
  filesUrl: string[];
}

interface Review {
  username: string;
  userEmail: string;
  rathing: number;
  review: string;
  projectId: string; // Ensure this matches your database structure
}

const ProjectRecieve: React.FC<{ params: { id: string } }> = ({ params }) => {
  const { data: session, status } = useSession();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFavorited, setIsFavorited] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isSharePopupOpen, setIsSharePopupOpen] = useState(false);
  const { t, i18n } = useTranslation("translation");
  const [visibleReviewsCount, setVisibleReviewsCount] = useState(3);
  const [project, setProject] = useState<ProjectData | null>(null);
  const [loading, setLoading] = useState(true);
  const [publishedProjects, setPublishedProjects] = useState<ProjectData[]>([]);
  const [similarProjects, setSimilarProjects] = useState<ProjectData[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reviews, setReviews] = useState<Review[]>([]);
  const projectGroups = [
    {
      group: "Software Development",
      categories: ["website", "mobileapp", "program", "document"],
    },
    { group: "Data and AI", categories: ["ai", "datasets", "document"] },
    { group: "Hardware and IoT", categories: ["iot", "program", "document"] },
    {
      group: "Content and Design",
      categories: ["document", "photo", "document"],
    },
    {
      group: "3D and Modeling",
      categories: ["model", "photo", "document"],
    },
  ];

  useEffect(() => {
    const fetchSimilarProjects = async () => {
      if (project && project.category) {
        try {
          // Find the group that contains the current project's category
          const currentGroup = projectGroups.find((group) =>
            group.categories.includes(project.category)
          );

          if (currentGroup) {
            const categories = currentGroup.categories.join(",");
            const response = await fetch(
              `/api/project/getSimilarProject?categories=${encodeURIComponent(categories)}&exclude=${project._id}`
            );
            if (response.ok) {
              const data = await response.json();
              setSimilarProjects(data);
            } else {
              const errorData = await response.json();
              setError(
                errorData.error ||
                  `Failed to fetch similar projects: ${response.status} ${response.statusText}`
              );
            }
          } else {
            setError("No matching category group found");
          }
        } catch (error) {
          console.error("Error fetching similar projects:", error);
          setError("An error occurred while fetching similar projects");
        }
      }
    };
    console.log("project :", project);
    fetchSimilarProjects();
  }, [project]);

  // const response = await fetch(`/api/project/getSimilarProject?categories=${encodeURIComponent(categories)}&exclude=${project._id}`);
  useEffect(() => {
    const fetchData = async () => {
      if (params.id) {
        try {
          setLoading(true);
          // ดึงข้อมูลโปรเจกต์
          const projectResponse = await fetch(`/api/project/${params.id}`);
          if (projectResponse.ok) {
            const projectData = await projectResponse.json();
            setProject(projectData.post);
            console.log("Project data:", projectData.post);

            // ดึงโปรเจกต์อื่นๆ ของผู้ใช้คนเดียวกัน
            if (projectData.post && projectData.post.email) {
              console.log(
                "Fetching projects for email:",
                projectData.post.email
              );
              const publishedResponse = await fetch(
                `/api/project/getProjects/by?email=${encodeURIComponent(projectData.post.email)}`,
                {
                  method: "GET",
                }
              );
              console.log("Response status:", publishedResponse.status);
              if (publishedResponse.ok) {
                const publishedData = await publishedResponse.json();
                console.log("Published Data:", publishedData);
                setPublishedProjects(publishedData);
              } else {
                console.error("Failed to fetch published projects");
                const errorData = await publishedResponse.text();
                console.error("Error data:", errorData);
              }
            } else {
              console.log("Email not found in project data");
            }
          } else {
            console.error("Failed to fetch project data");
          }
        } catch (error) {
          console.error("Error fetching data:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchData();
  }, [params.id]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch('/api/review');
        const result = await response.json();

        console.log('Fetched reviews:', result.data); // Log fetched reviews

        setReviews(result.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching reviews:', error);
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);
  
  const updateProjectRating = async (projectId: string) => {
    try {
      const response = await fetch('/api/project/updateRating', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ projectId }),
      });
  
      const result = await response.json();
  
      if (response.ok) {
        console.log('Rating updated:', result.updatedProject);
      } else {
        console.error('Error updating rating:', result.message);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };
  

  if (!project) {
    return <div></div>;
  }
  if (status === "loading") {
    return (
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          textAlign: "center",
        }}
      >
        <OrbitProgress
          variant="track-disc"
          dense
          color="#33539B"
          size="medium"
          text=""
          textColor=""
        />
      </div>
    );
  }

  const handlePrevClick = () => {
    setCurrentIndex(
      (prevIndex) =>
        (prevIndex - 1 + project.imageUrl.length) % project.imageUrl.length
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
  const handleNotificationClick = () => {
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
  };

  const getShareUrl = () => {
    // ใช้ window.location.origin เพื่อให้ได้ URL เต็มรูปแบบ
    return `${window.location.origin}/project/projectdetail/${params.id}`;
  };

  const handleCopyLink = () => {
    const url = getShareUrl();
    navigator.clipboard.writeText(url).then(() => {
      alert('Link copied to clipboard!');
    }).catch(err => {
      console.error('Failed to copy: ', err);
    });
  };

  const handleFacebookShare = () => {
    const url = encodeURIComponent(getShareUrl());
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
  };

  const handleTwitterShare = () => {
    const url = encodeURIComponent(getShareUrl());
    const text = encodeURIComponent(`Digitech Space project: ${project.projectname} by: ${project.author}`);
    window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`, '_blank');
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
                    {project.rathing ? project.rathing.toFixed(1) : "N/A"} {/* แสดงค่า rating หรือ N/A */}
  ({project.rathing ? project.rathing : 0}) {/* แสดงจำนวนรีวิว */}
  {" "} | 
                      {t("nav.project.projectdetail.sold")} {project.sold}
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
                          <FaLink
                            className="text-gray-600 cursor-pointer"
                            onClick={handleCopyLink}
                          />
                          <FaFacebook
                            className="text-gray-600 cursor-pointer"
                            onClick={handleFacebookShare}
                          />
                          <RiTwitterXLine
                            className="text-gray-600 cursor-pointer"
                            onClick={handleTwitterShare}
                          />
                        </div>
                      )}
                    </div>
                    {session ? (
                      <>
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
                      </>
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
                {reviews.length > 0 ? (
  reviews.slice(0, visibleReviewsCount).map((review, index) => (
    <li key={index} className="mb-4">
      <div className="flex items-center">
        <MdAccountCircle className="text-gray-500 text-5xl mr-2" />
        <div className="flex flex-col">
          <div className="flex items-center">
            <p className="text-sm font-bold mr-2">{review.username}</p>
            <span className="flex items-center">
              <IoIosStar className="text-yellow-500 mr-1" />
              <span className="text-sm">{review.rathing}</span>
            </span>
          </div>
          <p className="text-sm text-gray-600 mt-1">{review.review}</p>
        </div>
      </div>
    </li>
  ))
) : (
  <p>No reviews available</p>
)}
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
                {publishedProjects.length > 0 ? (
                  <div className="flex overflow-x-auto gap-[17px] mt-10">
                    {publishedProjects.map((product, index) => (
                      <Link
                        key={index}
                        href={`/project/projectdetail/${product._id}`}
                      >
                        <div className="flex-shrink-0 rounded-[10px] border border-[#BEBEBE] bg-white w-[210px] h-auto p-4">
                          <div className="w-full h-auto flex flex-col">
                            <img
                              src={`/api/project/images/${product.imageUrl[0]}`}
                              alt="Product Image"
                              className="w-full h-[150px] rounded-md object-cover mb-4"
                            />
                            <div className="flex flex-col justify-between h-full">
                              <p className="text-lg font-semibold mb-2 truncate w-[150px]">
                                {product.projectname}
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
                                  {product.rathing || "N/A"} ({product.review})
                                  | {t("nav.project.projectdetail.sold")}{" "}
                                  {product.sold}
                                </span>
                              </div>
                              <p className="text-lg font-bold text-[#33529B]">
                                {product.price} THB
                              </p>
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-gray-500 mt-5">
                    {t("nav.sell.noproject")}
                  </p>
                )}
              </div>
              <div className="mt-10">
                <p className="text-[20px] font-bold">
                  {t("nav.project.projectdetail.otherproject")}
                </p>
                {publishedProjects.length > 0 ? (
                  <div className="flex overflow-x-auto gap-[17px] mt-10">
                    {similarProjects.map((product, index) => (
                      <Link
                        key={index}
                        href={`/project/projectdetail/${product._id}`}
                      >
                        <div className="flex-shrink-0 rounded-[10px] border border-[#BEBEBE] bg-white w-[210px] h-auto p-4">
                          <div className="w-full h-auto flex flex-col">
                            <img
                              src={`/api/project/images/${product.imageUrl[0]}`}
                              alt="Product Image"
                              className="w-full h-[150px] rounded-md object-cover mb-4"
                            />
                            <div className="flex flex-col justify-between h-full">
                              <p className="text-lg font-semibold mb-2 truncate w-[150px]">
                                {product.projectname}
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
                                  {product.rathing || "N/A"} ({product.review})
                                  | {t("nav.project.projectdetail.sold")}{" "}
                                  {product.sold}
                                </span>
                              </div>
                              <p className="text-lg font-bold text-[#33529B]">
                                {product.price} THB
                              </p>
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-gray-500 mt-5">
                    {t("nav.sell.noproject")}
                  </p>
                )}
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

      {isModalOpen &&(
        <Report project={project} onClose={closeModal} />

      )}
      <Footer />
    </main>
  );
};

export default ProjectRecieve;