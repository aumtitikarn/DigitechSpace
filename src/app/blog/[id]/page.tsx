"use client";

import React, { use } from "react";
import { useEffect, useState } from "react";
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
import Swal from 'sweetalert2';
import { profile } from "console";
import { FaLink } from "react-icons/fa";
import { FaFacebook } from "react-icons/fa";
import { RiTwitterXLine } from "react-icons/ri";
import e from "express";

interface BlogProps {
  params: { id: string }; // ตัวอย่างการกำหนด type สำหรับ params
  initialComments: string[]; // ตัวอย่างการกำหนด type สำหรับ initialComments
}

function Blog({ params, initialComments }: BlogProps) {
  const [review, setReview] = useState("");
  const [report, setreport] = useState("");
  const [selectedReason, setSelectedReason] = useState<string>("");
  const [blogname, setBlogname] = useState("")
  const maxLength = 200;

  const { id } = params;

  const { data: session, status } = useSession();
  const router = useRouter();

  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isSharePopupOpen, setIsSharePopupOpen] = useState(false);
  const [popupInput, setPopupInput] = useState("");

  const [postData, setPostData] = useState<PostData>([]);
  
  interface PostData {
    _id: string; // Assuming _id is a string
    topic: string;
    course: string;
    description: string;
    heart: number;
    imageUrl: string[];
    userprofileid: string[];
    userprofile: string[];
    author: string;
    profileImage: string[];
    authorName: string;
    email: string;
    comments: any[]; // Or a more specific type
    likedByUsers: any[]; // Or a more specific type
    selectedCategory: string;
    onClosets?: () => void;
  }



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
  const [replyingTo, setReplyingTo] = useState(null); // เก็บ ID ของ comment ที่กำลังตอบกลับ

  const [blogid, setBlogid] = useState("");
  const [blogEmail, setBlogEmail] = useState("");

  const [profileUser, setProfileUser] = useState<string[]>([]);

  // interface Profile {
  //   imageUrl: string;
  // }

  const [profileUserN, setProfileUserN] = useState<ProfileUser | null>(null);

  interface ProfileUser {
    imageUrl: string[];
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
    email: string;
    comments: any[]; // You might want to define a more specific type for comments
    likedByUsers: any[]; // You might want to define a more specific type for likedByUsers
    selectedCategory: string;
  }

  const handleShareClick = () => {
    setIsSharePopupOpen(!isSharePopupOpen); // Toggle popup open/close
  };


  const getPostByIdprofile = async () => {
    if (!session?.user?.id) {
      console.error("User ID not available.");
      return;
    }

    try {
      const res = await fetch(`/api/editprofile/${session?.user?.id}`, {
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
  };

  useEffect(() => {
    if (session?.user?.id) {
      getPostByIdprofile();
    } else {
      console.error("User ID not found in session.");
    }
  }, [session?.user?.id]);
  


  const handleAddCommentOrReply = async (isReply: boolean, commentId = null) => {
    if(session){
    const imageUrl = profileUserN?.imageUrl?.[0] || "/path/to/default-image.jpg"; // ใช้รูปภาพเริ่มต้นหากไม่มี
    setProfileUser([imageUrl]);

    const requestBody = {
      text: isReply ? replyInput : commentInput,
      action: isReply ? "reply" : "comment",
      // author: session?.user?.name || "Anonymous",
      // profile: isReply ? imageUrl : imageUrl,
      timestamp: new Date(),
      ...(isReply && { commentId }), // ส่ง commentId ถ้าเป็นการตอบกลับ
    };

    try {
      const res = await fetch(`/api/posts/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      if (res.ok) {
        const updatedData = await res.json();
        setComments(updatedData.post.comments); // อัปเดตคอมเมนต์ใหม่
        setCommentInput("");
        setReplyInput("");
        setReplyingTo(null);
        router.refresh();
        router.push(`/blog/${id}`);
      }
    } catch (error) {
      console.log(error);
    }
  }else {
    // alert("Please log in to save favorites");
    Swal.fire('Error', 'Please log in to comment.', 'error');
  }
  };

  useEffect(() => {
    console.log("Updated Profile URL:", profileUser);
  }, [profileUser]);



  ////////////////////////////////

  ////////////////////////////////


  const [input1, setInput1] = useState("");
  const handleReviewChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setReview(event.target.value);
  };

  const handlePrevClick = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + postData.imageUrl.length) % postData.imageUrl.length
    );
  };

  const handleNextClick = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % postData.imageUrl.length);
  };

  const handleReasonChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedReason(event.target.value);
  };

  const getPostById = async (id: string) => {
    try {
      const res = await fetch(`http://localhost:3000/api/posts/${id}`, {
        method: "GET",
        cache: "no-store",
      });

      if (!res.ok) {
        throw new Error("Failed to fetch a post");
      }

      const data = await res.json();
      console.log("Edit post: ", data);

      setPostData(data.post);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getPostById(id);
  }, []);

  const handlePopupSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault(); // Prevent button's default behavior
  
    // Set blogid and blogEmail from postData
    setBlogname(postData.topic);
    setBlogEmail(postData.email);
    setBlogid(postData._id);
  
    // Debugging: check the values
    console.log("Blog name:", postData.topic);
    console.log("Blog Email:", postData.email);
    console.log("Blog ID:", postData._id);
    console.log("authorName:", comment.authorName);
    
    const formData = new FormData();
  
    // Check if the user is authenticated
    if (!session || !session.user || !session.user.name) {
      Swal.fire({
        position: "center",
        icon: "error",
        title: "User is not authenticated",
        showConfirmButton: false,
        timer: 3000,
      });
      return;
    }
  
    // Check if all required fields are filled
    if (!report || !selectedReason) {
      alert("Please complete all inputs");
      return;
    }
  
    // Append form data
    formData.append("blogname", postData.topic);
    formData.append("selectedReason", selectedReason);
    formData.append("report", report);
    formData.append("author", session.user.name);
    formData.append("blogid", postData._id);
    formData.append("blogEmail", postData.email);
  
    try {
      const res = await fetch("http://localhost:3000/api/reportblog", {
        method: "POST",
        body: formData,
      });
  
      if (res.ok) {
        router.push(`/blog/${postData._id}`);
        setIsPopupOpen(false);
      } else {
        console.error("Error:", res.statusText);
      }
    } catch (error) {
      console.error("Error submitting the form:", error);
    }
  };

  const togglePopup = () => {
    if (session) {
    setIsPopupOpen(!isPopupOpen);
    } else {
      // alert("Please log in to save favorites");
      Swal.fire('Error', 'Please log in to report.', 'error');
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
    const text = encodeURIComponent(`Digitech Space project: ${postData.topic} by: ${postData.author}`);
    window.open(
      `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${text}`,
      "_blank"
    );
  };


  // const handlePopupSubmit = () => {
  //   alert(`Popup Input: ${popupInput}`);
  //   setPopupInput("");
  //   setIsPopupOpen(false);
  // };

  const charactersRemaining = maxLength - review.length;
  const handleSubmit = () => {
    setInput1("");
  };

  // const UserId = session?.user?.id;

  const UserId = session?.user?.id ?? "";

  console.log("UserId :", UserId);

  const handleSubmitCiHeart = async (e: React.MouseEvent<SVGElement>) => {
    if(session){

    // ตรวจสอบว่าใน likedByUsers มี userId อยู่หรือไม่
    const isLiked = Array.isArray(postData?.likedByUsers) && postData.likedByUsers.includes(UserId);

    try {
      const actionheart = isLiked ? 'unlike' : 'like'; // กำหนด actionheart ว่าจะเป็นการ like หรือ unlike
      const heart = isLiked ? postData.heart - 1 : postData.heart + 1; // ถ้าเคยกดแล้วจะลบ 1 ถ้ายังไม่เคยจะเพิ่ม 1

      // ส่งข้อมูลไปยัง backend
      const blogRes = await fetch(`http://localhost:3000/api/posts/${postData._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: UserId, actionheart, setheart: heart }),
      });

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
        position: 'center',
        icon: 'error',
        title: 'An error occurred',
        text: 'error.message',
        showConfirmButton: true,
      });
    }
  }else {
      // alert("Please log in to save favorites");
      Swal.fire('Error', 'Please log in to save favorites.', 'error');
    }
  };



  if (status === "loading") {
    return <div style={{
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      textAlign: "center",
    }}>
      <OrbitProgress variant="track-disc" dense color="#33539B" size="medium" text="" textColor="" />
    </div>;
  }

  // const [currentIndex, setCurrentIndex] = useState(0);

  // const handleIndicatorClick = () => {
  //   setCurrentIndex();
  // };
  interface PostData {
    _id: string;
    topic: string;
    course: string;
    onClose: () => void;
    // Add any other properties that are in your post data
  }

  interface Reply {
    _id: string;
    profile?: string[];
    author: string;
    text: string;
  }


  const getImageSource = (post: PostData): string => {
    const useProxy = (url: string): string => `/api/proxy?url=${encodeURIComponent(url)}`;
  
    const isValidHttpUrl = (string: string): boolean => {
      let url;
      try {
        url = new URL(string);
      } catch (_) {
        return false;
      }
      return url.protocol === "http:" || url.protocol === "https:";
    };
  
    if (post.profileImage && post.profileImage.length > 0) {
      const profileImage = post.profileImage[0];
      if (isValidHttpUrl(profileImage)) {
        return useProxy(profileImage);
      } else {
        return `/api/posts/images/${profileImage}`;
      }
    }
  
    // Fallback to default image if no userprofile is available
    return "/default-profile-icon.png";
  };
  

  return (
    <Container>
      <Navbar/>
      <main className="flex flex-col items-center w-full">
        <div className="w-full max-w-screen-lg p-4">
          <div className="flex flex-col">
            <div className="relative w-auto h-96 md:h-[860px] lg:h-[860px] rounded-xl">
              {/* <img
                src="https://64.media.tumblr.com/52eaf78ffa891980b680c5e12b15437e/tumblr_pmhq6nlBzJ1tk9psf_1280.jpg"
                className="object-cover w-full h-full md:aspect-w-3 md:aspect-h-4 rounded-xl"
                alt="Blog Image"
              /> */}
              {postData && postData.imageUrl ? (
                <Image
                  width={200}
                  height={200}
                  src={`/api/posts/images/${postData.imageUrl[currentIndex]}`}
                  alt={postData.topic || "Blog Image"}
                  className="w-full h-full object-cover rounded-lg"
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
            <Link href={postData?.userprofileid ? `/Profile/ViewProfile/${postData.userprofileid}` : '#'}>
              <div className="flex flex-row mt-5 mb-5 items-center">
                {postData?.profileImage && postData.profileImage[0] ? (
                  <Image
                  width={30}
                  height={30}
                  src={postData.profileImage}
                  alt="Profile"
                  onError={(
                    e: React.SyntheticEvent<
                      HTMLImageElement,
                      Event
                    >
                  ) => {
                    const target = e.target as HTMLImageElement;
                    target.onerror = null;
                    target.src = "/default-profile-icon.png";
                  }}
                  className="w-8 h-8 rounded-full mr-2 mt-1 text-gray-500"
                />
                ) : (
                  <MdAccountCircle className="text-gray-500 w-9 h-9 flex justify-center items-center rounded-full mr-4" />
                )}
                <div className="flex flex-col justify-center">
                  {postData && postData.authorName ? (
                    <h1 className="font-bold">{postData.authorName}</h1>
                  ) : (
                    <h1 className="font-bold">Anonymous</h1> // กรณีที่ไม่มีข้อมูลผู้เขียน
                  )}
                </div>
              </div>
            </Link>
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

            <div className="mt-5">
              {postData && postData.topic ? (
                <h1>{postData.topic}</h1>
              ) : (
                <h1>No Topic Available</h1>
              )}
            </div>

            <div className="mt-2 mb-3">
              {postData && postData.description ? (
                <p>{postData.description}</p>
              ) : (
                <p>No Description Available</p>
              )}
            </div>

            <div className="flex justify-between items-center border-b-2 border-t-2 border-gray-200 py-3">
              <div className="flex space-x-4">
                <div className="flex items-center">
                  <CiHeart
                    className={`text-3xl cursor-pointer ${Array.isArray(postData?.likedByUsers) && postData.likedByUsers.includes(UserId) ? 'text-red-500' : 'text-gray-500'
                      }`} // ถ้าผู้ใช้คนนี้เคยกด ให้แสดงเป็นสีแดง ถ้าไม่เคยกด ให้เป็นสีเทา
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
                <IoShareOutline className="text-2xl cursor-pointer" onClick={handleShareClick} />

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

            {/* แสดงฟอร์มแสดงความคิดเห็น */}

            <div>
              {Array.isArray(postData?.comments) &&
                postData.comments.map((comment) => (
                  <div key={comment._id} className="flex flex-col m-3 p-2">
                    <div className="flex flex-col">
                      <p className="flex flex-row">

                        {comment.profile && comment.profile[0] ? (
                          <Image
                            width={200}
                            height={200}
                            src={`/api/posts/images/${comment.profile}`}
                            alt={`${comment.author}'s profile picture`}
                            className="text-gray-500 w-9 h-9 flex justify-center items-center rounded-full mr-2"
                          />
                        ) : (
                          <MdAccountCircle className="text-gray-500 w-9 h-9 flex justify-center items-center rounded-full mr-2" />
                        )}

                        {/* <MdAccountCircle className="text-gray-500 w-9 h-9 flex justify-center items-center rounded-full mr-2" /> */}

                        <strong className="flex flex-col justify-center text-lg">{comment.authorName}</strong>
                      </p>
                      <div className="flex flex-row">
                      <p className="text-sm text-gray-500 ml-10">{new Date(comment.timestamp).toLocaleString()}</p>
                      <div className="flex flex-row">
                          {replyingTo === comment._id ? (
                            <div className="flex flex-col ml-4">

                              <textarea className="border-2 rounded p-2"
                                value={replyInput}
                                onChange={(e) => setReplyInput(e.target.value)}
                                placeholder="Reply to this comment"
                              />

                              <div className="flex flex-row w-80">
                                <div className="flex flex-row w-80 justify-end">
                                  <button className="m-2 border-2 rounded-md p-1 w-32 bg-[#33539B] text-white text-sm"
                                    onClick={() => handleAddCommentOrReply(true, comment._id)}
                                  >
                                    Replyt
                                  </button>
                                  <button className="m-2 border-2 rounded-md p-1 w-32 bg-[#9B3933] text-white text-sm"
                                    onClick={() => setReplyingTo(null)}
                                  >
                                    Cancel
                                  </button>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <button onClick={() => setReplyingTo(comment._id)} className="font-bold text-[#0E6FFF] ml-4">Reply</button>
                          )}
                        </div>
                        </div>
                      <p className="text-lg ml-10">{comment.text}</p>
                      <div className="flex flex-col ml-10">
                      </div>
                    </div>
                    {/* Handle replies if they exist */}
                    {comment.replies && comment.replies.length > 0 && (
                      <div style={{ marginLeft: '20px' }}>
                        {comment.replies.map((reply: Reply) => (
                          <div>
                            <p key={reply._id}></p>
                            <p className="flex flex-row">

                              {reply.profile && reply.profile[0] ? (
                                <Image
                                  width={200}
                                  height={200}
                                  src={`/api/posts/images/${reply.profile}`}
                                  alt={`${reply.author}'s profile picture`}
                                  className="text-gray-500 w-9 h-9 flex justify-center items-center rounded-full mr-2"
                                />
                              ) : (
                                <MdAccountCircle className="text-gray-500 w-9 h-9 flex justify-center items-center rounded-full mr-2" />
                              )}
                              <strong className="flex flex-col justify-center text-lg">{reply.author} : reply</strong>
                            </p>
                            <p className="text-sm text-gray-500 ml-10">{new Date(comment.timestamp).toLocaleString()}</p>
                            <p className="ml-4 text-lg">{reply.text}</p>
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
              placeholder="Comment"
              className="w-full p-2 border-2 rounded-md resize-none mt-4 h-32"
              style={{ paddingRight: '100px' }}  // Add space for the button
            />
            <div className="flex flex-row justify-end m-4">
              <button
                onClick={() => handleAddCommentOrReply(false)}
                className="่justify-end bottom-2 right-2 rounded-md p-1 w-32 bg-[#33539B] text-white text-sm h-12"
              >
                Send
              </button>
            </div>
            {isPopupOpen && (
              <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-50">
                <div className="relative max-w-lg w-full p-8 bg-white shadow-md rounded-lg">
                  <GoX
                    onClick={() => setIsPopupOpen(false)} // Use the onClose prop to close the modal
                    className="absolute top-4 right-4 text-red-600 text-3xl cursor-pointer"
                  />
                  <h2 className="text-2xl font-bold mb-4 text-center">
                    {t("report.title")}
                  </h2>
                  <p className="text-lg font-medium mb-4 ">
                    {t("report.blog.topic")} : {postData.topic}
                  </p>
                  <div className="border-b border-gray-300 my-3"></div>
                  {/* <p className="text-lg font-medium mb-3">หัวข้อที่รายงาน</p> */}
                  {/* <input
                    placeholder="หัวข้อที่ต้องการรายงาน"
                    onChange={(e) => setBlogname(e.target.value)}
                    className="w-full p-3 border-2 border-gray-300 rounded-md resize-none mb-3"
                    maxLength={maxLength}
                  /> */}
                  <p className="text-lg font-medium mb-2">{t("report.blog.reason")}</p>
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
                    <option value="อื่นๆ">
                      {t("report.blog.r5")}
                    </option>
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
