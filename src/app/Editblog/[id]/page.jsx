"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useSession } from "next-auth/react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import Container from "../../components/Container";
import { AiFillPlusCircle } from "react-icons/ai";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { IoCloseCircleOutline } from "react-icons/io5";
import { OrbitProgress } from "react-loading-indicators";
import { image } from "@nextui-org/theme";

export default function Page({params}) {
  const { id } = params
  const [activeButton, setActiveButton] = useState(null);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [imagesToDelete, setImagesToDelete] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [newSelectedCategory, setNewSelectedCategory] = useState("");
  const [topic, setTopic] = useState("");
  const [course, setCourse] = useState("");
  const [description, setDescription] = useState("");
  const [newTopic, setNewTopic] = useState("");
  const [newCourse, setNewCourse] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [postData, setPostData] = useState("");
  const [blogData, setBlogData] = useState("");
  const [blogImage,setBlogImage] = useState([]);
  const [heart, setHeart] = useState(0);
  const [file, setFile] = useState("");
  const [previewImage, setPreviewImage] = useState(null);
  const { t } = useTranslation("translation");

  const [img, setImg] = useState([]);

  const [email, setEmail] = useState("");
  const [profileUserT, setProfileUserT] = useState("");
  const [profileUserId, setProfileUserId] = useState("");
  const [profileUsername, setProfileUsername] = useState("");

  const { data: session, status } = useSession();
  const router = useRouter();

  const getPostById = async (id) => {
    try {
      const res = await fetch(`/api/posts/${id}`, {
        method: "GET",
        cache: "no-store"
      });

        if (!res.ok) {
            throw new Error("Failed to fetch a post");
        }

        const data = await res.json();
        console.log("Edit post2: ", data);
        setBlogData(data.post);
        setBlogImage(blogData.imageUrl || []);
      
      // เพิ่มการเซ็ตค่าเริ่มต้นสำหรับฟอร์ม
      setNewTopic(data.post.topic);
      setNewCourse(data.post.course);
      setNewDescription(data.post.description);
      setNewSelectedCategory(data.post.selectedCategory);
      
      // เซ็ตรูปภาพเดิม
      if (data.post.imageUrl) {
        setExistingImages(Array.isArray(data.post.imageUrl) ? data.post.imageUrl : [data.post.imageUrl]);
      }
    } catch(error) {
      console.log(error);
    }
  }


useEffect(() => {
  getPostById(id);
}, [])

console.log("TestPostblog: ",blogData);
  

const { register, handleSubmit: handleFormSubmit } = useForm();
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [status, router]);

  useEffect(() => {
    const getPostByIdprofile = async () => {
      try {
        const res = await fetch(`/api/editprofile/${session?.user?.id}`, {
          method: "GET",
          cache: "no-store",
        });
  
        if (!res.ok) {
          throw new Error("Failed to fetch a post");
        }
  
        const data = await res.json();
        console.log("Show Blog image: ", data);
  
        const post = data.combinedData;
        setPostData(post);
        setProfileUserT(post.imageUrl);
        setProfileUsername(post.name);
        setProfileUserId(post._id);
        setEmail(post.email);
      } catch (error) {
        console.log(error);
      }
    };
  
    getPostByIdprofile();
  }, [session?.user?.id]);
  

 

  const handleCombinedChange = (e) => {
    handleFileUpload(e);
    setFile(e.target.files[0]);
    setHeart(0);
    handleFileChange(e);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };

      reader.readAsDataURL(file);
    } else {
      setPreviewImage(null);
    }
  };

  console.log("อันนี้set" + setProfileUserT);
  console.log("อันนี้p" + profileUserT);

  console.log("อันนี้setid" + setProfileUserId);
  console.log("อันนี้userid" + profileUserId);

  console.log("อันนี้setname" + setProfileUsername);
  console.log("อันนี้username" + profileUsername);

    // เพิ่มฟังก์ชันสำหรับลบรูปภาพเดิม
    const handleDeleteExisting = (index) => {
      const imageToDelete = existingImages[index];
      setExistingImages(prev => prev.filter((_, i) => i !== index));
      setImagesToDelete(prev => [...prev, imageToDelete]);
    };

    const onSubmit = async (formData) => {
      try {
        const formDataToSend = new FormData();
        
        // ข้อมูลพื้นฐาน
        formDataToSend.append("newTopic", newTopic || blogData.topic);
        formDataToSend.append("newCourse", newCourse || blogData.course);
        formDataToSend.append("newDescription", newDescription || blogData.description);
        formDataToSend.append("newSelectedCategory", newSelectedCategory || blogData.selectedCategory);
        
        // เพิ่มรูปภาพเดิมที่เหลืออยู่
        existingImages.forEach(img => {
          formDataToSend.append("existingImages", img);
        });
    
        // เพิ่มรูปภาพใหม่
        img.forEach(imgFile => {
          formDataToSend.append("newImages", imgFile);
        });
    
        const res = await fetch(`/api/posts/update/${blogData._id}`, {
          method: "PUT",
          body: formDataToSend,
        });
    
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
    
        const result = await res.json();
        console.log('Update successful:', result);
        router.push('/listblog');
    
      } catch (error) {
        console.error('Error updating blog:', error);
        alert(`Failed to update blog: ${error.message}`);
      }
    };
    
    // อัพเดทฟังก์ชัน handleFileUpload
    const handleFileUpload = (e) => {
      const files = Array.from(e.target.files || []);
      setImg(prevImg => [...prevImg, ...files]); // เก็บ File objects
      const newImageUrls = files.map(file => URL.createObjectURL(file));
      setUploadedImages(prevImages => [...prevImages, ...newImageUrls]); // เก็บ URLs สำหรับแสดงผล
    };
    
    // อัพเดทฟังก์ชัน handleDelete
    const handleDelete = (index) => {
      setImg(prevImg => prevImg.filter((_, i) => i !== index));
      setUploadedImages(prevImages => prevImages.filter((_, i) => i !== index));
    };
  
  // อัพเดท useEffect สำหรับโหลดข้อมูลเริ่มต้น
  useEffect(() => {
    if (blogData) {
      setNewTopic(blogData.topic || '');
      setNewCourse(blogData.course || '');
      setNewDescription(blogData.description || '');
      setNewSelectedCategory(blogData.selectedCategory || '');
      if (blogData.imageUrl) {
        setExistingImages(Array.isArray(blogData.imageUrl) ? blogData.imageUrl : [blogData.imageUrl]);
      }
    }
  }, [blogData]);

  console.log(topic);

  
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
  
  return (
    <Container>
      <Navbar session={session} />
      <main className="flex flex-col items-center w-full">
        <div className="max-w-screen-lg w-full p-4">
          <div className="flex flex-row justify-start">
            <p
              className="mt-3 mb-5"
              style={{ fontSize: "24px", fontWeight: "bold" }}
            >
              Editblog
            </p>
          </div>

          <div className="flex flex-wrap gap-4">
            {/* แสดงรูปภาพเดิม */}
            {existingImages.map((image, index) => (
              <div key={`existing-${index}`} className="relative w-40 h-40">
                <Image
                  src={`/api/posts/images/${image}`} // ปรับ path ตาม API ของคุณ
                  alt={`Existing ${index}`}
                  width={160}
                  height={160}
                  className="object-cover rounded-md"
                  unoptimized // ใช้ถ้าเป็นรูปภาพจาก local API
                />
                <button
                  type="button"
                  onClick={() => handleDeleteExisting(index)} // เพิ่มฟังก์ชันสำหรับลบรูปเดิม
                  className="absolute top-2 right-2 bg-white p-1 rounded-full shadow-md hover:bg-gray-200"
                >
                  <IoCloseCircleOutline className="text-red-500" size={24} />
                </button>
              </div>
            ))}

            {/* แสดงรูปภาพใหม่ที่เพิ่งอัพโหลด */}
            {uploadedImages.map((image, index) => (
              <div key={`new-${index}`} className="relative w-40 h-40">
                <Image
                  src={image}
                  alt={`Uploaded ${index}`}
                  width={160}
                  height={160}
                  className="object-cover rounded-md"
                />
                <button
                  type="button"
                  onClick={() => handleDelete(index)}
                  className="absolute top-2 right-2 bg-white p-1 rounded-full shadow-md hover:bg-gray-200"
                >
                  <IoCloseCircleOutline className="text-red-500" size={24} />
                </button>
              </div>
            ))}

            <button
              onClick={() => document.getElementById("file-upload").click()}
              className={`flex items-center justify-center w-40 h-40 rounded-md p-2 bg-white border-2 ${
                activeButton === "button1"
                  ? "border-b-indigo-700 border-b-4"
                  : ""
              }`}
            >
              <div className="flex items-center justify-center w-10 h-10">
                <AiFillPlusCircle size={50} className="text-[#38B6FF]" />
              </div>
            </button>
          </div>

          <form onSubmit={handleFormSubmit(onSubmit)}>
            <input
              id="file-upload"
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              {...register("imageUrl")}
              onChange={handleCombinedChange}
            />

            <input
              type="text"
              onChange={(e) => setNewTopic(e.target.value)}
              placeholder={blogData.topic}
              value={newTopic}
              className="w-full p-2 mb-4 border border-gray-300 rounded mt-5 focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1"
            />

            <div className="flex flex-row w-full">
              <input
                type="text"
                onChange={(e) => setNewCourse(e.target.value)}
                placeholder={blogData.course}
                value={newCourse}
                className="w-full p-2 mb-4 mr-5 border border-gray-300 rounded focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1"
              />

              <select
                value={newSelectedCategory}
                onChange={(e) => setNewSelectedCategory(e.target.value)}
                className="w-full p-2 mb-4 ml-5 border border-gray-300 rounded focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1"
              >
                <option value="" disabled>
                  {/* {t("nav.blog.addblog.select")} */}
                  {blogData.selectedCategory}
                </option>
                <option value="Document">{t("nav.project.document")}</option>
                <option value="Model/3D">{t("nav.project.model")}</option>
                <option value="Website">{t("nav.project.website")}</option>
                <option value="MobileApp">{t("nav.project.mobileapp")}</option>
                <option value="Datasets">{t("nav.project.ai")}</option>
                <option value="AI">{t("nav.project.datasets")}</option>
                <option value="IOT">{t("nav.project.iot")}</option>
                <option value="Program">{t("nav.project.program")}</option>
                <option value="Photo/Art">{t("nav.project.photo")}</option>
                <option value="Other">{t("nav.project.other")}</option>
              </select>
            </div>
            <textarea
              type="text"
              placeholder={blogData.description}
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              className="w-full h-60 p-2 mb-4 border border-gray-300 rounded focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1"
            />

            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded w-full hover:bg-blue-600"
              style={{ backgroundColor: "#33539B" }}
            >
              {t("nav.blog.addblog.post")}
            </button>
          </form>
        </div>
      </main>
      <Footer />
    </Container>
  );
}