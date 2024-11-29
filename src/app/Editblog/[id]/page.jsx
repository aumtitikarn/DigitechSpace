"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import Image from "next/image";
import { LuImagePlus } from "react-icons/lu";
import { IoCloseCircleOutline } from "react-icons/io5";
import { OrbitProgress } from "react-loading-indicators";

import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import Container from "../../components/Container";

export default function Page({ params }) {
  const { id } = params;
  const { t } = useTranslation("translation");
  const router = useRouter();
  const { data: session, status } = useSession();
  const { register, handleSubmit: handleFormSubmit } = useForm();

  // Form state
  const [newTopic, setNewTopic] = useState("");
  const [newCourse, setNewCourse] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newSelectedCategory, setNewSelectedCategory] = useState("");

  // Image state
  const [uploadedImages, setUploadedImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [imagesToDelete, setImagesToDelete] = useState([]);
  const [img, setImg] = useState([]);

  // Blog data state
  const [blogData, setBlogData] = useState(null);
  
  // UI state
  const [activeButton, setActiveButton] = useState(null);

  // Use useCallback to memoize the getPostById function
  const getPostById = useCallback(async () => {
    if (!id) return;

    try {
      const res = await fetch(`/api/posts/${id}`, {
        method: "GET",
        cache: "no-store"
      });

      if (!res.ok) {
        throw new Error("Failed to fetch post");
      }

      const data = await res.json();
      setBlogData(data.post);
      
      // Initialize form with existing data
      setNewTopic(data.post.topic);
      setNewCourse(data.post.course);
      setNewDescription(data.post.description);
      setNewSelectedCategory(data.post.selectedCategory);
      
      // Handle existing images
      if (data.post.imageUrl) {
        setExistingImages(Array.isArray(data.post.imageUrl) ? data.post.imageUrl : [data.post.imageUrl]);
      }
    } catch (error) {
      console.error("Error fetching post:", error);
    }
  }, [id]); // Only recreate if id changes

  // Authentication check
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [status, router]);

  // Fetch post data
  useEffect(() => {
    getPostById();
  }, [getPostById]); // Now getPostById is properly memoized

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files || []);
    setImg(prevImg => [...prevImg, ...files]);
    const newImageUrls = files.map(file => URL.createObjectURL(file));
    setUploadedImages(prevImages => [...prevImages, ...newImageUrls]);
  };

  const handleDeleteExisting = (index) => {
    const imageToDelete = existingImages[index];
    setExistingImages(prev => prev.filter((_, i) => i !== index));
    setImagesToDelete(prev => [...prev, imageToDelete]);
  };

  const handleDeleteNew = (index) => {
    setImg(prevImg => prevImg.filter((_, i) => i !== index));
    setUploadedImages(prevImages => prevImages.filter((_, i) => i !== index));
  };

  const onSubmit = async () => {
    Swal.fire({
      icon: "info",
      title: t("status.process"),
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });
    try {
      const formData = new FormData();
      
      // Append form fields
      formData.append("newTopic", newTopic || blogData.topic);
      formData.append("newCourse", newCourse || blogData.course);
      formData.append("newDescription", newDescription || blogData.description);
      formData.append("newSelectedCategory", newSelectedCategory || blogData.selectedCategory);
      
      // Append existing images
      existingImages.forEach(img => {
        formData.append("existingImages", img);
      });
    
      // Append new images
      img.forEach(imgFile => {
        formData.append("newImages", imgFile);
      });
    
      const res = await fetch(`/api/posts/update/${blogData._id}`, {
        method: "PUT",
        body: formData,
      });
    
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
    
      await res.json();
      router.push('/listblog');
    } catch (error) {
      console.error('Error updating blog:', error);
      alert(`Failed to update blog: ${error.message}`);
    }
  };

  if (status === "loading") {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <OrbitProgress variant="track-disc" dense color="#33539B" size="medium" />
      </div>
    );
  }

  return (
    <Container>

      <main className="flex flex-col items-center w-full">
        <div className="max-w-screen-lg w-full p-4">
          <h1 className="text-2xl font-bold mt-3 mb-5">Edit Blog</h1>

          <div className="flex flex-wrap gap-4">
            {/* Existing Images */}
            {existingImages.map((image, index) => (
              <div key={`existing-${index}`} className="relative w-40 h-40">
                <Image
                  src={`/api/posts/images/${image}`}
                  alt={`Existing ${index}`}
                  width={160}
                  height={160}
                  className="w-40 h-40 object-cover rounded-md"
                  unoptimized
                />
                <button
                  type="button"
                  onClick={() => handleDeleteExisting(index)}
                  className="absolute top-2 right-2 bg-white p-1 rounded-full shadow-md hover:bg-gray-200"
                >
                  <IoCloseCircleOutline className="text-red-500" size={24} />
                </button>
              </div>
            ))}

            {/* New Images */}
            {uploadedImages.map((image, index) => (
              <div key={`new-${index}`} className="relative w-40 h-40">
                <Image
                  src={image}
                  alt={`Uploaded ${index}`}
                  width={160} // 40 * 4 (เพราะ tailwind w-40 = 10rem = 160px)
                  height={160} // 40 * 4
                  className="w-40 h-40 object-cover rounded-md"
                />
                <button
                  type="button"
                  onClick={() => handleDeleteNew(index)}
                  className="absolute top-2 right-2 bg-white p-1 rounded-full shadow-md hover:bg-gray-200"
                >
                  <IoCloseCircleOutline className="text-red-500" size={24} />
                </button>
              </div>
            ))}

            {/* Upload Button */}
            <button
              onClick={() => document.getElementById("file-upload").click()}
              className={`flex items-center justify-center w-40 h-40 rounded-md p-2 bg-white border-2 ${
                activeButton === "button1" ? "border-b-indigo-700 border-b-4" : ""
              }`}
            >
              <LuImagePlus size={50} className="text-[#38B6FF]" />
            </button>
          </div>

          <form onSubmit={handleFormSubmit(onSubmit)} className="space-y-4 mt-4">
            <input
              id="file-upload"
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              {...register("imageUrl")}
              onChange={handleFileUpload}
            />

            <input
              type="text"
              value={newTopic}
              onChange={(e) => setNewTopic(e.target.value)}
              placeholder={blogData?.topic}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1"
            />

            <div className="flex gap-4">
              <input
                type="text"
                value={newCourse}
                onChange={(e) => setNewCourse(e.target.value)}
                placeholder={blogData?.course}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1"
              />

              <select
                value={newSelectedCategory}
                onChange={(e) => setNewSelectedCategory(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1"
              >
                <option value="" disabled>
                  {blogData?.selectedCategory || t("nav.blog.addblog.select")}
                </option>
                <option value="Document">{t("nav.project.document")}</option>
                <option value="Model/3D">{t("nav.project.model")}</option>
                <option value="Website">{t("nav.project.website")}</option>
                <option value="MobileApp">{t("nav.project.mobileapp")}</option>
                <option value="Datasets">{t("nav.project.datasets")}</option>
                <option value="AI">{t("nav.project.ai")}</option>
                <option value="IOT">{t("nav.project.iot")}</option>
                <option value="Program">{t("nav.project.program")}</option>
                <option value="Photo/Art">{t("nav.project.photo")}</option>
                <option value="Other">{t("nav.project.other")}</option>
              </select>
            </div>

            <textarea
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              placeholder={blogData?.description}
              className="w-full h-60 p-2 border border-gray-300 rounded focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1"
            />

            <button
              type="submit"
              className="w-full p-2 text-white rounded hover:bg-blue-600 transition-colors"
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