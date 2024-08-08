'use client';

import React ,{useState}from 'react';
import Navbar from "./Navbar";
import Footer from "./Footer";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { GoX } from "react-icons/go";

interface ReportProject {
  project: string;
}

const Report: React.FC<ReportProject> = ({ project }) => {
  const [review, setReview] = useState("");
  const [selectedReason, setSelectedReason] = useState<string>("");
  const maxLength = 200;

  const handleReviewChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setReview(event.target.value);
  };

  const handleReasonChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedReason(event.target.value);
  };

  const handleSubmit = () => {
    // Handle submit logic here
    console.log("Review:", review);
    console.log("Selected Reason:", selectedReason);
  };

  const charactersRemaining = maxLength - review.length;
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <p>Loading...</p>;
  }
  
  if (!session) {
    redirect("/auth/signin");
    return null;
  }
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar session={session} />
      <main className="flex-grow px-4 py-8 sm:px-6 lg:px-8">
        <div className="relative max-w-lg mx-auto p-8 bg-white shadow-md rounded-lg mt-10 border-2 border-gray-300">
          <GoX className="absolute top-4 right-4 text-red-600 text-3xl cursor-pointer" />
          <h2 className="text-2xl font-bold mb-4 text-center">Report</h2>  
          <p className="text-lg font-medium mb-4  border-b border-gray-300">Project: Facebook Website</p>

          <p className="text-lg font-medium mb-2">Reason</p>
          <select
            value={selectedReason}
            onChange={handleReasonChange}
            className="w-full p-2 border rounded-md mb-5"
          >
            <option value=""> </option>
            <option value="received_incomplete_files">ได้รับไฟล์ไม่ครบตามที่แจ้ง</option>
            <option value="file_not_working">ไฟล์ไม่ทำงานตามที่ควรจะเป็น</option>
            <option value="hard_to_understand">เข้าใจยาก ไม่มีคู่มือการใช้</option>
            <option value="copyright_violation">โครงงานมีการละเมิดลิขสิทธิ์</option>
          </select>
          <p className="text-lg font-medium mb-2">Additional message (200 Characters)</p>
          <div className="relative mb-5">
            <textarea
              placeholder=""
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
            Report
          </button>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Report;
