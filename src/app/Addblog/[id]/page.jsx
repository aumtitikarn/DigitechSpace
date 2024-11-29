"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useSession } from "next-auth/react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import Container from "../../components/Container";
import { LuImagePlus } from "react-icons/lu";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { IoCloseCircleOutline } from "react-icons/io5";
import { OrbitProgress } from "react-loading-indicators";
import Swal from "sweetalert2";

export default function Page() {
  const [activeButton, setActiveButton] = useState(null);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [topic, setTopic] = useState("");
  const [course, setCourse] = useState("");
  const [description, setDescription] = useState("");
  const [postData, setPostData] = useState("");
  const [heart, setHeart] = useState(0);
  const [file, setFile] = useState("");
  const [previewImage, setPreviewImage] = useState(null);
  const { t } = useTranslation("translation");

  const [img, setImg] = useState([]);

  const [email, setEmail] = useState("");
  const [profileUserT, setProfileUserT] = useState("");
  const [profileUserId, setProfileUserId] = useState("");
  const [profileUsername, setProfileUsername] = useState("");
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);

  const { data: session, status } = useSession();
  const router = useRouter();

  const { register, handleSubmit } = useForm();
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

        const post = data.combinedData;
        setPostData(post);
        setProfileUserT(post.imageUrl);
        setProfileUsername(post.name);
        setProfileUserId(post._id);
        setEmail(post.email);
      } catch (error) {
      }
    };

    getPostByIdprofile();
  }, [session?.user?.id]);

  const handleDelete = (index) => {
    setImg((prevImg) => prevImg.filter((_, i) => i !== index));
    setUploadedImages((prevImages) => prevImages.filter((_, i) => i !== index));

    const fileInput = document.getElementById("file-upload");
    if (fileInput) {
      fileInput.value = "";
    }
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files || []);
    setImg((prevImg) => [...prevImg, ...files]);
    const newImages = files.map((file) => URL.createObjectURL(file));
    setUploadedImages((prevImages) => [...prevImages, ...newImages]);
  };

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


  const handleSudmit = async (e) => {
    Swal.fire({
      icon: "info",
      title:  t("status.process"),
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });
    const formData = new FormData();

    if (!session || !session.user || !session.user.name) {
      Swal.fire({
        position: "center",
        icon: "error",
        title:  t("status.login"),
        showConfirmButton: false,
        timer: 3000,
      });
      return;
    }

    if (!topic || !course || !description || !selectedCategory) {
      alert("Please complete all inputs");
      return;
    }

    formData.append("topic", topic);
    formData.append("course", course);
    formData.append("description", description);
    formData.append("heart", heart);
    formData.append("selectedCategory", selectedCategory);
    formData.append("author", profileUsername);
    formData.append("userprofileid", profileUserId);
    formData.append("userprofile", profileUserT);
    formData.append("email", email);
    img.forEach((img) => formData.append("imageUrl", img));

    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        setShowSuccessAlert(true);
        
        // Show success alert
        await Swal.fire({
          position: "center",
          icon: "success",
          title: t("authen.signup.status.success"),
          showConfirmButton: false,
          timer: 3000,
        });
      
        // Show processing alert
        Swal.fire({
          icon: "info",
          title: t("status.process"),
          allowOutsideClick: false,
          allowEscapeKey: false,
          didOpen: () => {
            Swal.showLoading();
          },
        });
        router.push("/listblog");
        setTimeout(() => {
          Swal.close();
        }, 1000);
      }
    } catch (error) {
    }
  };


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
  return (
    <Container>
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
              <div key={index} className="relative w-40 h-40">
                <Image
                  key={index}
                  src={image}
                  alt={`Uploaded ${index}`}
                  width={160} // 40 * 4 (เพราะ tailwind w-40 = 10rem = 160px)
                  height={160} // 40 * 4
                  className="w-40 h-40 object-cover rounded-md"
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
                <LuImagePlus size={50} className="text-[#38B6FF]" />
              </div>
            </button>
          </div>

          <form onSubmit={handleSubmit(handleSudmit)}>
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
              onChange={(e) => setTopic(e.target.value)}
              placeholder={t("nav.blog.addblog.topic")}
              className="w-full p-2 mb-4 border border-gray-300 rounded mt-5 focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1"
            />

            <div className="flex flex-row w-full">
              <input
                type="text"
                onChange={(e) => setCourse(e.target.value)}
                placeholder={t("nav.blog.addblog.code")}
                className="w-full p-2 mb-4 mr-5 border border-gray-300 rounded focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1"
              />

              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full p-2 mb-4 ml-5 border border-gray-300 rounded focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1"
              >
                <option value="" disabled>
                  {t("nav.blog.addblog.select")}
                </option>
                <option value="academic">{t("nav.project.academic")}</option>
                <option value="social">{t("nav.project.social")}</option>
                <option value="finance">{t("nav.project.finance")}</option>
                <option value="accommodation">{t("nav.project.accommodation")}</option>
                <option value="foodHealth">{t("nav.project.foodHealth")}</option>
                <option value="events">{t("nav.project.events")}</option>
                <option value="relationships">{t("nav.project.relationships")}</option>
                <option value="technology">{t("nav.project.technology")}</option>
                <option value="lifestyle">{t("nav.project.lifestyle")}</option>
                <option value="career">{t("nav.project.career")}</option>
                <option value="portfolio">{t("nav.project.portfolio")}</option>
                <option value="other">{t("nav.project.other")}</option>
              </select>
            </div>
            <textarea
              type="text"
              placeholder={t("nav.blog.addblog.des")}
              onChange={(e) => setDescription(e.target.value)}
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
