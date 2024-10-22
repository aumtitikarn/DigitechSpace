"use client";

import React, { useState, useEffect } from "react";
import { MdAccountCircle } from "react-icons/md";
import { FaPlus } from "react-icons/fa6";
import { OrbitProgress } from "react-loading-indicators";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import Container from "../../../components/Container";
import { useSession } from "next-auth/react";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Swal from "sweetalert2";

function page() {
  const { data: session, status, update } = useSession(); // Initialize session
  const { t } = useTranslation("translation");

  const [postData, setPostData] = useState([]);
  const [postDataS, setPostDataS] = useState([]);

  const router = useRouter();
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newLine, setNewLine] = useState("");
  const [newFacebook, setNewFacebook] = useState("");
  const [newPhonenumber, setNewPhonenumber] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }

    if (status === "authenticated" && session) {
      const fetchData = async () => {
        try {
          // Fetch published projects
          const publishedResponse = await fetch(
            "/api/project/getProjects/user",
            {
              method: "GET",
            }
          );
          if (publishedResponse.ok) {
            const publishedData = await publishedResponse.json();
            console.log("Published Data:", publishedData);
            setPublishedProjects(publishedData);
          } else {
            console.error("Failed to fetch published projects");
          }

          // Fetch blog posts
          const blogResponse = await fetch("/api/posts/getposts/user", {
            cache: "no-store",
          });
          if (blogResponse.ok) {
            const blogData = await blogResponse.json();
            setPostDataBlog(blogData);
          } else {
            console.error("Failed to fetch blog posts");
          }

          // Fetch user profile
          const profileResponse = await fetch(
            `/api/editprofile/${session.user.id}`,
            {
              method: "GET",
              cache: "no-store",
            }
          );
          if (profileResponse.ok) {
            const profileData = await profileResponse.json();
            console.log("Edit post: ", profileData);
            setPostData(profileData.post);
            setPostDataS(profileData.posts);
          } else {
            console.error("Failed to fetch user profile");
          }
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };

      fetchData();
    }
  }, [status, session, router]);

  const getPostById = async () => {
    try {
      const res = await fetch(`/api/editprofile/${session?.user?.id}`, {
        method: "GET",
        cache: "no-store",
      });

      if (!res.ok) {
        throw new Error("Failed to fetch a post");
      }

      const data = await res.json();
      console.log("Edit post: ", data);

      const post = data.post;
      setPostData(post);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getPostById();
  }, []);

  const getPostByIdS = async () => {
    try {
      const res = await fetch(`/api/editprofile/${session?.user?.id}`, {
        method: "GET",
        cache: "no-store",
      });

      if (!res.ok) {
        throw new Error("Failed to fetch a post");
      }

      const data = await res.json();
      console.log("Edit post: ", data);

      const posts = data.posts;
      setPostDataS(posts);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getPostByIdS();
  }, []);

  useEffect(() => {
    if (session?.user?.name) {
      setNewName(postDataS?.name || postData?.name); // Set the initial name from session data
    }
    if (session?.user?.email) {
      setNewEmail(session.user.email); // Set the initial name from session data
    }
    if (session?.user?.facebook) {
      setNewEmail(session.user.facebook); // Set the initial name from session data
    }
    if (session?.user?.line) {
      setNewEmail(session.user.line); // Set the initial name from session data
    }
    if (session?.user?.imageUrl) {
      setProfileImage(session.user.imageUrl); // Set the initial image from session data
    }
  }, [session]);

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
        />
      </div>
    );
  }

  // Handle image
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setProfileImage(URL.createObjectURL(file));
    }
  };
  // Handle save profile updates
  const handleSave = async () => {
    const formData = new FormData();
    formData.append("name", newName);
    formData.append("email", newEmail);
    formData.append("line", newLine);
    formData.append("facebook", newFacebook);
    formData.append("phonenumber", newPhonenumber);

    if (imageFile) {
      formData.append("imageUrl", imageFile);
    }

    try {
      const response = await fetch(`/api/editprofile/${session?.user?.id}`, {
        method: "PUT",
        body: formData, // Use FormData to handle file uploads
      });

      if (response.ok) {

        // ใช้ SweetAlert2 เพื่อแสดงการแจ้งเตือน
        await Swal.fire({
          title: t("nav.profile.success"),
          icon: "success",
          confirmButtonText: "OK",
        });
        // นำทางไปยังหน้า Profile
        router.push("/Profile");
      } else {
        // แสดงข้อความแจ้งเตือนเมื่อเกิดข้อผิดพลาด
        Swal.fire({
          title: t("nav.profile.error"),
          text: t("nav.profile.errordes"),
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    } catch (error) {
      console.error("Error during save:", error);
      // แสดงข้อความแจ้งเตือนเมื่อเกิดข้อผิดพลาด
      Swal.fire({
        title: "เกิดข้อผิดพลาด!",
        text: "เกิดข้อผิดพลาดในการเชื่อมต่อ กรุณาลองใหม่อีกครั้ง",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };


  const handleSaveT = async () => {
    const formData = new FormData();
    formData.append("name", newName);
    formData.append("email", newEmail);
    formData.append("line", newLine);
    formData.append("facebook", newFacebook);
    formData.append("phonenumber", newPhonenumber);

    if (imageFile) {
      formData.append("imageUrl", imageFile);
    }

    try {
      const response = await fetch(`/api/editprofile/${session?.user?.id}`, {
        method: "PUT",
        body: formData, // Use FormData to handle file uploads
      });

      if (response.ok) {

        // ใช้ SweetAlert2 เพื่อแสดงการแจ้งเตือน
        await Swal.fire({
          title: t("nav.profile.success"),
          icon: "success",
          confirmButtonText: "OK",
        });
        // นำทางไปยังหน้า Profile
        router.push("/");
      } else {
        // แสดงข้อความแจ้งเตือนเมื่อเกิดข้อผิดพลาด
        Swal.fire({
          title: t("nav.profile.error"),
          text: t("nav.profile.errordes"),
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    } catch (error) {
      console.error("Error during save:", error);
      // แสดงข้อความแจ้งเตือนเมื่อเกิดข้อผิดพลาด
      Swal.fire({
        title: "เกิดข้อผิดพลาด!",
        text: "เกิดข้อผิดพลาดในการเชื่อมต่อ กรุณาลองใหม่อีกครั้ง",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  const getImageSource = () => {
    const useProxy = (url) => `/api/proxy?url=${encodeURIComponent(url)}`;

    const isValidHttpUrl = (string) => {
      let url;
      try {
        url = new URL(string);
      } catch (_) {
        return false;
      }
      return url.protocol === "http:" || url.protocol === "https:";
    };
    if (postData && postData.imageUrl && postData.imageUrl.length > 0) {
      const imageUrl = postData.imageUrl[0];
      if (isValidHttpUrl(imageUrl)) {
        return useProxy(imageUrl);
      } else {
        return `/api/editprofile/images/${imageUrl}`;
      }
    }
    if (postDataS && postDataS.imageUrl) {
      return `/api/editprofile/images/${postDataS.imageUrl}`;
    }
    if (session?.user?.image) {
      return useProxy(session.user.image);
    }
    return null;
  };

  const imageSource = getImageSource();

  return (
    <Container>
      <Navbar />
      <main className="flex flex-col md:flex-row w-full justify-center p-4 my-[50px]">
        <div className="flex flex-col items-center w-full max-w-lg">
          {session?.user?.role == "NormalUser" && (
            <>
              <div
                className="flex flex-row justify-center relative w-24 h-24"
                style={{
                  width: "95px",
                  height: "95px",
                  margin: "-10px",
                  objectFit: "cover",
                  borderRadius: "50%",
                }}
              >
                {profileImage || imageSource ? (
                  <Image
                    width={95}
                    height={95}
                    src={profileImage || imageSource}
                    alt="Profile Image"
                    unoptimized={true}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/path/to/fallback/image.jpg"; // ถ้าต้องการใช้รูปภาพ fallback
                    }}
                    style={{
                      objectFit: "cover",
                      borderRadius: "50%",
                      width: "95px",
                      height: "95px",
                      margin: "15px",
                    }}
                  />
                ) : (
                  <MdAccountCircle
                    className="rounded-full text-gray-500"
                    style={{ width: "95px", height: "95px", margin: "15px" }}
                  />
                )}

                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  style={{ display: "none" }}
                  id="imageUpload"
                />

                <label
                  htmlFor="imageUpload"
                  className="absolute right-0 bottom-0 bg-white rounded-full p-1 border-2 border-black cursor-pointer"
                  style={{ transform: "translate(25%, 25%)" }}
                >
                  <FaPlus size={18} className="text-black" />
                </label>
              </div>

              <div className="flex flex-row justify-center mb-4">
                <p style={{ fontSize: "24px", fontWeight: "bold" }} className="mt-6">
                  {postDataS?.name || postData?.name}
                </p>
              </div>

              <div className="flex flex-col items-center w-full mt-4">
                <div className="flex flex-row items-center w-full mt-4">
                  <p>{t("nav.profile.editprofile.name")}</p>
                </div>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)} // Update state when input changes
                  placeholder={postData?.name || 'กำลังโหลด...'}
                  className="w-full p-2 mb-4 border border-gray-300 rounded"
                />
                <div className="flex flex-row items-center w-full mt-4">
                  <p>{t("nav.profile.editprofile.email")}</p>
                </div>
                {/* <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder={session?.user?.email}
                  className="w-full p-2 mb-4 border border-gray-300 rounded"
                /> */}
                <div className="w-full p-2 mb-4 text-zinc-400">
                  {session?.user?.email}
                </div>
                <div className="flex flex-row items-center w-full mt-4">
                  <p>{t("nav.profile.editprofile.pnum")}</p>
                </div>
                <input
                  type="text"
                  value={newPhonenumber}
                  onChange={(e) => setNewPhonenumber(e.target.value)}
                  placeholder="Enter phone number"
                  className="w-full p-2 mb-4 border border-gray-300 rounded"
                />
                <div className="flex flex-row items-center w-full mt-4">
                  <p>{t("nav.profile.editprofile.facebook")}</p>
                </div>
                <input
                  type="text"
                  value={newFacebook}
                  onChange={(e) => setNewFacebook(e.target.value)}
                  placeholder="Enter your facebook"
                  className="w-full p-2 mb-4 border border-gray-300 rounded"
                />
                <div className="flex flex-row items-center w-full mt-4">
                  <p>{t("nav.profile.editprofile.line")}</p>
                </div>
                <input
                  type="text"
                  value={newLine}
                  onChange={(e) => setNewLine(e.target.value)}
                  placeholder="Enter your ID"
                  className="w-full p-2 mb-4 border border-gray-300 rounded"
                />
                <button
                  onClick={handleSaveT}
                  className="bg-blue-500 text-white px-4 py-2 rounded w-full hover:bg-blue-600"
                  style={{ backgroundColor: "#33539B" }}
                >
                  {t("nav.profile.editprofile.save")}
                </button>
              </div>
            </>
          )}

          {session?.user?.role !== "NormalUser" && (
            <>
              <div
                className="flex flex-row justify-center relative w-24 h-24"
                style={{
                  width: "95px",
                  height: "95px",
                  margin: "-10px",
                  objectFit: "cover",
                  borderRadius: "50%",
                }}
              >
                {profileImage || imageSource ? (
                  <Image
                    width={95}
                    height={95}
                    src={profileImage || imageSource}
                    alt="Profile Image"
                    unoptimized={true}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/path/to/fallback/image.jpg"; // ถ้าต้องการใช้รูปภาพ fallback
                    }}
                    className="rounded-full w-[95px] h-[95px] object-cover"
                  />
                ) : (
                  <MdAccountCircle
                    className="rounded-full text-gray-500"
                    style={{ width: "95px", height: "95px", margin: "15px" }}
                  />
                )}

                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  style={{ display: "none" }}
                  id="imageUpload"
                />

                <label
                  htmlFor="imageUpload"
                  className="absolute right-0 bottom-0 bg-white rounded-full p-1 border-2 border-black cursor-pointer"
                  style={{ transform: "translate(25%, 25%)" }}
                >
                  <FaPlus size={18} className="text-black" />
                </label>
              </div>

              <div className="flex flex-row justify-center mb-4">
                <p style={{ fontSize: "24px", fontWeight: "bold" }} className="mt-6">
                  {postDataS?.name || postData?.name}
                </p>
              </div>

              <div className="flex flex-col items-center w-full mt-4">
                <div className="flex flex-row items-center w-full mt-4">
                  <p>{t("nav.profile.editprofile.name")}</p>
                </div>

                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)} // Update state when input changes
                  placeholder={postDataS?.name || 'กำลังโหลด...'}
                  className="w-full p-2 mb-4 border border-gray-300 rounded"
                />
                <div className="flex flex-row items-center w-full mt-4">
                  <p>{t("nav.profile.editprofile.email")}</p>
                </div>
                <div className="w-full p-2 mb-4 text-zinc-400">
                  {session?.user?.email}
                </div>
                <div className="flex flex-row items-center w-full mt-4">
                  <p>{t("nav.profile.editprofile.pnum")}</p>
                </div>
                <input
                  type="text"
                  value={newPhonenumber}
                  onChange={(e) => setNewPhonenumber(e.target.value)}
                  placeholder="Enter phone number"
                  className="w-full p-2 mb-4 border border-gray-300 rounded"
                />
                <div className="flex flex-row items-center w-full mt-4">
                  <p>{t("nav.profile.editprofile.facebook")}</p>
                </div>
                <input
                  type="text"
                  value={newFacebook}
                  onChange={(e) => setNewFacebook(e.target.value)}
                  placeholder="Enter your facebook"
                  className="w-full p-2 mb-4 border border-gray-300 rounded"
                />
                <div className="flex flex-row items-center w-full mt-4">
                  <p>{t("nav.profile.editprofile.line")}</p>
                </div>
                <input
                  type="text"
                  value={newLine}
                  onChange={(e) => setNewLine(e.target.value)}
                  placeholder="Enter your ID"
                  className="w-full p-2 mb-4 border border-gray-300 rounded"
                />
                <button
                  onClick={handleSave}
                  className="bg-blue-500 text-white px-4 py-2 rounded w-full hover:bg-blue-600"
                  style={{ backgroundColor: "#33539B" }}
                >
                  {t("nav.profile.editprofile.save")}
                </button>
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </Container>
  );
}

export default page;
