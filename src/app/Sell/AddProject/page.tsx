//Sell/Addproject
"use client";
import React, { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import Upload from "./upload";
import { useSession } from "next-auth/react";
import { MdDeleteOutline } from "react-icons/md";
import { useTranslation } from "react-i18next";
import { LuImagePlus } from "react-icons/lu";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import { IoCloseCircleOutline } from "react-icons/io5";
import { OrbitProgress } from "react-loading-indicators";
import Image from "next/image";

const Project: React.FC = () => {
  const { data: session, status } = useSession();
  const [inputs, setInputs] = useState([{ id: Date.now(), value: "" }]);
  const [skillinputs, setSkillinputs] = useState([
    { id: Date.now(), value: "" },
  ]);
  const [projectname, setProjectname] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const { t } = useTranslation("translation");
  const [files, setFiles] = useState<File[]>([]);
  const [img, setImg] = useState<File[]>([]);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [status, router]);

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

  // console.log("idUser", session.user.id);

  const handleAdd = () => {
    setInputs([...inputs, { id: Date.now(), value: "" }]);
  };

  const handleRemove = (id: number) => {
    setInputs(inputs.filter((input) => input.id !== id));
  };
  const handleDelete = (index: number) => {
    setImg((prevImg) => prevImg.filter((_, i) => i !== index));
    setUploadedImages((prevImages) => prevImages.filter((_, i) => i !== index));

    // Reset the file input to allow re-selection of the same file
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

  const handleAddSkill = () => {
    setSkillinputs([...skillinputs, { id: Date.now(), value: "" }]);
  };

  const handleRemoveSkill = (id: number) => {
    setSkillinputs(skillinputs.filter((input) => input.id !== id));
  };

  const handleSkillInputChange = (id: number, value: string) => {
    setSkillinputs(
      skillinputs.map((input) =>
        input.id === id ? { ...input, value } : input
      )
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
  
    if (!session?.user?.email || !session?.user?.id) {
      Swal.fire({
        position: "center",
        icon: "error",
        title: "User is not authenticated",
        showConfirmButton: false,
        timer: 3000,
      });
      return;
    }
     // Validate required fields and skills
  if (skillinputs.length < 1 || !skillinputs[0].value) {
    Swal.fire({
      icon: "error",
      title: "Validation Error",
      text: "Please add at least one skill",
      timer: 3000,
    });
    return;
  }

  // Validate other required fields
  if (!projectname || !description || !category || !price || !inputs[0].value || img.length === 0 || files.length === 0) {
    Swal.fire({
      icon: "error",
      title: "Validation Error",
      text: "Please fill in all required fields",
      timer: 3000,
    });
    return;
  }
  
    // Initialize form data
    const rathingValue = parseFloat("0.0");
    const soldValue = 0;
    const reviewValue = 0;
    const formData = new FormData();
  
    // Add data to FormData
    formData.append("projectname", projectname || "");
    formData.append("description", description || "");
    formData.append("receive", JSON.stringify(inputs.map((input) => input.value)));
    formData.append("skill", JSON.stringify(skillinputs.map((input) => input.value)));
    formData.append("category", category || "");
    formData.append("price", price || "");
    formData.append("email", session.user.email);
    formData.append("iduser", session.user.id);
    formData.append("rathing", rathingValue.toFixed(1));
    formData.append("sold", soldValue.toString());
    formData.append("review", reviewValue.toString());
    formData.append("permission", "false");
    formData.append("status", "pending");
  
    img.forEach((img) => formData.append("imageUrl", img));
    files.forEach((file) => formData.append("filesUrl", file));
  
    try {
      const res = await fetch("/api/project", {
        method: "POST",
        body: formData,
      });
  
      if (res.ok) {
        const data = await res.json();
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
          title: "Processing...",
          allowOutsideClick: false,
          allowEscapeKey: false,
          didOpen: () => {
            Swal.showLoading();
          },
        });
      
        // Send notification
        await fetch("/api/notification", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: "โปรเจ็คได้ส่งไปยังเว็บไซค์แล้ว รอตตรวจสอบ",
            email: session.user.email,
          }),
        });
      
        // Redirect first, then close the alert
        router.push(`/Sell`);
        setTimeout(() => {
          Swal.close();
        }, 1000); // Close alert 1 second after navigation
      } else {
        Swal.fire({
          position: "center",
          icon: "error",
          title: "Failed to submit project",
          showConfirmButton: false,
          timer: 3000,
        });
      }
    } catch (error) {
      Swal.fire({
        position: "center",
        icon: "error",
        title: "Error submitting project",
        text: error instanceof Error ? error.message : "An unknown error occurred",
        showConfirmButton: false,
        timer: 3000,
      });
    }
  };

  const handleFilesChange = (newFiles: File[]) => {
    console.log("Files received in main component:", newFiles);
    setFiles(newFiles);
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
                <div key={index} className="relative w-40 h-40">
                  <div className="relative w-full h-full">
                    <Image
                      src={image}
                      alt={`Uploaded ${index}`}
                      fill
                      className="object-cover rounded-md"
                      sizes="(max-width: 160px) 100vw, 160px"
                      priority={index === 0} // ให้ความสำคัญกับรูปแรก
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDelete(index)}
                    className="absolute top-2 right-2 bg-white p-1 rounded-full shadow-md hover:bg-gray-200 z-10"
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
                placeholder={t("nav.sell.addP.proname")}
                value={projectname}
                onChange={(e) => setProjectname(e.target.value)}
                className="mt-5 block w-full px-3 py-2 bg-white border border-slate-300 shadow-sm placeholder-slate-400 rounded-md sm:text-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1"
              />
            </div>
            <div className="mt-5">
              <p className="text-gray-500">* {t("nav.sell.addP.updes")}</p>
              <Upload onFilesChange={handleFilesChange} />
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
            {/* Receieve Section */}
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
            {/* Skill Section */}
            <h1 className="mt-5 text-[24px] font-bold">
              {t("nav.skill.title")}
            </h1>
            <p className="text-gray-500">{t("nav.skill.desadd")}</p>
            <div>
              {skillinputs.map((input) => (
                <div key={input.id} className="flex items-center mt-5">
                  <input
                    id={`skill-${input.id}`}
                    type="text"
                    value={input.value}
                    onChange={(e) =>
                      handleSkillInputChange(input.id, e.target.value)
                    }
                    placeholder={t("nav.skill.title")}
                    required
                    className="block w-full px-3 py-2 bg-white border border-slate-300 shadow-sm placeholder-slate-400 rounded-md sm:text-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1"
                  />
                  <MdDeleteOutline
                    size={30}
                    className="ml-3 text-gray-500 hover:text-red-500 cursor-pointer"
                    onClick={() => handleRemoveSkill(input.id)}
                  />
                </div>
              ))}
              <button
                type="button"
                className="mt-5 flex w-full justify-center rounded-md bg-[#38B6FF] hover:bg-sky-300 px-3 py-3 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-sky-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                onClick={handleAddSkill}
              >
                <p className="text-[18px]">{t("nav.skill.addskill")}</p>
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
