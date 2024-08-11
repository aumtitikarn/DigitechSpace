"use client";

import React, { useState } from "react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { GoX } from "react-icons/go";

interface ReportProject {
  project: string;
  onClose: () => void; // Add the onClose prop
}

const Report: React.FC<ReportProject> = ({ project, onClose }) => {
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
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-50">
      <div className="relative max-w-lg w-full p-8 bg-white shadow-md rounded-lg">
        <GoX 
          onClick={onClose} // Use the onClose prop to close the modal
          className="absolute top-4 right-4 text-red-600 text-3xl cursor-pointer" 
        />
        <h2 className="text-2xl font-bold mb-4 text-center">Report</h2>  
        <p className="text-lg font-medium mb-4 border-b border-gray-300">Project: {project}</p>

        <p className="text-lg font-medium mb-2">Reason</p>
        <select
          value={selectedReason}
          onChange={handleReasonChange}
          className="w-full p-2 border rounded-md mb-5"
        >
          <option value="">Select a reason</option>
          <option value="received_incomplete_files">Received incomplete files</option>
          <option value="file_not_working">File not working properly</option>
          <option value="hard_to_understand">Hard to understand, no manual</option>
          <option value="copyright_violation">Copyright violation</option>
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
    </div>
  );
};

export default Report;
