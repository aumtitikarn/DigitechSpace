import React, { useState } from "react";
import { useSession } from "next-auth/react";
import { GoX } from "react-icons/go";
import { useTranslation } from "react-i18next";
import Swal from 'sweetalert2';

interface ReportProps {
  project: { projectname: string; _id: string; author: string; email?: string;};
  onClose: () => void;
}

const Report: React.FC<ReportProps> = ({ project, onClose }) => {
  const [review, setReview] = useState("");
  const [report, setSelectedReason] = useState<string>("ได้รับไฟล์ไม่ครบตามที่กำหนด");
  const [submissionStatus, setSubmissionStatus] = useState<string | null>(null);
  const maxLength = 200;
  const { t } = useTranslation("translation");
  const { data: session } = useSession();

  const charactersRemaining = maxLength - review.length;

  const handleReviewChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setReview(event.target.value);
  };

  const handleSubmit = async () => {
    if (!session) return;

    // Ensure all required fields are populated
    if (!project || !report || !review ) {
      console.error("All fields are required");
      return; // Prevent submission if fields are missing
    }

    const data = {
      name: project.projectname,
      projectId: project._id,
      email: project.email,
      report: report, // Ensure this is a valid enum value
      more: review,
      username: session.user?.name,
      author: project.author,
    };

    console.log("Data to be sent:", data); // Log data to check its correctness

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
        Swal.fire({
          icon: 'success',
          title: t("report.successMessage"),
          showConfirmButton: false,
          timer: 1500
        }).then(() => {
          onClose();
        });
      } else {
        const responseData = await response.json();
        console.error("Error response data:", responseData);
        setSubmissionStatus("error");
        Swal.fire({
          icon: 'error',
          title: t("report.errorMessage"),
          text: responseData.message || 'An unexpected error occurred',
        });
      }
    } catch (error) {
      console.error("Fetch error:", error);
      setSubmissionStatus("error");
    }
  };

  const handleReasonChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedReason(event.target.value);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-50">
      <div className="relative max-w-lg w-full p-8 bg-white shadow-md rounded-lg">
        <GoX onClick={onClose} className="absolute top-4 right-4 text-red-600 text-3xl cursor-pointer" />
        <h2 className="text-2xl font-bold mb-4 text-center">{t("report.title")}</h2>
        <p className="text-lg font-medium mb-4">
          {t("report.project.topic")} : {project.projectname || "N/A"}
        </p>
        <div className="border-b border-gray-300 my-3"></div>

        <p className="text-lg font-medium mb-2">{t("report.project.reason")}</p>
        <select 
          value={report} 
          onChange={handleReasonChange} 
          className="w-full p-2 border rounded-md mb-5"
          aria-label="Select reason for reporting"
        >
          <option value="ได้รับไฟล์ไม่ครบตามที่กำหนด">{t("report.project.r1")}</option>
        <option value="ไฟล์ไม่ทำงานตามที่ควรจะเป็น">{t("report.project.r2")}</option>
        <option value="เข้าใจยาก ไม่มีคู่มือการใช้">{t("report.project.r3")}</option>
        <option value="โครงงานมีการละเมิดลิขสิทธิ์">{t("report.project.r4")}</option>
        <option value="อื่นๆ">{t("report.project.r5")}</option>
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
      </div>
    </div>
  );
};

export default Report;
