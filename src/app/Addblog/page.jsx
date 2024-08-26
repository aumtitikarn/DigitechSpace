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

export default function Page() {
  const [activeButton, setActiveButton] = useState(null);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [topic, setTopic] = useState("");
  const [course, setCourse] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState("");
  const [newImages, setNewImages] = useState("");
  const [files, setFiles] = useState([]);
  
  const { data: session, status } = useSession();
  const router = useRouter();
  const formRef = useRef();

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

  const handleSudmit = async (e) => {
    e.preventDefault();

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
          file: typeof file === "string" ? file : JSON.stringify(file),
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

  async function handleInputFiles (e) {
    const files = e.target.files;
    const newFiles = [...files].filter((file) => {
      return file.size < 1024 * 1024 && file.type.startsWith("image/");
    });

    setFiles((prev) => [...newFiles, ...prev]);
    formRef.current.reset();
  };

  async function handleDeleteFile (index){
    console.log(index)

    const newFiles = files.filter((_,i) => i !== index)
    console.log(newFiles)
    setFiles(newFiles)
  }

  async function handleUpload() {
    if(!files.length) return alert('No image files are selected')

    const formData = new FormData();
    
    files.forEach(file => {
      formData.append('files',file)
    })

    const res = await uploadPhoto(formData)
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
              Add Blog
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

            <form onSubmit={handleSudmit}>
              <input
                id="file-upload"
                type="file"
                multiple
                className="hidden"
                onChange={(e) => setFile(e.target.files[0])}
              />

              <input
                type="text"
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Topic"
                className="w-full p-2 mb-4 border border-gray-300 rounded"
              />

              <div className="flex flex-row w-full">
                <input
                  type="text"
                  onChange={(e) => setCourse(e.target.value)}
                  placeholder="Course ID"
                  className="w-full p-2 mb-4 mr-5 border border-gray-300 rounded"
                />

                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full p-2 mb-4 ml-5 border border-gray-300 rounded"
                >
                  <option value="" disabled>Select Category</option>
                  <option value="Document">Document</option>
                  <option value="Model/3D">Model/3D</option>
                  <option value="Website">Website</option>
                  <option value="MobileApp">MobileApp</option>
                  <option value="Datasets">Datasets</option>
                  <option value="AI">AI</option>
                  <option value="IOT">IOT</option>
                  <option value="Program">Program</option>
                  <option value="Photo/Art">Photo/Art</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <input
                type="text"
                placeholder="Description"
                onChange={(e) => setDescription(e.target.value)}
                className="w-full h-60 p-2 mb-4 border border-gray-300 rounded"
              />

              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded w-full hover:bg-blue-600"
                style={{ backgroundColor: "#33539B" }}
              >
                Post
              </button>
            </form>
          </div>

          <form ref={formRef}>
            <div>
              <input type="file" accept="image/*" multiple onChange={handleInputFiles} />
            </div>
            <div>
              {files.map((file, index) => (
                <Photo key={index} url={URL.createObjectURL(file)} 
                onClick={() => handleDeleteFile(index)}/>
              ))}
            </div>
            <ButtonSubmit value="Upload to Cloudinary"/>
          </form>
        </div>
      </main>
      <Footer />
    </Container>
  );
}
