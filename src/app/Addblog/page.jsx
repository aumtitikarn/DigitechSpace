"use client";

import React, { useState, useRef } from "react";
import { useSession } from "next-auth/react";
import Navbar from "../components/Navbar";
import { redirect } from "next/navigation";
import Footer from "../components/Footer";
import Container from "../components/Container";
import { FaPlus } from "react-icons/fa6";
import { useRouter } from "next/navigation";
import Photo from "../components/Photo";
import ButtonSubmit from "../components/ButtonSubmit"
import { set } from "mongoose";
import { useTranslation } from "react-i18next";

export default function Page() {
  const [activeButton, setActiveButton] = useState(null);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [topic, setTopic] = useState("");
  const [course, setCourse] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState("");
  const { t, i18n } = useTranslation("translation");
  
  const { data: session, status } = useSession();
  const router = useRouter();
  const maxLength = 200;
  const handleClick = (button) => {
    setActiveButton(button === activeButton ? null : button);
  };

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  if (!session) {
    redirect("/auth/signin");
    return null;
  }

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map((file) => URL.createObjectURL(file));
    setUploadedImages((prevImages) => [...prevImages, ...newImages]);
  };

  const handleSave = () => {
    console.log("Profile saved");
  };

  const handleCombinedChange = (e) => {
    handleFileUpload(e); // Call handleFileUpload first
    setFile(e.target.files[0]); // Then set the first file to state
  };

  const handleSudmit = async (e) => {
    e.preventDefault();
    console.log(file)
    if (!topic || !course || !description || !file) {
      alert("Please complete all inputs");
      return;
    }

    try {
      const res = await fetch("http://localhost:3000/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          topic,
          course,
          description,
          file: typeof file === "String" ? file : JSON.stringify(file),
        }),
      });

      if (res.ok) {
        // Optionally redirect or show a success message
        router.push("/");
      }
    } catch (error) {
      console.log(error);
    }
  };

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
              {t("nav.blog.addblog.title")}
            </p>
          </div>

          <div className="flex flex-wrap gap-4">
            {uploadedImages.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`Uploaded ${index}`}
                className="w-40 h-40 object-cover rounded-md"
              />
            ))}

            <button
              onClick={() => document.getElementById("file-upload").click()}
              className={`flex items-center justify-center w-40 h-40 rounded-md p-2 bg-white border-2 ${
                activeButton === "button1" ? "border-b-indigo-700 border-b-4" : ""
              }`}
            >
              <div className="flex items-center justify-center w-10 h-10">
                <FaPlus size={24} />
              </div>
            </button>
          </div>

          <form onSubmit={handleSudmit}>
            <input
              id="file-upload"
              type="file"
              multiple
              className="hidden"
              onChange={handleCombinedChange}
              
            />

            <input
              type="text"
              onChange={(e) => setTopic(e.target.value)}
              placeholder={t("nav.blog.addblog.topic")}
              className="w-full p-2 mb-4 border border-gray-300 rounded mt-5"
            />

            <div className="flex flex-row w-full">
              <input
                type="text"
                onChange={(e) => setCourse(e.target.value)}
                placeholder={t("nav.blog.addblog.code")}
                className="w-full p-2 mb-4 mr-5 border border-gray-300 rounded"
              />

              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full p-2 mb-4 ml-5 border border-gray-300 rounded"
              >
                <option value="" disabled>{t("nav.blog.addblog.select")}</option>
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
              placeholder={t("nav.blog.addblog.des")}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full h-60 p-2 mb-4 border border-gray-300 rounded"
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
