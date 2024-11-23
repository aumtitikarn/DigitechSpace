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
const isValidHttpUrl = (string) => {
  try {
    const url = new URL(string);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
};

const proxyUrl = (url) => `/api/proxy?url=${encodeURIComponent(url)}`;

function Page() {
  const { data: session, status } = useSession();
  const { t } = useTranslation("translation");
  const router = useRouter();

  const [postData, setPostData] = useState([]);
  const [postDataS, setPostDataS] = useState([]);
  const [publishedProjects, setPublishedProjects] = useState([]);
  const [postDataBlog, setPostDataBlog] = useState([]);
  const [newName, setNewName] = useState("");
  const [newbriefly, setNewbriefly] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newLine, setNewLine] = useState("");
  const [newFacebook, setNewFacebook] = useState("");
  const [newPhonenumber, setNewPhonenumber] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [failedImages, setFailedImages] = useState([]);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
      return;
    }

    if (status === "authenticated" && session) {
      const fetchAllData = async () => {
        try {
          const publishedResponse = await fetch(
            "/api/project/getProjects/user",
            {
              method: "GET",
            }
          );
          if (publishedResponse.ok) {
            const publishedData = await publishedResponse.json();
            setPublishedProjects(publishedData);
          }

          const blogResponse = await fetch("/api/posts/getposts/user", {
            cache: "no-store",
          });
          if (blogResponse.ok) {
            const blogData = await blogResponse.json();
            setPostDataBlog(blogData);
          }

          const profileResponse = await fetch(
            `/api/editprofile/${session.user.id}`,
            {
              method: "GET",
              cache: "no-store",
            }
          );
          if (profileResponse.ok) {
            const profileData = await profileResponse.json();
            setPostData(profileData.post);
            setPostDataS(profileData.posts);
          }
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };

      fetchAllData();
    }
  }, [status, session, router]);

  useEffect(() => {
    if (session?.user && (postData || postDataS)) {
      setNewName(postDataS?.name || postData?.name || session.user.name || "");
      setNewEmail(session.user.email || "");
      // Update these fields with existing data
      setNewPhonenumber(postDataS?.phonenumber || postData?.phonenumber || "");
      setNewFacebook(postDataS?.facebook || postData?.facebook || "");
      setNewLine(postDataS?.line || postData?.line || "");
      setNewbriefly(postDataS?.briefly || postData?.briefly || "");

      if (session.user.imageUrl) {
        setProfileImage(session.user.imageUrl);
      }
    }
  }, [session, postData, postDataS]);

  const getImageSource = () => {
    if (profileImage) {
      return profileImage; // ถ้ามีการอัพโหลดรูปใหม่ ให้แสดงรูปนั้นก่อน
    }
    if (postData?.imageUrl?.[0]) {
      const imageUrl = postData.imageUrl[0];
      return isValidHttpUrl(imageUrl)
        ? proxyUrl(imageUrl)
        : `/api/editprofile/images/${imageUrl}`;
    }
    if (postDataS?.imageUrl) {
      return `/api/editprofile/images/${postDataS.imageUrl}`;
    }
    if (session?.user?.image) {
      return session.user.image;
    }
    return null;
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      // ตรวจสอบประเภทไฟล์
      if (!file.type.startsWith("image/")) {
        alert("Please select an image file");
        return;
      }
  
      // ตรวจสอบขนาดไฟล์ (จำกัดที่ 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("File size should not exceed 5MB");
        return;
      }
  
      // สร้าง HTML Image element แทนการใช้ new Image()
      const img = document.createElement('img');
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
  
        // กำหนดขนาด canvas เป็น 95x95
        canvas.width = 95;
        canvas.height = 95;
  
        if (ctx) {
          // คำนวณขนาดและตำแหน่งเพื่อให้รูปภาพอยู่ตรงกลางและเต็มพื้นที่
          const scale = Math.max(
            canvas.width / img.width,
            canvas.height / img.height
          );
          const x = (canvas.width - img.width * scale) / 2;
          const y = (canvas.height - img.height * scale) / 2;
  
          // วาดรูปภาพลงบน canvas
          ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
  
          // แปลง canvas เป็น Blob
          canvas.toBlob((blob) => {
            if (blob) {
              // สร้าง URL สำหรับรูปภาพที่ปรับขนาดแล้ว
              const resizedImageUrl = URL.createObjectURL(blob);
              setImageFile(blob);
              setProfileImage(resizedImageUrl);
            }
          }, file.type);
        }
      };
  
      // อ่านไฟล์เป็น URL สำหรับ Image object
      img.src = URL.createObjectURL(file);
    }
  };

  const handleSave = async () => {
    if (!session?.user?.id) {
      await Swal.fire({
        title: t("nav.profile.error"),
        text: t("nav.profile.errordes"),
        icon: "error",
        confirmButtonText: "OK",
      });
      return;
    }

    const formData = new FormData();
    formData.append("name", newName);
    formData.append("briefly", newbriefly);
    formData.append("email", newEmail);
    formData.append("line", newLine);
    formData.append("facebook", newFacebook);
    formData.append("phonenumber", newPhonenumber);

    if (imageFile) {
      formData.append("imageUrl", imageFile);
    }

    try {
      const response = await fetch(`/api/editprofile/${session.user.id}`, {
        method: "PUT",
        body: formData,
      });

      if (response.ok) {
        await Swal.fire({
          title: t("nav.profile.success"),
          icon: "success",
          confirmButtonText: "OK",
        });
        // Always redirect to the profile page after successful save
        if (session.user.role === "NormalUser") {
          router.push("/");
        } else if (session.user.role === "StudentUser") {
          router.push("/Profile");
        }
      } else {
        throw new Error("Failed to update profile");
      }
    } catch (error) {
      console.error("Error during save:", error);
      await Swal.fire({
        title: t("nav.profile.error"),
        text: t("nav.profile.errordes"),
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  if (status === "loading") {
    return (
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
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

  const imageSource = getImageSource();
  // console.log(session?.user?.role);
  return (
    <Container>
      <Navbar />
      <main className="flex flex-col md:flex-row w-full justify-center p-4 my-[50px]">
        <div className="flex flex-col items-center w-full max-w-lg">
          {session?.user?.role === "StudentUser" ? (
            <>
              <div className="relative inline-block">
                {/* ส่วนแสดงรูปภาพ */}
                <div className="w-[95px] h-[95px] relative">
                  {imageSource &&
                  Array.isArray(failedImages) &&
                  !failedImages.includes(imageSource) ? (
                    <Image
                      width={95}
                      height={95}
                      src={profileImage || imageSource || ""}
                      alt="Profile Image"
                      unoptimized={true}
                      style={{
                        objectFit: "cover",
                        borderRadius: "50%",
                        width: "95px",
                        height: "95px",
                      }}
                      className="rounded-full"
                      onError={() => {
                        setFailedImages((prev) => [...prev, imageSource]);
                      }}
                    />
                  ) : (
                    <MdAccountCircle
                      className="rounded-full text-gray-500"
                      style={{
                        width: "95px",
                        height: "95px",
                      }}
                    />
                  )}
                </div>

                {/* Input file ซ่อนไว้ */}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  id="imageUpload"
                />

                {/* ปุ่มเพิ่มรูปภาพ */}
                <label
                  htmlFor="imageUpload"
                  className="absolute right-0 bottom-0 bg-white rounded-full p-1 border-2 border-black cursor-pointer"
                  style={{ transform: "translate(25%, 25%)" }}
                >
                  <FaPlus size={18} className="text-black" />
                </label>
              </div>

              <div className="flex flex-row justify-center mb-4">
                <p
                  style={{ fontSize: "24px", fontWeight: "bold" }}
                  className="mt-6"
                >
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
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder={postData?.name || "กำลังโหลด..."}
                  className="w-full p-2 mb-4 border border-gray-300 rounded"
                />
                {/* Briefly Input */}
                <div className="flex flex-row items-center w-full mt-4">
                  <p>{t("nav.profile.editprofile.briefly")}</p>
                </div>
                <div className="relative w-full">
                  <textarea
                    value={newbriefly}
                    onChange={(e) => {
                      if (e.target.value.length <= 200) {
                        setNewbriefly(e.target.value);
                      }
                    }}
                    placeholder="Enter briefly"
                    className="w-full h-20 p-2 border border-gray-300 rounded resize-none overflow-hidden"
                    maxLength={200}
                    style={{
                      lineHeight: "1.5rem",
                      paddingTop: "0.25rem",
                      paddingBottom: "0.25rem",
                    }}
                  />
                  <div className="text-right text-sm text-gray-500  mt-1">
                    {newbriefly ? newbriefly.length : 0}/200{" "}
                    {t("nav.profile.editprofile.characters")}
                  </div>
                </div>
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
          ) : (
            <>
              <div className="relative inline-block">
                {/* ส่วนแสดงรูปภาพ */}
                <div className="w-[95px] h-[95px] relative">
                  {imageSource &&
                  Array.isArray(failedImages) &&
                  !failedImages.includes(imageSource) ? (
                    <Image
                      width={95}
                      height={95}
                      src={profileImage || imageSource || ""}
                      alt="Profile Image"
                      unoptimized={true}
                      style={{
                        objectFit: "cover",
                        borderRadius: "50%",
                        width: "95px",
                        height: "95px",
                      }}
                      className="rounded-full"
                      onError={() => {
                        setFailedImages((prev) => [...prev, imageSource]);
                      }}
                    />
                  ) : (
                    <MdAccountCircle
                      className="rounded-full text-gray-500"
                      style={{
                        width: "95px",
                        height: "95px",
                      }}
                    />
                  )}
                </div>

                {/* Input file ซ่อนไว้ */}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  id="imageUpload"
                />

                {/* ปุ่มเพิ่มรูปภาพ */}
                <label
                  htmlFor="imageUpload"
                  className="absolute right-0 bottom-0 bg-white rounded-full p-1 border-2 border-black cursor-pointer"
                  style={{ transform: "translate(25%, 25%)" }}
                >
                  <FaPlus size={18} className="text-black" />
                </label>
              </div>

              <div className="flex flex-row justify-center mb-4">
                <p
                  style={{ fontSize: "24px", fontWeight: "bold" }}
                  className="mt-6"
                >
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
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder={postDataS?.name || "กำลังโหลด..."}
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

export default Page;
