//Sell/Edit
"use client";
import React, { useState, useEffect, Suspense } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import Upload from "./upload";
import { useSession } from "next-auth/react";
import { MdDeleteOutline } from "react-icons/md";
import { useTranslation } from "react-i18next";
import { LuImagePlus } from "react-icons/lu";
import Swal from "sweetalert2";
import { useRouter, useSearchParams } from "next/navigation";
import { IoCloseCircleOutline } from "react-icons/io5";
import { OrbitProgress } from "react-loading-indicators";
import Image from "next/image";
const LoadingSpinner = () => (
  <div className="flex justify-center items-center h-screen">
    <OrbitProgress variant="track-disc" dense color="#33539B" size="medium" />
  </div>
);
const ProjectEdit = () => {
  const { data: session, status } = useSession();
  const [inputs, setInputs] = useState([{ id: Date.now(), value: "" }]);
  const [projectname, setProjectname] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const { t } = useTranslation("translation");
  const [files, setFiles] = useState<File[]>([]);
  const [img, setImg] = useState<File[]>([]);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [existingFiles, setExistingFiles] = useState<string[]>([]);
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [projectId, setProjectId] = useState<string | null>(null);
  const [imagesToDelete, setImagesToDelete] = useState<string[]>([]);
  const [filesToDelete, setFilesToDelete] = useState<string[]>([]);

  // Fetch existing project data
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
    const fetchProjectData = async () => {
      const id = searchParams.get("edit");
      if (id) {
        setProjectId(id);
        try {
          const response = await fetch(`/api/project/update/get/${id}`);
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const data = await response.json();
          console.log("Received project data:", data);

          setProjectname(data.projectname || "");
          setDescription(data.description || "");
          setCategory(data.category || "");
          setPrice(data.price ? data.price.toString() : "");
          setInputs(
            Array.isArray(data.receive)
              ? data.receive.map((value: string, index: number) => ({
                  id: Date.now() + index,
                  value,
                }))
              : []
          );
          setExistingImages(data.imageUrl || []);
          setExistingFiles(data.filesUrl || []);
        } catch (error) {
          console.error("Error fetching project data:", error);
          Swal.fire({
            icon: "error",
            title: "Error",
            text: `Failed to load project data: ${
              error instanceof Error ? error.message : "Unknown error"
            }`,
          });
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);

      }
    };

    fetchProjectData();
  }, [searchParams, status, router]);

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
  const handleDeleteExistingImage = (index: number) => {
    const imageToDelete = existingImages[index];
    setExistingImages((prevImages) => prevImages.filter((_, i) => i !== index));
    setImagesToDelete((prev) => [...prev, imageToDelete]);
  };

  const handleAdd = () => {
    setInputs([...inputs, { id: Date.now(), value: "" }]);
  };

  const handleRemove = (id: number) => {
    setInputs(inputs.filter((input) => input.id !== id));
  };

  const handleDelete = (index: number) => {
    setImg((prevImg) => prevImg.filter((_, i) => i !== index));
    setUploadedImages((prevImages) => prevImages.filter((_, i) => i !== index));

    const fileInput = document.getElementById(
      "file-upload"
    ) as HTMLInputElement;
    if (fileInput) {
      fileInput.value = "";
    }
  };

  const handleInputChange = (id: number, value: string) => {
    setInputs(
      inputs.map((input) => (input.id === id ? { ...input, value } : input))
    );
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setImg((prevImg) => [...prevImg, ...files]);
    const newImages = files.map((file) => URL.createObjectURL(file));
    setUploadedImages((prevImages) => [...prevImages, ...newImages]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    Swal.fire({
      icon: "info",
      title: t("status.process"),
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    if (
      !session ||
      !session.user ||
      !session.user.name ||
      !session.user.email
    ) {
      Swal.fire({
        position: "center",
        icon: "error",
        title: t("status.login"),
        showConfirmButton: false,
        timer: 3000,
      });
      return;
    }

    

    const formData = new FormData();
    formData.append("projectname", projectname);
    formData.append("description", description);
    formData.append(
      "receive",
      JSON.stringify(inputs.map((input) => input.value))
    );
    formData.append("category", category);
    formData.append("price", price);

    // Append existing images that were not deleted
    existingImages.forEach((img) => formData.append("existingImageUrl", img));

    // Append new images
    img.forEach((imgFile) => formData.append("newImageUrl", imgFile));

    // Append images to delete
    imagesToDelete.forEach((image) => formData.append("imagesToDelete", image));

    // Append new files
    files.forEach((file) => formData.append("newFilesUrl", file));

    filesToDelete.forEach((file) => formData.append("filesToDelete", file));

    try {
      const res = await fetch(`/api/project/update/${projectId}`, {
        method: "PUT",
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        setShowSuccessAlert(true);
        setTimeout(() => setShowSuccessAlert(false), 3000);

        Swal.fire({
          position: "center",
          icon: "success",
          title: t("status.success"),
          showConfirmButton: false,
          timer: 3000,
        });

        setTimeout(() => {
          router.push(`/project/projectdetail/${projectId}`);
        }, 3000);
      } else {
        console.error("Failed to update project");
        Swal.fire({
          position: "center",
          icon: "error",
          title: "error",
          showConfirmButton: false,
          timer: 3000,
        });
      }
    } catch (error) {
      console.error("Error updating project:", error);
      Swal.fire({
        position: "center",
        icon: "error",
        title: "Error",
        text:
          error instanceof Error ? error.message : "An unknown error occurred",
        showConfirmButton: false,
        timer: 3000,
      });
    }
  };

  const handleFilesChange = (newFiles: File[]) => {
    console.log("Files received in main component:", newFiles);
    setFiles(newFiles);
  };
  const handleDeleteExistingFile = (fileName: string) => {
    setExistingFiles((prevFiles) =>
      prevFiles.filter((file) => file !== fileName)
    );
    setFilesToDelete((prev) => [...prev, fileName]);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#FBFBFB]">
      <main className="flex-grow">
        <div className="lg:mx-64 lg:mt-10 lg:mb-10 mt-10 mb-10 mx-5">
          <h1 className="text-[24px] font-bold">{t("nav.sell.edit")}</h1>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-wrap gap-4 mt-3">
              {existingImages.map((image, index) => (
                <div key={`existing-${index}`} className="relative w-40 h-40">
                  <Image
                    src={`/api/project/images/${image}`}
                    alt={`Existing ${index}`}
                    width={160}
                    height={160}
                    className="object-cover rounded-md"
                    unoptimized // ใช้ถ้าเป็นรูปภาพจาก local API
                  />
                  <button
                    type="button"
                    onClick={() => handleDeleteExistingImage(index)}
                    className="absolute top-2 right-2 bg-white p-1 rounded-full shadow-md hover:bg-gray-200"
                  >
                    <IoCloseCircleOutline className="text-red-500" size={24} />
                  </button>
                </div>
              ))}
              {uploadedImages.map((image, index) => (
                <div key={`new-${index}`} className="relative w-40 h-40">
                  <Image
                    src={image}
                    alt={`Uploaded ${index}`}
                    fill
                    className="object-cover rounded-md"
                    sizes="(max-width: 160px) 100vw, 160px"
                    priority={index === 0} // ให้ความสำคัญกับรูปแรก
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
                type="button"
                onClick={() => document.getElementById("file-upload")?.click()}
                className="flex items-center justify-center w-40 h-40 rounded-md p-2 bg-white border-2"
              >
                <div className="flex items-center justify-center w-10 h-10">
                  <LuImagePlus size={50} className="text-[#38B6FF]" />
                </div>
              </button>
            </div>
            <input
              id="file-upload"
              type="file"
              multiple
              className="hidden"
              onChange={handleFileUpload}
              accept="image/*"
            />
            <div>
              <input
                id="projectname"
                type="text"
                placeholder={projectname || t("nav.sell.addP.proname")}
                value={projectname}
                onChange={(e) => setProjectname(e.target.value)}
                className="mt-5 block w-full px-3 py-2 bg-white border border-slate-300 shadow-sm placeholder-slate-400 rounded-md sm:text-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1"
              />
            </div>
            <div className="mt-5">
              <p className="text-gray-500">* {t("nav.sell.addP.updes")}</p>
              <Upload
                onFilesChange={handleFilesChange}
                existingFiles={existingFiles}
                onExistingFileRemove={handleDeleteExistingFile}
              />
            </div>
            <div>
              <textarea
                id="description"
                placeholder={description || t("nav.sell.addP.des")}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={10}
                className="mt-5 block w-full px-3 py-2 bg-white border border-slate-300 shadow-sm placeholder-slate-400 rounded-md sm:text-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1"
              ></textarea>
            </div>
            <h1 className="mt-5 text-[24px] font-bold">
              {t("nav.sell.addP.receive")}
            </h1>
            <p className="text-gray-500">{t("nav.sell.addP.desre")}</p>
            <div>
              {inputs.map((input) => (
                <div key={input.id} className="flex items-center mt-5">
                  <input
                    id={`receive-${input.id}`}
                    type="text"
                    value={input.value}
                    onChange={(e) =>
                      handleInputChange(input.id, e.target.value)
                    }
                    placeholder={t("nav.sell.addP.receive")}
                    required
                    className="block w-full px-3 py-2 bg-white border border-slate-300 shadow-sm placeholder-slate-400 rounded-md sm:text-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1"
                  />
                  <MdDeleteOutline
                    size={30}
                    className="ml-3 text-gray-500 hover:text-red-500 cursor-pointer"
                    onClick={() => handleRemove(input.id)}
                  />
                </div>
              ))}
              <button
                type="button"
                className="mt-5 flex w-full justify-center rounded-md bg-[#38B6FF] hover:bg-sky-300 px-3 py-3 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-sky-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                onClick={handleAdd}
              >
                <p className="text-[18px]">{t("nav.sell.addP.buttre")}</p>
              </button>
            </div>
            <div className="mt-5">
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="block w-full px-3 py-2 bg-white border border-slate-300 shadow-sm placeholder-slate-400 rounded-md sm:text-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1"
              >
                <option value="" disabled>
                  {t("nav.sell.addP.select")}
                </option>
                <option value="document">{t("nav.project.document")}</option>
                <option value="model">{t("nav.project.model")}</option>
                <option value="website">{t("nav.project.website")}</option>
                <option value="mobileapp">{t("nav.project.mobileapp")}</option>
                <option value="datasets">{t("nav.project.datasets")}</option>
                <option value="ai">{t("nav.project.ai")}</option>
                <option value="iot">{t("nav.project.iot")}</option>
                <option value="program">{t("nav.project.program")}</option>
                <option value="photo">{t("nav.project.photo")}</option>
                <option value="other">{t("nav.project.other")}</option>
              </select>
            </div>
            <div className="mt-5">
              <p className="text-gray-500">* {t("nav.sell.addP.pricedes")}</p>
              <input
                id="price"
                type="text"
                placeholder={t("nav.sell.addP.price")}
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className=" block w-full px-3 py-2 bg-white border border-slate-300 shadow-sm placeholder-slate-400 rounded-md sm:text-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1"
              />
            </div>
            <button
              type="submit"
              className="mt-5 flex w-full justify-center rounded-md bg-[#33539B] px-3 py-3 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-sky-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              <p className="text-[18px]">{t("nav.sell.edit")}</p>
            </button>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
};

const ProjectEditPage: React.FC = () => {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <ProjectEdit />
    </Suspense>
  );
};

export default ProjectEditPage;
