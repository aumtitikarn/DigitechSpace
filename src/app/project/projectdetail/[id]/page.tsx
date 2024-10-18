"use client";

import React, { useEffect, useState, useCallback } from "react";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { GoCheck, GoShare, GoHeartFill } from "react-icons/go";
import { IoIosStar } from "react-icons/io";
import { MdAccountCircle, MdDescription } from "react-icons/md";
import { FaChevronLeft } from "react-icons/fa";
import { FaChevronRight, FaFacebook } from "react-icons/fa";
import { GoHeart } from "react-icons/go";
import { MdClose } from "react-icons/md";
import { RiTwitterXLine } from "react-icons/ri";
import { FaLink, FaFacebookF, FaTwitter } from "react-icons/fa";
import { OrbitProgress } from "react-loading-indicators";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { MdOutlineFileDownload } from "react-icons/md";
import OmisePaymentButtons from "./OmisePaymentButtons";
import Swal from "sweetalert2";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";

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
  email: string;
  profileImage: string;
  authorName: string;
}
declare global {
  interface Window {
    OmiseCard: any;
  }
}
interface Review {
  username: string;
  userEmail: string;
  rathing: number;
  review: string;
  projectId: string; // Ensure this matches your database structure
}
const ProjectDetail: React.FC<{ params: { id: string } }> = ({ params }) => {
  const { data: session, status } = useSession();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isSharePopupOpen, setIsSharePopupOpen] = useState(false);
  const { t, i18n } = useTranslation("translation");
  const [visibleReviewsCount, setVisibleReviewsCount] = useState(3);
  const [project, setProject] = useState<ProjectData | null>(null);
  const [loading, setLoading] = useState(true);
  const [publishedProjects, setPublishedProjects] = useState<ProjectData[]>([]);
  const [similarProjects, setSimilarProjects] = useState<ProjectData[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [confirmAction, setConfirmAction] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false); // กำหนดสถานะเริ่มต้น
  const [reviews, setReviews] = useState<Review[]>([]);

  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const projectGroups = [
    {
      group: "Software Development",
      categories: ["website", "mobileapp", "program", "document"],
    },
    { group: "Data and AI", categories: ["ai", "datasets", "document"] },
    { group: "Hardware and IoT", categories: ["iot", "program", "document"] },
    {
      group: "Content and Design",
      categories: ["document", "photo"],
    },
    {
      group: "3D and Modeling",
      categories: ["photo", "document", "model"],
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      if (params.id) {
        try {
          setLoading(true);
          // ดึงข้อมูลโปรเจกต์ตาม ID
          const projectResponse = await fetch(`/api/project/${params.id}`);
          if (projectResponse.ok) {
            const projectData = await projectResponse.json();
            setProject(projectData); // ไม่ต้องใช้ .post แล้ว
            console.log("Project data:", projectData);

            // ดึงรีวิวที่ตรงกับ projectId
            const reviewsResponse = await fetch("/api/review");
            const reviewsData = await reviewsResponse.json();
            const filteredReviews = reviewsData.data.filter(
              (review: Review) => review.projectId === params.id
            );
            setReviews(filteredReviews);

            // ดึงโปรเจกต์อื่นๆ ของผู้ใช้คนเดียวกัน
            if (projectData && projectData.email) {
              const publishedResponse = await fetch(
                `/api/project/getProjects/by?email=${encodeURIComponent(projectData.email)}`
              );
              if (publishedResponse.ok) {
                const publishedData = await publishedResponse.json();
                setPublishedProjects(publishedData);
              } else {
                console.error("Failed to fetch published projects");
              }
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
    const fetchSimilarProjects = async () => {
      if (project && project.category) {
        try {
          let categories;
          if (project.category.toLowerCase() === "all") {
            categories = Array.from(
              new Set(projectGroups.flatMap((group) => group.categories))
            ).join(",");
          } else {
            const relevantGroups = projectGroups.filter((group) =>
              group.categories.includes(project.category)
            );
            categories = Array.from(
              new Set(relevantGroups.flatMap((group) => group.categories))
            ).join(",");
          }

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
        } catch (error) {
          console.error("Error fetching similar projects:", error);
          setError("An error occurred while fetching similar projects");
        }
      }
    };

    fetchSimilarProjects();
  }, [project]);

  useEffect(() => {
    const checkFavoriteStatus = async () => {
      if (session) {
        try {
          const response = await fetch(`/api/favorites?email=${session.user.email}`);
          const favoriteProjects = await response.json();
  
          const isProjectFavorited = favoriteProjects.includes(params.id);
          setIsFavorited(isProjectFavorited);
        } catch (error) {
          console.error('Error checking favorite status:', error);
        }
      }
    };
  
    checkFavoriteStatus();
  }, [session, params.id]);
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

  const checkAndBuyProject = async () => {
    setIsLoading(true);
    try {
      const userEmail = session?.user.email;

      // ตรวจสอบว่าผู้ใช้ได้ซื้อโครงงานนี้แล้วหรือยัง
      const response = await axios.get("/api/payment/checkOrder", {
        params: {
          email: userEmail,
          productId: project._id,
        },
      });

      // ถ้าผู้ใช้เป็นเจ้าของโครงงานนี้
      if (response.data.projectOwned) {
        Swal.fire({
          title: t("nav.project.projectdetail.your"),
          text: t("nav.project.projectdetail.your2"),
          icon: "info",
          confirmButtonText: "ตกลง",
        });
      }

      // ถ้าผู้ใช้ได้ทำการสั่งซื้อแล้ว
      else if (response.data.hasOrder) {
        Swal.fire({
          title: t("nav.project.projectdetail.alreadyOwned"),
          text: t("nav.project.projectdetail.alreadyOwnedDescription"),
          icon: "info",
          confirmButtonText: "ตกลง",
        });
      }

      // ถ้าไม่มีการสั่งซื้อและไม่ใช่โครงงานของผู้ใช้ ให้ดำเนินการสั่งซื้อ
      else {
        handleBuyClick();
      }
    } catch (error) {
      console.error("Error checking order or project:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrevClick = () => {
    setCurrentIndex(
      (prevIndex) =>
        (prevIndex - 1 + project.imageUrl.length) % project.imageUrl.length
    );
  };

  const handleNextClick = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % project.imageUrl.length);
  };

  const handleFavoriteClick = async () => {
    if (session) {
      try {
        const data = {
          email: session.user.email,
          projectId: project._id,
        };
  
        const favoriteResponse = await fetch("/api/favorites", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });
  
        if (favoriteResponse.ok) {
          const result = await favoriteResponse.json();
  
          // ตั้งค่าสถานะตามที่ได้รับจาก API
          setIsFavorited(result.isFavorited);
  
          // ตั้งค่า status เป็น favorites ถ้าถูกเพิ่ม หรือ 'pending' ถ้าถูกลบ
          const status = result.isFavorited ? 'favorites' : 'pending';
          
          // แสดงข้อความแจ้งเตือนด้วย SweetAlert2
          Swal.fire({
            icon: "success",
            title: result.isFavorited
              ? t("nav.project.projectdetail.favadd")
              : t("nav.project.projectdetail.favre"),
            showConfirmButton: false,
            timer: 1500,
          });
        } else {
          const result = await favoriteResponse.json();
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: `Error: ${result.error}`,
          });
        }
      } catch (error) {
        console.error("Error during favorite request:", error);
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Error adding/removing favorite",
        });
      }
    } else {
      Swal.fire({
        icon: "warning",
        title: t("nav.project.projectdetail.favlog"),
        text: t("nav.project.projectdetail.favlogdes"),
      });
    }
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

  const createInternetBankingCharge = async (
    amount: number,
    token: string,
    type: string,
    net: number
  ) => {
    try {
      const response = await axios.post("/api/payment", {
        token: token,
        amount: amount,
        description: project.projectname,
        typec: type,
        product: project._id,
        btype: 2,
        email: session?.user.email,
        name: session?.user.name,
      });

      await Swal.fire({
        icon: "success",
        title: "Success",
      });
      if (type === "credit_card") {
        router.push("/myproject");
      } else {
        window.location.href = response.data.authorizeUri;
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text:
          error instanceof Error ? error.message : "An unknown error occurred",
      });
    }
  };

  const url = typeof window !== "undefined" ? window.location.href : "";

  const handleCopyLink = () => {
    navigator.clipboard
      .writeText(url)
      .then(() => {
        alert("URL copied to clipboard!");
      })
      .catch((err) => {
        console.error("Failed to copy URL: ", err);
      });
  };

  const handleFacebookShare = () => {
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      "_blank"
    );
  };

  const handleTwitterShare = () => {
    const text = encodeURIComponent(
      `Digitech Space project: ${project.projectname} by: ${project.author}`
    );
    window.open(
      `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${text}`,
      "_blank"
    );
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
                    <span className="text-gray-500  text-3xl mr-2">
                      {project.profileImage ? (
                        <Image
                          src={project.profileImage}
                          alt="Author Profile"
                          width={30}
                          height={30}
                          className="rounded-full"
                        />
                      ) : (
                        <span className="text-gray-500 text-3xl mr-2">
                          <MdAccountCircle />
                        </span>
                      )}
                    </span>
                    <p className="text-sm text-gray-600 truncate w-[150px]">
                      {project.authorName}
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
                      {project.rathing || "N/A"} ({project.review}) |{" "}
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

                    <button
                      onClick={handleFavoriteClick}
                      className={`cursor-pointer text-2xl ${isFavorited ? "text-red-500" : "text-gray-600"}`}
                    >
                      {isFavorited ? <GoHeartFill /> : <GoHeart />}
                    </button>
                  </div>
                  {session ? (
                    <button
                      className="bg-[#33529B] text-white px-20 py-2 rounded-lg mt-11"
                      onClick={checkAndBuyProject}
                    >
                      {t("nav.project.projectdetail.buy")}
                    </button>
                  ) : (
                    <Link href="/auth/signin">
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
              <div></div>
              {/* Reviews Section */}
              <div className="bg-white p-6 rounded-lg mt-10 shadow-custom">
                <h2 className="text-lg font-bold text-[#33529B]">
                  {t("nav.project.projectdetail.review")}
                </h2>
                <div className="border-t border-gray-300 my-4"></div>
                <ul>
                  {reviews.length > 0 ? (
                    reviews.map((review, index) => (
                      <li key={index} className="mb-4">
                        <div className="flex items-center">
                          <MdAccountCircle className="text-gray-500 text-5xl mr-2" />
                          <div className="flex flex-col">
                            <div className="flex items-center">
                              <p className="text-sm font-bold mr-2">
                                {review.username}
                              </p>
                              <span className="flex items-center">
                                <IoIosStar className="text-yellow-500 mr-1" />
                                <span className="text-sm">
                                  {review.rathing}
                                </span>
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 mt-1">
                              {review.review}
                            </p>
                          </div>
                        </div>
                      </li>
                    ))
                  ) : (
                    <p className=" text-gray-500 mt-5 text-center">
                      {t("nav.sell.noreview")}
                    </p>
                  )}
                </ul>

                <div className="flex justify-center">
                  {reviews.length > 0 && (
                    <>
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
                    </>
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
                    {project.authorName}
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
                                {product.profileImage ? (
                                  <Image
                                    src={product.profileImage}
                                    alt="Author Profile"
                                    width={20}
                                    height={20}
                                    className="rounded-full mr-2"
                                  />
                                ) : (
                                  <span className="text-gray-500 mr-2 text-2xl">
                                    <MdAccountCircle />
                                  </span>
                                )}
                                <p className="text-sm text-gray-600 truncate">
                                  {product.authorName}
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
                                {product.profileImage ? (
                                  <Image
                                    src={product.profileImage}
                                    alt="Author Profile"
                                    width={20}
                                    height={20}
                                    className="rounded-full mr-2"
                                  />
                                ) : (
                                  <span className="text-gray-500 mr-2 text-2xl">
                                    <MdAccountCircle />
                                  </span>
                                )}
                                <p className="text-sm text-gray-600 truncate">
                                  {product.authorName}
                                </p>
                              </div>
                              <div className="flex items-center mb-2">
                                <span className="text-yellow-500 mr-2">
                                  <IoIosStar />
                                </span>
                                <span className="text-sm text-gray-600 truncate w-[130px]">
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
                    <OmisePaymentButtons
                      projectName={project?.projectname || ""}
                      price={project?.price || 0}
                      email={project.email}
                      name={project.author}
                      createInternetBankingCharge={createInternetBankingCharge}
                    />
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
