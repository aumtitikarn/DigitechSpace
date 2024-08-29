//Sell/Addproject
"use client";
import React, { useState } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import Upload from "./upload";
import { useSession } from "next-auth/react";
import { MdDeleteOutline } from "react-icons/md";
import { useTranslation } from "react-i18next";
import Alert from "@mui/material/Alert";
import { AiFillPlusCircle } from "react-icons/ai";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";

const Project: React.FC = () => {
  const { data: session, status } = useSession();
  const [inputs, setInputs] = useState([{ id: Date.now(), value: "" }]);
  const [projectname, setProjectname] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const { t } = useTranslation("translation");
  const [files, setFiles] = useState<File[]>([]);
  const [img, setImg] = useState<File[]>([]);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const router = useRouter();

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  const handleAdd = () => {
    setInputs([...inputs, { id: Date.now(), value: "" }]);
  };

  const handleRemove = (id: number) => {
    setInputs(inputs.filter((input) => input.id !== id));
  };

  const handleInputChange = (id: number, value: string) => {
    setInputs(
      inputs.map((input) => (input.id === id ? { ...input, value } : input))
    );
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setImg((prevImg) => [...prevImg, ...files]); // เพิ่มไฟล์ใหม่เข้าไปใน state
    const newImages = files.map((file) => URL.createObjectURL(file));
    setUploadedImages((prevImages) => [...prevImages, ...newImages]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();

    formData.append("projectname", projectname);
    formData.append("description", description);
    formData.append(
      "receive",
      JSON.stringify(inputs.map((input) => input.value))
    );
    formData.append("category", category);
    img.forEach((file, index) => formData.append(`imageUrl`, file));

    try {
      const res = await fetch("/api/project", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        setShowSuccessAlert(true);
        setTimeout(() => {
          setShowSuccessAlert(false);
        }, 5000);
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Success",
          showConfirmButton: false,
          timer: 3000,
        });
        setTimeout(() => {
          router.push(`/Sell/test/${data._id}`);
        }, 3000);
      } else {
        console.error("Failed to submit project");
        Swal.fire({
          position: "center",
          icon: "error",
          title: "Failed to submit project",
          showConfirmButton: false,
          timer: 3000,
        });
      }
    } catch (error) {
      console.error("Error submitting project:", error);
      Swal.fire({
        position: "center",
        icon: "error",
        title: "Error submitting project",
        text:
          error instanceof Error ? error.message : "An unknown error occurred",
        showConfirmButton: false,
        timer: 3000,
      });
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#FBFBFB]">
      <main className="flex-grow">
        <Navbar />
        <div className="lg:mx-64 lg:mt-10 lg:mb-10 mt-10 mb-10 mx-5">
          <h1 className="text-[24px] font-bold">{t("nav.sell.buttAdd")}</h1>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-wrap gap-4 mt-3">
              {uploadedImages.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`Uploaded ${index}`}
                  className="w-40 h-40 object-cover rounded-md "
                />
              ))}
              <button
                type="button"
                onClick={() => document.getElementById("file-upload")?.click()}
                className="flex items-center justify-center w-40 h-40 rounded-md p-2 bg-white border-2"
              >
                <div className="flex items-center justify-center w-10 h-10">
                  <AiFillPlusCircle size={50} className="text-[#38B6FF]" />
                </div>
              </button>
            </div>
            <input
              id="file-upload"
              type="file"
              multiple
              className="hidden"
              onChange={handleFileUpload}
              accept="image/*" // ใส่ accept เพื่อจำกัดประเภทไฟล์
            />
            <div>
              <input
                id="projectname"
                type="text"
                placeholder={t("nav.sell.addP.proname")}
                value={projectname}
                onChange={(e) => setProjectname(e.target.value)}
                className="mt-5 block w-full px-3 py-2 bg-white border border-slate-300 shadow-sm placeholder-slate-400 rounded-md sm:text-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1"
              />
            </div>
            <div className="mt-5">
              <Upload />
            </div>
            <div>
              <textarea
                id="description"
                placeholder={t("nav.sell.addP.des")}
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
            <button
              type="submit"
              className="mt-5 flex w-full justify-center rounded-md bg-[#33539B] px-3 py-3 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-sky-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              <p className="text-[18px]">{t("nav.sell.buttAdd")}</p>
            </button>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Project;
