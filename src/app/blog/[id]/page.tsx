"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { AiOutlineNotification } from "react-icons/ai";
import { IoShareOutline } from "react-icons/io5";
import { CiHeart } from "react-icons/ci";
import Navbar from "../../components/Navbar";
import { redirect, useRouter } from "next/navigation";
import Footer from "../../components/Footer";
import Container from "../../components/Container";
import Link from "next/link";
import { MdAccountCircle } from "react-icons/md";
import { BsThreeDots } from "react-icons/bs";
import { FaRegCommentDots } from "react-icons/fa6";
import { MdOutlineCancel } from "react-icons/md";
import { set } from "mongoose";
import { GoX } from "react-icons/go";
import { useTranslation } from "react-i18next";
import { BsChatDots } from "react-icons/bs";
import Image from "next/image";
import { FaChevronLeft } from "react-icons/fa";
import { FaChevronRight } from "react-icons/fa";
import { OrbitProgress } from "react-loading-indicators";
import { text } from "stream/consumers";
import Swal from "sweetalert2";
import { profile } from "console";
import { FaLink } from "react-icons/fa";
import { FaFacebook } from "react-icons/fa";
import { RiTwitterXLine } from "react-icons/ri";
import { FaEdit, FaTrash } from "react-icons/fa";
import e from "express";

interface BlogProps {
  params: {
    id: string;
  };
  searchParams?: { [key: string]: string | string[] | undefined };
}

interface Reply {
  _id: string;
  text: string;
  userName: string;
  profileImageSource?: string;
  timestamp: string | Date;
}

interface Comment {
  _id: string;
  text: string;
  userName: string;
  profileImageSource?: string;
  timestamp: string | Date;
  replies?: Reply[];
}

interface PostData {
  _id: string;
  topic: string;
  course: string;
  description: string;
  heart: number;
  imageUrl: string[];
  userprofileid: string[];
  userprofile: string[];
  author: string;
  profileImage: string;
  authorName: string;
  email: string;
  comments: Comment[];
  likedByUsers: string[];
  selectedCategory: string;
  timestamp: string | Date;
  onClose: () => void;
}
interface ProfileUser {
  imageUrl: string[];
}

function Blog({ params }: BlogProps) {
  const [review, setReview] = useState("");
  const [report, setreport] = useState("");
  const [selectedReason, setSelectedReason] = useState<string>("");
  const [input1, setInput1] = useState("");
  const maxLength = 200;
  const { id } = params;
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isPopupOpenMore, setIsPopupOpenMore] = useState(false);
  const [isSharePopupOpen, setIsSharePopupOpen] = useState(false);
  const [popupInput, setPopupInput] = useState("");
  const [postData, setPostData] = useState<PostData | null>(null);
  const [topic, setTopic] = useState("");
  const [course, setCourse] = useState("");
  const [description, setDescription] = useState("");
  const { t, i18n } = useTranslation("translation");
  const [setheart, setHeart] = useState(0);
  const [isHeartClicked, setIsHeartClicked] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [comments, setComments] = useState([]);
  const [commentInput, setCommentInput] = useState("");
  const [replyInput, setReplyInput] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null); // เก็บ ID ของ comment ที่กำลังตอบกลับ
  const [blogname, setBlogname] = useState<string | null>(null);
  const [blogEmail, setBlogEmail] = useState<string | null>(null);
  const [blogid, setBlogid] = useState<string | null>(null);
  const [profileUser, setProfileUser] = useState<string[]>([]);
  const [profileUserN, setProfileUserN] = useState<ProfileUser | null>(null);
  const [failedImages, setFailedImages] = useState<string[]>([]);
  const getPostById = useCallback(async (postId: string) => {
    try {
      const res = await fetch(`/api/posts/${postId}`, {
        method: "GET",
        cache: "no-store",
      });

      if (!res.ok) {
        throw new Error("Failed to fetch post");
      }

      const data = await res.json();

      // แก้ไขการจัดการ timestamp โดยใช้ค่าจากฐานข้อมูลโดยตรง
      const formattedPost = {
        ...data.post,
        comments: data.post.comments.map((comment: Comment) => ({
          ...comment,
          // ใช้ timestamp จากฐานข้อมูล
          timestamp: comment.timestamp,
          replies:
            comment.replies?.map((reply: Reply) => ({
              ...reply,
              // ใช้ timestamp จากฐานข้อมูลสำหรับ reply
              timestamp: reply.timestamp,
            })) || [],
        })),
      };

      setPostData(formattedPost);
      return formattedPost;
    } catch (error) {
      console.error("Error fetching post:", error);
      return null;
    }
  }, []);
  const getPostByIdprofile = useCallback(async () => {
    if (!session?.user?.id) {
      console.error("User ID not available.");
      return;
    }

    try {
      const res = await fetch(`/api/editprofile/${session.user.id}`, {
        method: "GET",
        cache: "no-store",
      });

      if (!res.ok) {
        throw new Error("Failed to fetch a post");
      }

      const data = await res.json();
      console.log("Fetched profile data: ", data);

      const postP = data.combinedData;
      setProfileUserN(postP);
    } catch (error) {
      console.log("Error fetching profile:", error);
    }
  }, [session?.user?.id]); // Add dependency

  useEffect(() => {
    if (session?.user?.id) {
      getPostByIdprofile();
    }
  }, [session?.user?.id, getPostByIdprofile]);

  useEffect(() => {
    if (id) {
      getPostById(id);
    }
  }, [id, getPostById]);

  useEffect(() => {
    getPostById(id);
  }, [id, getPostById]);

  if (status === "loading") {
    return (
      <div className="flex justify-center items-center min-h-screen">
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

  if (!postData) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  const handleShareClick = () => {
    setIsSharePopupOpen(!isSharePopupOpen);
  };

  const handleMoreClick = () => {
    setIsPopupOpenMore(!isPopupOpenMore);
  };

  const handleDelete2 = async () => {
    const result = await Swal.fire({
      title: "คุณต้องการลบบล็อกนี้ใช่หรือไม่?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "ใช่, ลบเลย!",
      cancelButtonText: "ยกเลิก",
    });

    if (result.isConfirmed) {
      try {
        const res = await fetch(`/api/posts/delete/${postData?._id}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id }),
        });
        if (res.ok) {
          Swal.fire("Deleted!", "โครงงานและบล็อกถูกลบเรียบร้อยแล้ว", "success");
          router.push("/listblog");
        } else {
          const data = await res.json();
          Swal.fire("Error", `${data.message || "ลบไม่สำเร็จ"}`, "error");
        }
      } catch (error) {
        console.error("Error deleting post:", error);
        Swal.fire("Error", "มีข้อผิดพลาดในการลบโครงงาน/บล็อก", "error");
      }
    }
  };

  const handleDelete = async () => {
    const result = await Swal.fire({
      title: "คุณต้องการลบบล็อกนี้ใช่หรือไม่?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "ใช่, ลบเลย!",
      cancelButtonText: "ยกเลิก",
    });

    if (result.isConfirmed) {
      try {
        const res = await fetch(`/api/posts/${postData?._id}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id }),
        });
        if (res.ok) {
          Swal.fire("Deleted!", "โครงงานและบล็อกถูกลบเรียบร้อยแล้ว", "success");
          router.push("/listblog");
        } else {
          const data = await res.json();
          Swal.fire("Error", `${data.message || "ลบไม่สำเร็จ"}`, "error");
        }
      } catch (error) {
        console.error("Error deleting post:", error);
        Swal.fire("Error", "มีข้อผิดพลาดในการลบโครงงาน/บล็อก", "error");
      }
    }
  };

// const handleDelete = async () => {
//   const result = await Swal.fire({
//     title: "คุณต้องการลบบล็อกนี้ใช่หรือไม่?",
//     icon: "warning",
//     showCancelButton: true,
//     confirmButtonColor: "#3085d6",
//     cancelButtonColor: "#d33",
//     confirmButtonText: "ใช่, ลบเลย!",
//     cancelButtonText: "ยกเลิก",
//   });

//   if (result.isConfirmed) {
//     try {
//       const delete1 = fetch(`/api/posts/delete/${postData?._id}`, {
//         method: "DELETE",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ id }),
//       });

//       const delete2 = fetch(`/api/posts/${postData?._id}`, {
//         method: "DELETE",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ id }),
//       });

//       const responses = await Promise.all([delete1, delete2]);

//       const allOk = responses.every((res) => res.ok);

//       if (allOk) {
//         Swal.fire("Deleted!", "โครงงานและบล็อกถูกลบเรียบร้อยแล้ว", "success");
//         router.push("/listblog");
//       } else {
//         const messages = await Promise.all(
//           responses.map(async (res) => (res.ok ? null : await res.json()))
//         );
//         const errorMessage = messages
//           .filter((msg) => msg?.message)
//           .map((msg) => msg.message)
//           .join(", ") || "ลบไม่สำเร็จ";
//         Swal.fire("Error", errorMessage, "error");
//       }
//     } catch (error) {
//       console.error("Error deleting posts:", error);
//       Swal.fire("Error", "มีข้อผิดพลาดในการลบโครงงาน/บล็อก", "error");
//     }
//   }
// };

  const formatDate = (timestamp: any): string => {
    try {
      if (!timestamp) {
        return "ไม่ระบุเวลา";
      }

      let date: Date;

      // แปลง timestamp เป็น Date object
      if (typeof timestamp === "string") {
        date = new Date(timestamp);
      } else if (typeof timestamp === "number") {
        date = new Date(timestamp);
      } else if (timestamp instanceof Date) {
        date = timestamp;
      } else {
        date = new Date();
      }

      if (isNaN(date.getTime())) {
        console.error("Invalid timestamp value:", timestamp);
        return "ไม่ระบุเวลา";
      }

      const day = date.getDate().toString().padStart(2, "0");
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const year = date.getFullYear().toString().slice(-2);
      const hours = date.getHours().toString().padStart(2, "0");
      const minutes = date.getMinutes().toString().padStart(2, "0");

      return `${day}/${month}/${year} ${hours}:${minutes}`;
    } catch (error) {
      console.error("Error in formatDate:", error);
      return "ไม่ระบุเวลา";
    }
  };

  const handleAddCommentOrReply = async (
    isReply: boolean,
    commentId: string | null = null
  ) => {
    if (!session || !postData) {
      Swal.fire("Error", "Please log in to comment.", "error");
      return;
    }

    try {
      const imageUrl = profileUserN?.imageUrl?.[0];
      const currentTime = new Date().toISOString(); // สร้าง timestamp ในรูปแบบ ISO string

      const newComment = {
        _id: `temp-${Date.now()}`,
        text: isReply ? replyInput : commentInput,
        userName: session.user?.name || "Anonymous",
        profileImageSource: imageUrl
          ? `/api/posts/images/${imageUrl}`
          : undefined,
        timestamp: currentTime, // ใช้ timestamp ที่เพิ่งสร้าง
        replies: [],
      };

      // อัพเดท UI ก่อน
      setPostData((prevData) => {
        if (!prevData) return prevData;

        if (isReply && commentId) {
          return {
            ...prevData,
            comments: prevData.comments.map((comment) => {
              if (comment._id === commentId) {
                return {
                  ...comment,
                  replies: [...(comment.replies || []), newComment],
                };
              }
              return comment;
            }),
          };
        } else {
          return {
            ...prevData,
            comments: [...prevData.comments, newComment],
          };
        }
      });

      // ส่งข้อมูลไปยัง API
      const res = await fetch(`/api/posts/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: isReply ? replyInput : commentInput,
          action: isReply ? "reply" : "comment",
          profile: imageUrl,
          emailcomment: session?.user?.email || "Anonymous",
          timestamp: currentTime,
          commentId: isReply ? commentId : null,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to save comment");
      }

      // เคลียร์ input
      if (isReply) {
        setReplyInput("");
        setReplyingTo(null);
      } else {
        setCommentInput("");
      }

      // ดึงข้อมูลใหม่จาก API
      await getPostById(id);
    } catch (error) {
      console.error("Error adding comment:", error);
      Swal.fire("Error", "Failed to save comment. Please try again.", "error");
    }
  };

  const getProfileImagePath = (imageUrl: string | null | undefined): string => {
    if (!imageUrl) return "/default-profile-icon.png";

    const isFullUrl =
      imageUrl.startsWith("http://") || imageUrl.startsWith("https://");
    if (isFullUrl) {
      return `/api/proxy?url=${encodeURIComponent(imageUrl)}`;
    }

    if (!imageUrl.startsWith("/")) {
      return `/api/posts/images/${imageUrl}`;
    }

    return imageUrl;
  };

  const handleReviewChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setReview(event.target.value);
  };

  const handlePrevClick = () => {
    setCurrentIndex(
      (prevIndex) =>
        (prevIndex - 1 + postData.imageUrl.length) % postData.imageUrl.length
    );
  };

  const handleNextClick = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % postData.imageUrl.length);
  };

  const handleReasonChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedReason(event.target.value);
  };

const handlePopupSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
  e.preventDefault();

  if (!session) {
    Swal.fire({
      position: "center",
      icon: "error",
      title: t("report.blog.login"),
      showConfirmButton: false,
      timer: 3000,
    });
    return;
  }

  // Validate required data
  if (!postData || !report || !selectedReason) {
    Swal.fire({
      icon: "warning",
      title: t("report.blog.found"),
      text: t("report.blog.fdes"),
      showConfirmButton: true,
    });
    return;
  }

  // Prepare data object
  const data = {
    blogname: postData.topic,
    blogEmail: postData.email,
    blogid: postData._id,
    report: report,
    selectedReason: selectedReason,
    author: session.user?.name
  };

  console.log("Data to be sent:", data); // For debugging

  try {
    const response = await fetch("/api/reportblog", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      Swal.fire({
        icon: 'success',
        title: t("report.blog.thank"),
        text: t("report.blog.thankdes"),
        showConfirmButton: false,
        timer: 1500
      }).then(() => {
        setIsPopupOpen(false);
        router.push(`/blog/${postData._id}`);
      });
    } else {
      const responseData = await response.json();
    }
  } catch (error) {
  }
};

  const togglePopup = () => {
    if (session) {
      setIsPopupOpen(!isPopupOpen);
    } else {
      // alert("Please log in to save favorites");
      Swal.fire("Error", "Please log in to report.", "error");
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
      `Digitech Space project: ${postData.topic} by: ${postData.author}`
    );
    window.open(
      `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${text}`,
      "_blank"
    );
  };

  const charactersRemaining = maxLength - review.length;
  const handleSubmit = () => {
    setInput1("");
  };

  const UserId = session?.user?.id ?? "";

  console.log("UserId :", UserId);

  const handleSubmitCiHeart = async (e: React.MouseEvent<SVGElement>) => {
    if (session) {
      const isLiked =
        Array.isArray(postData?.likedByUsers) &&
        postData.likedByUsers.includes(UserId);

      try {
        const actionheart = isLiked ? "unlike" : "like";
        const heart = isLiked ? postData.heart - 1 : postData.heart + 1;

        const blogRes = await fetch(
<<<<<<< HEAD
          `http://digiproj.sut.ac.th:3001/api/posts/${postData._id}`,
=======
          `/api/posts/${postData._id}`,
>>>>>>> ba2b583b783cc799a81228eb0dc798efbff332bc
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              userId: UserId,
              actionheart,
              setheart: heart,
            }),
          }
        );

        if (!blogRes.ok) {
          throw new Error("Failed to update blog post");
        }

        // อัปเดต state
        setHeart(heart); // อัปเดตค่าของ heart ใน state
        setIsHeartClicked(!isLiked); // เปลี่ยนสถานะของ isHeartClicked ตามค่า isLiked

        // ดึงข้อมูลโพสต์ใหม่
        await getPostById(postData._id);
      } catch (error) {
        console.error("Error updating:", error);
        Swal.fire({
          position: "center",
          icon: "error",
          title: "An error occurred",
          text: "error.message",
          showConfirmButton: true,
        });
      }
    } else {
      // alert("Please log in to save favorites");
      Swal.fire("Error", "Please log in to save favorites.", "error");
    }
  };

  const getImageSource = (post: PostData): string => {
    // Helper function for proxy URL
    const getProxyUrl = (url: string): string =>
      `/api/proxy?url=${encodeURIComponent(url)}`;

    // Helper function to check if URL is valid
    const isValidHttpUrl = (string: string): boolean => {
      try {
        const url = new URL(string);
        return url.protocol === "http:" || url.protocol === "https:";
      } catch (_) {
        return false;
      }
    };

    if (post.profileImage && post.profileImage.length > 0) {
      const profileImage = post.profileImage[0];
      if (isValidHttpUrl(profileImage)) {
        return getProxyUrl(profileImage);
      } else {
        return `/api/posts/images/${profileImage}`;
      }
    }

    return "/default-profile-icon.png";
  };
  const handleRedirect = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!session) {
      e.preventDefault();
      router.push("/auth/signin");
    }
  };
  return (
    <Container>
      <Navbar />
      <main className="flex flex-col items-center w-full">
        <div className="w-full max-w-screen-lg p-4">
          <div className="flex flex-col">
            <div className="relative w-auto h-96 md:h-[860px] lg:h-[860px] rounded-xl">
              {postData && postData.imageUrl ? (
                <Image
                  width={200}
                  height={200}
                  src={`/api/posts/images/${postData.imageUrl[currentIndex]}`}
                  alt={postData.topic || "Blog Image"}
                  className="w-full h-full object-cover rounded-lg"
                  quality={100}  // เพิ่ม quality เป็น 100%
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 100vw, 100vw"  // ปรับ sizes
                />
              ) : (
                <Image
                  width={200}
                  height={200}
                  src="/path/to/placeholder-image.jpg" // Fallback if imageUrl is undefined
                  alt="Placeholder"
                  className="w-full h-full object-cover rounded-lg"
                />
              )}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                <button
                  className={`w-3 h-3 rounded-full`}
                  // onClick={() => handleIndicatorClick()}
                ></button>
              </div>
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
            <div className="flex flex-row items-center">
              <Link
                href={`/Profile/ViewProfile/${postData.userprofileid || "#"}`}
                onClick={handleRedirect}
              >
                <div className="flex flex-row mt-5 mb-5 items-center text-lg">
                  {postData.profileImage && !failedImages.includes(postData._id) ? (
                    <Image
                      width={30}
                      height={30}
                      src={postData.profileImage}
                      alt={`${postData.authorName}'s profile`}
                      style={{
                        objectFit: "cover",
                        borderRadius: "50%",
                        width: "30px",
                        height: "30px",
                        marginRight: "10px",
                      }}
                      className="w-8 h-8 rounded-full mr-2 mt-1 text-gray-500"
                      onError={() => {
                        setFailedImages((prev) => [...prev, postData._id]);
                      }}
                    />
                  ) : (
                    <MdAccountCircle className="w-8 h-8 rounded-full mr-2 mt-1 text-gray-500" />
                  )}
                  <div className="flex flex-col justify-center w-[400px]">
                    {postData && postData.authorName ? (
                      <h1 className="font-bold">{postData.authorName}</h1>
                    ) : (
                      <h1 className="font-bold">Anonymous</h1> // กรณีที่ไม่มีข้อมูลผู้เขียน
                    )}
                  </div>
                </div>
              </Link>

              <div className="ml-[500px] relative flex justify-end">
                {/* Dropdown Toggle */}
                {session?.user?.email === postData.email && (

                <button
                  className="p-2 rounded-full hover:bg-gray-200 transition"
                  onClick={handleMoreClick}
                >
                  <BsThreeDots size={20} />
                </button>
                )}

                {/* Dropdown Menu */}
                {isPopupOpenMore && (
                  <div className="absolute top-10 right-0 bg-white shadow-lg rounded-md z-10">
                    <Link
                      href={`/Editblog/${postData._id}`}
                      className="w-36 flex items-center px-4 py-2 text-gray-800 hover:bg-gray-100 transition"
                    >
                      <FaEdit className="mr-2 text-blue-600" />
                      {t("nav.blog.edit")}
                    </Link>
                    <button
                      onClick={handleDelete}
                      className="w-36 flex items-center w-full px-4 py-2 text-red-600 hover:bg-gray-100 transition"
                    >
                      <FaTrash className="mr-2" />
                      {t("nav.blog.delete")}
                    </button>
                  </div>
                )}
              </div>
            </div>
            <div className="flex flex-wrap my-2">
              <Link
                href=""
                className="text-white rounded-md p-2 m-1"
                style={{ backgroundColor: "#33529B" }}
              >
                {postData && postData.course ? (
                  <h1 className="font-bold">{postData.course}</h1>
                ) : (
                  <h1 className="font-bold">No Course Available</h1> // กรณีที่ไม่มีข้อมูลคอร์ส
                )}
                {/* {t("nav.blog.code")} {postData.course} */}
              </Link>
              <Link
                href=""
                className="text-white rounded-md p-2 m-1"
                style={{ backgroundColor: "#33529B" }}
              >
                {postData && postData.selectedCategory ? (
                  postData.selectedCategory
                ) : (
                  <h1 className="font-bold">No Category Available</h1>
                )}
              </Link>
            </div>

            <div className="mt-5 mb-3">
              {postData && postData.topic ? (
                <h1 className="text-2xl">
                  <strong>{postData.topic}</strong>
                </h1>
              ) : (
                <h1>No Topic Available</h1>
              )}
            </div>

            <div className="mb-5">
              {postData && postData.description ? (
                <p>{postData.description}</p>
              ) : (
                <p>No Description Available</p>
              )}
            </div>

            <div className="flex justify-between items-center border-b-2 border-t-2 border-gray-200 py-3 mt-4 mb-3">
              <div className="flex space-x-4">
                <div className="flex items-center">
                  <CiHeart
                    className={`text-3xl cursor-pointer ${
                      Array.isArray(postData?.likedByUsers) &&
                      postData.likedByUsers.includes(UserId)
                        ? "text-red-500"
                        : "text-gray-500"
                    }`}
                    onClick={handleSubmitCiHeart}
                  />
                  {postData && postData.heart !== undefined ? (
                    <p>{postData.heart}</p>
                  ) : (
                    <p>No Heart Data Available</p>
                  )}
                </div>
                <div className="flex items-center">
                  <BsChatDots className="text-2xl" />
                  <p className="ml-1">{postData?.comments?.length || 0}</p>
                </div>
              </div>
              <div className="flex space-x-4">
                <div className="relative flex justify-center">
                  <IoShareOutline
                    className="text-2xl cursor-pointer"
                    onClick={handleShareClick}
                  />

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

                <AiOutlineNotification
                  className="text-2xl cursor-pointer"
                  onClick={togglePopup}
                />
              </div>
            </div>

            <div className="mt-5">
              <h1 className="font-bold text-2xl">{t("nav.blog.comment")}</h1>
            </div>

            {/* // ส่วนแสดงผล Comments และ Replies */}
            <div>
              {Array.isArray(postData?.comments) &&
                postData.comments.map((comment: Comment) => (
                  <div key={comment._id} className="flex flex-col mt-3 p-2">
                    <div className="flex flex-col">
                      <p className="flex flex-row">
                        {comment.profileImageSource &&
                        !failedImages.includes(comment._id) ? (
                          <Image
                            width={36}
                            height={36}
                            src={getProfileImagePath(
                              comment.profileImageSource
                            )}
                            alt={`${comment.userName}'s profile`}
                            style={{
                              objectFit: "cover",
                              borderRadius: "50%",
                              width: "30px",
                              height: "30px",
                              marginRight: "10px",
                            }}
                            className=" rounded-full mr-2 mt-1 text-gray-500"
                            onError={() => {
                              setFailedImages((prev) => [...prev, comment._id]);
                            }}
                          />
                        ) : (
                          <MdAccountCircle className="w-[36px] h-[36px] rounded-full mr-2 mt-1 text-gray-500" />
                        )}
                        <strong className="flex flex-col justify-center text-lg">
                          {comment.userName}
                        </strong>
                      </p>
                      <div className="flex flex-row">
                        <div className="flex flex-col">
                          <div className="flex flex-row">
                            <p className="text-sm text-gray-500 ml-10">
                              {comment.timestamp.toString()}
                            </p>
                            <button
                              onClick={() => setReplyingTo(comment._id)}
                              className="font-bold text-[#0E6FFF] ml-4"
                            >
                              {t("nav.blog.reply")}
                            </button>
                          </div>
                          <p className="text-lg ml-10">{comment.text}</p>
                          {replyingTo === comment._id && (
                            <div className="flex flex-col ml-10 mt-2">
                              <textarea
                                className="border-2 rounded p-2"
                                value={replyInput}
                                onChange={(e) => setReplyInput(e.target.value)}
                                placeholder={t("nav.blog.comment")}
                              />
                              <div className="flex flex-row w-80 justify-end mt-2">
                                <button
                                  className="m-2 border-2 rounded-md p-1 w-32 bg-[#33539B] text-white text-sm"
                                  onClick={() => {
                                    handleAddCommentOrReply(true, comment._id);
                                  }}
                                >
                                  {t("nav.blog.reply")}
                                </button>
                                <button
                                  className="m-2 border-2 rounded-md p-1 w-32 bg-[#9B3933] text-white text-sm"
                                  onClick={() => setReplyingTo(null)}
                                >
                                  {t("nav.blog.cancel")}
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Replies section */}
                    {comment.replies && comment.replies.length > 0 && (
                      <div className="ml-10 mt-2">
                        {comment.replies.map((reply: any) => (
                          <div key={reply._id} className="mt-2">
                            <p className="flex flex-row">
                              {reply.profileImageSource &&
                              !failedImages.includes(comment._id) ? (
                                <Image
                                  width={36}
                                  height={36}
                                  src={getProfileImagePath(
                                    reply.profileImageSource
                                  )}
                                  alt={`${reply.userName}'s profile`}
                                  style={{
                                    objectFit: "cover",
                                    borderRadius: "50%",
                                    width: "30px",
                                    height: "30px",
                                    marginRight: "10px",
                                  }}
                                  className=" rounded-full mr-2 mt-1 text-gray-500"
                                  onError={() => {
                                    setFailedImages((prev) => [...prev, reply._id]);
                                  }}
                                />
                              ) : (
                                <MdAccountCircle className="w-[36px] h-[36px] rounded-full mr-2 mt-1 text-gray-500" />
                              )}
                              <strong className="flex flex-col justify-center text-lg">
                                {reply.userName}
                              </strong>
                            </p>
                            <p className="text-sm text-gray-500 ml-10">
                              {reply.timestamp.toString()}
                            </p>
                            <p className="text-lg ml-10">{reply.text}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
            </div>
            <textarea
              value={commentInput}
              onChange={(e) => setCommentInput(e.target.value)}
              placeholder={t("nav.blog.comment")}
              className="w-full p-2 border-2 rounded-md resize-none mt-4 h-32"
              style={{ paddingRight: "100px" }}
            />
            <div className="flex flex-row justify-end m-4">
              <button
                onClick={() => handleAddCommentOrReply(false)}
                className="่justify-end bottom-2 right-2 rounded-md p-1 w-32 bg-[#33539B] text-white text-sm h-12"
              >
                <p className="font-bold">{t("nav.home.service.send")}</p>
              </button>
            </div>
            {isPopupOpen && (
              <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-50">
                <div className="relative max-w-lg w-full p-8 bg-white shadow-md rounded-lg">
                  <GoX
                    onClick={() => setIsPopupOpen(false)}
                    className="absolute top-4 right-4 text-red-600 text-3xl cursor-pointer"
                  />
                  <h2 className="text-2xl font-bold mb-4 text-center">
                    {t("report.title")}
                  </h2>
                  <p className="text-lg font-medium mb-4 ">
                    {t("report.blog.topic")} : {postData.topic}
                  </p>
                  <div className="border-b border-gray-300 my-3"></div>
                  <p className="text-lg font-medium mb-2">
                    {t("report.blog.reason")}
                  </p>
                  <select
                    value={selectedReason}
                    onChange={(e) => setSelectedReason(e.target.value)}
                    className="w-full p-2 border rounded-md mb-5"
                  >
                    <option value="มีคำไม่สุภาพ หรือ คำหยาบคาย">
                      {t("report.blog.r1")}
                    </option>
                    <option value="เนื้อหาไม่ตรงกับหัวข้อ">
                      {t("report.blog.r2")}
                    </option>
                    <option value="มีการโฆษณาสิ่งผิดกฎหมาย, เว็บพนัน, แชร์ลูกโซ่">
                      {t("report.blog.r3")}
                    </option>
                    <option value="บทความไม่เกี่ยวข้องกับวิชาเรียน หรือมหาวิทยลัย">
                      {t("report.blog.r4")}
                    </option>
                    <option value="อื่นๆ">{t("report.blog.r5")}</option>
                  </select>
                  <p className="text-lg font-medium mb-2">
                    {t("report.blog.add")}
                  </p>
                  <div className="relative mb-5">
                    <textarea
                      placeholder={t("report.text")}
                      onChange={(e) => setreport(e.target.value)}
                      className="w-full h-40 p-3 border-2 border-gray-300 rounded-md resize-none"
                      maxLength={maxLength}
                    />
                    <div className="absolute bottom-2 right-2 text-gray-500 text-sm">
                      {charactersRemaining} / {maxLength}
                    </div>
                  </div>
                  <button
                    onClick={handlePopupSubmit}
                    className="w-full bg-red-500 text-white py-2 rounded-md hover:bg-red-600 transition-colors duration-200"
                  >
                    {t("report.send")}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </Container>
  );
}

export default Blog;
