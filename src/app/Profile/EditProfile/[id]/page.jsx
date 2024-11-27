"use client";

import React, { useState, useEffect } from "react";
import { MdAccountCircle } from "react-icons/md";
import { FaPlus, FaEnvelope, FaPhone, FaFacebook, FaLine } from 'react-icons/fa';
import { OrbitProgress } from "react-loading-indicators";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import Container from "../../../components/Container";
import { useSession } from "next-auth/react";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
import { BsPencilSquare } from 'react-icons/bs';
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

  const handleSave1 = async () => {
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

  const handleSave = async () => {
    const result = await Swal.fire({
      title: "คุณต้องการลบบล็อกนี้และบันทึกข้อมูลใหม่ใช่หรือไม่?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "ใช่, ดำเนินการเลย!",
      cancelButtonText: "ยกเลิก",
    });

    const id = session.user.id;
  
    if (result.isConfirmed) {
      try {
        // เรียก handleDelete และ handleSave พร้อมกัน
        const deletePromise = fetch(`/api/editprofile/${session.user.id}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({id}),
        });
  
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
  
        const savePromise = fetch(`/api/editprofile/${session.user.id}`, {
          method: "PUT",
          body: formData,
        });
  
        // ใช้ Promise.all เพื่อรอให้ทั้งสองคำสั่งเสร็จสิ้น
        const [deleteResponse, saveResponse] = await Promise.all([deletePromise, savePromise]);
  
        if (deleteResponse.ok && saveResponse.ok) {
          await Swal.fire({
            title: "สำเร็จ!",
            text: "การลบและบันทึกข้อมูลเสร็จสมบูรณ์",
            icon: "success",
            confirmButtonText: "OK",
          });
          router.push("/Profile"); // เปลี่ยนเส้นทางไปยังหน้าโปรไฟล์
        } else {
          const errorMessage = `
            ${!deleteResponse.ok ? "ลบข้อมูลไม่สำเร็จ" : ""}
            ${!saveResponse.ok ? "บันทึกข้อมูลไม่สำเร็จ" : ""}
          `;
          await Swal.fire({
            title: "Error",
            text: errorMessage.trim(),
            icon: "error",
            confirmButtonText: "OK",
          });
        }
      } catch (error) {
        console.error("Error during delete and save:", error);
        await Swal.fire({
          title: "Error",
          text: "เกิดข้อผิดพลาดในระบบ",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
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
      <main className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            {/* Header Section */}
            <div className="bg-gradient-to-r from-[#0B1E48] to-[#1E3A8A] p-8 text-white relative">
              <h1 className="text-2xl font-bold mb-2">{t("nav.profile.editprofile.title")}</h1>
              <p className="text-blue-100 text-sm">{t("nav.profile.editprofile.subtitle")}</p>
            </div>

            {/* Profile Content */}
            <div className="p-8">
              {/* Profile Image Section */}
              <div className="flex flex-col items-center -mt-20 mb-8">
                <div className="relative inline-block">
                  <div className="w-32 h-32 relative bg-white rounded-full p-1 shadow-lg">
                    {imageSource && Array.isArray(failedImages) && !failedImages.includes(imageSource) ? (
                      <Image
                        width={128}
                        height={128}
                        src={profileImage || imageSource}
                        alt="Profile"
                        className="rounded-full w-full h-full object-cover"
                        onError={() => setFailedImages(prev => [...prev, imageSource])}
                      />
                    ) : (
                      <MdAccountCircle className="w-full h-full text-gray-400" />
                    )}
                  </div>
                  <label
                    htmlFor="imageUpload"
                    className="absolute bottom-0 right-0 bg-blue-600 rounded-full p-2.5 cursor-pointer shadow-lg hover:bg-blue-700 transition-colors"
                  >
                    <FaPlus className="text-white w-4 h-4" />
                  </label>
                  <input
                    type="file"
                    id="imageUpload"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </div>
                <h2 className="text-2xl font-semibold mt-4">{postDataS?.name || postData?.name}</h2>
                <p className="text-gray-500">{session?.user?.email}</p>
              </div>

              {/* Form Fields */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* Name Field */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    {t("nav.profile.editprofile.name")}
                  </label>
                  <div className="relative">
                    <BsPencilSquare className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      className="pl-10 w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder={t("nav.profile.editprofile.enter.name")}
                    />
                  </div>
                </div>

                {/* Phone Number Field */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    {t("nav.profile.editprofile.pnum")}
                  </label>
                  <div className="relative">
                    <FaPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      value={newPhonenumber}
                      onChange={(e) => setNewPhonenumber(e.target.value)}
                      className="pl-10 w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder={t("nav.profile.editprofile.enter.pnum")}
                    />
                  </div>
                </div>

                {/* Facebook Field */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    {t("nav.profile.editprofile.facebook")}
                  </label>
                  <div className="relative">
                    <FaFacebook className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      value={newFacebook}
                      onChange={(e) => setNewFacebook(e.target.value)}
                      className="pl-10 w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder={t("nav.profile.editprofile.enter.facebook")}
                    />
                  </div>
                </div>

                {/* Line Field */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    {t("nav.profile.editprofile.line")}
                  </label>
                  <div className="relative">
                    <FaLine className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      value={newLine}
                      onChange={(e) => setNewLine(e.target.value)}
                      className="pl-10 w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder={t("nav.profile.editprofile.enter.line")}
                    />
                  </div>
                </div>

                {/* Briefly Field - For StudentUser only */}
                {session?.user?.role === "StudentUser" && (
                  <div className="md:col-span-2 space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      {t("nav.profile.editprofile.briefly")}
                    </label>
                    <div className="relative">
                      <textarea
                        value={newbriefly}
                        onChange={(e) => {
                          if (e.target.value.length <= 200) {
                            setNewbriefly(e.target.value);
                          }
                        }}
                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                        rows={4}
                        placeholder={t("nav.profile.editprofile.enter.briefly")}
                        maxLength={200}
                      />
                      <div className="absolute bottom-2 right-2 text-sm text-gray-500">
                        {newbriefly?.length || 0}/200
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Save Button */}
              <div className="mt-8">
                <button
                  onClick={handleSave}
                  className="w-full bg-gradient-to-r from-[#0B1E48] to-[#1E3A8A] text-white py-3 rounded-lg font-semibold hover:opacity-90 transition-all transform hover:scale-[0.99] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  {t("nav.profile.editprofile.save")}
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </Container>
  );
}

export default Page;
