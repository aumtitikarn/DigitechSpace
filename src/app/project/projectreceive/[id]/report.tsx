
"use client";

import React, { useState } from "react";
import { useSession } from "next-auth/react";
import { GoX } from "react-icons/go";
import { useTranslation } from "react-i18next";


// กำหนด ReportProps interface
interface ReportProps {
  project: project; // ใช้ ProjectData แทน
  onClose: () => void;
}


const Report: React.FC<ReportProps> = ({ project, onClose }) => {

  const [review, setReview] = useState("");
  const [selectedReason, setSelectedReason] = useState<string>("");
  const [submissionStatus, setSubmissionStatus] = useState<string | null>(null);
  const maxLength = 200;
  const { t } = useTranslation("translation");
  const { data: session, status } = useSession();

  const charactersRemaining = maxLength - review.length;

  const handleReviewChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setReview(event.target.value);
  };

  
  const handleSubmit = async () => {
    if (!session) return;
  
    const data = {
      name: project,
      report: selectedReason,
      more: review,
      username: session.user?.name,
    };
  
    console.log("Data to be sent:", data);
  
    try {
      const response = await fetch("/api/reportproject", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
  
      if (response.ok) {
        setSubmissionStatus("success");
        setTimeout(onClose, 2000);
      } else {
        const responseData = await response.json();
        console.error("Error response data:", responseData);
        setSubmissionStatus("error");
      }
    } catch (error) {
      console.error("Fetch error:", error);
      setSubmissionStatus("error");
    }
  };
  const handleReasonChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedReason(event.target.value);
  };
  
  console.log("Selected reason:", selectedReason); // ตรวจสอบค่าที่เลือก
  
  

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-50">
      <div className="relative max-w-lg w-full p-8 bg-white shadow-md rounded-lg">
        <GoX
          onClick={onClose}
          className="absolute top-4 right-4 text-red-600 text-3xl cursor-pointer"
        />
        <h2 className="text-2xl font-bold mb-4 text-center">{t("report.title")}</h2>
        <p className="text-lg font-medium mb-4">
          {t("report.project.topic")} : {project}
        </p>
        <div className="border-b border-gray-300 my-3"></div>

        <p className="text-lg font-medium mb-2">{t("report.project.reason")}</p>
        <select
          value={selectedReason}
          onChange={handleReasonChange}
          className="w-full p-2 border rounded-md mb-5"
        >
          <option value="profanity">{t("report.project.r1")}</option>
          <option value="off-topic">{t("report.project.r2")}</option>
          <option value="illegal-ads">{t("report.project.r3")}</option>
          <option value="unrelated">{t("report.project.r4")}</option>
          <option value="other">{t("report.project.r5")}</option>
        </select>

        <p className="text-lg font-medium mb-2">{t("report.project.add")}</p>
        <div className="relative mb-5">
          <textarea
            placeholder={t("report.text")}
            value={review}
            onChange={handleReviewChange}
            className="w-full h-40 p-3 border-2 border-gray-300 rounded-md resize-none"
            maxLength={maxLength}
          />
          <div className="absolute bottom-2 right-2 text-gray-500 text-sm">
            {charactersRemaining} / {maxLength}
          </div>
        </div>

        <button
          onClick={handleSubmit}
          className="w-full bg-red-500 text-white py-2 rounded-md hover:bg-red-600 transition-colors duration-200"
        >
          {t("report.send")}
        </button>
        {/* Display success or error message */}
        {submissionStatus === "success" && (
          <p className="mt-4 text-green-500 text-center">
            {t("report.successMessage")}
          </p>
        )}
        {submissionStatus === "error" && (
          <p className="mt-4 text-red-500 text-center">
            {t("report.errorMessage")}
          </p>
        )}
      </div>
    </div>
  );
};

export default Report;
