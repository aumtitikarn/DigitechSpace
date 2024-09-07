"use client";
import React, { useState, useRef } from "react";
import { GoFile } from "react-icons/go";
import { useTranslation } from "react-i18next";

interface UploadProps {
  onFilesChange: (files: File[]) => void;
  existingFiles: string[];
  onExistingFileRemove: (fileName: string) => void;
}

const Upload: React.FC<UploadProps> = ({
  onFilesChange,
  existingFiles,
  onExistingFileRemove,
}) => {
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);
  const maxFilesize = 50; // Maximum total file size in MB
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { t } = useTranslation("translation");

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files || []);
    let totalSize =
      selectedFiles.reduce((acc, file) => acc + file.size, 0) +
      newFiles.reduce((acc, file) => acc + file.size, 0);

    if (totalSize > maxFilesize * 1024 * 1024) {
      setError(t("nav.sell.upload.error"));
      return;
    }

    const updatedNewFiles = [...newFiles, ...selectedFiles];
    setNewFiles(updatedNewFiles);
    setError(null);
    onFilesChange(updatedNewFiles);
  };

  const handleRemoveNewFile = (index: number) => {
    const updatedNewFiles = newFiles.filter((_, i) => i !== index);
    setNewFiles(updatedNewFiles);
    onFilesChange(updatedNewFiles);
  };
  const handleExistingFileRemove = (fileName: string) => {
    if (typeof onExistingFileRemove === "function") {
      onExistingFileRemove(fileName);
    } else {
      console.error("onExistingFileRemove is not a function");
    }
  };

  return (
    <div id="hs-file-upload-with-limited-file-size">
      <div
        className="cursor-pointer p-12 flex justify-center bg-white border border-dashed border-gray-300 rounded-xl"
        onClick={() => fileInputRef.current?.click()}
      >
        <div className="text-center">
          <span className="inline-flex justify-center items-center size-16 bg-gray-100 text-gray-800 rounded-full ">
            <svg
              className="shrink-0 size-6"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="17 8 12 3 7 8"></polyline>
              <line x1="12" x2="12" y1="3" y2="15"></line>
            </svg>
          </span>
          <div className="mt-4 flex flex-wrap justify-center text-sm leading-6 text-gray-600">
            <span className="pe-1 font-medium text-gray-800 ">
              {t("nav.sell.upload.p1")}
            </span>
            <span className="bg-white font-semibold text-blue-600 hover:text-blue-700 rounded-lg decoration-2 hover:underline focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-600 focus-within:ring-offset-2">
              {t("nav.sell.upload.p2")}
            </span>
          </div>
          <p className="mt-1 text-xs text-gray-400 ">
            {t("nav.sell.upload.p3")} {maxFilesize}
            {t("nav.sell.upload.p4")}
          </p>
          <input
            type="file"
            multiple
            className="hidden"
            ref={fileInputRef}
            onChange={handleFileChange}
          />
        </div>
      </div>

      <div className="mt-4 space-y-2">
        {existingFiles.map((fileName, index) => (
          <div
            key={`existing-${index}`}
            className="p-3 bg-white border border-solid border-gray-300 rounded-xl"
          >
            <div className="mb-1 flex justify-between items-center">
              <div className="flex items-center gap-x-3">
                <span className="size-10 flex justify-center items-center border border-gray-200 text-gray-500 rounded-lg">
                  <GoFile />
                </span>
                <div>
                  <p className="text-sm font-medium text-gray-800">
                    <span className="truncate inline-block max-w-[300px] align-bottom">
                      {fileName}
                    </span>
                  </p>
                  <p className="text-xs text-gray-500">Existing File</p>
                </div>
              </div>
              <div className="flex items-center gap-x-2">
                <button
                  type="button"
                  className="text-gray-500 hover:text-gray-800 focus:outline-none focus:text-gray-800"
                  onClick={() => handleExistingFileRemove(fileName)}
                >
                  <svg
                    className="shrink-0 size-4"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M3 6h18"></path>
                    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                    <line x1="10" x2="10" y1="11" y2="17"></line>
                    <line x1="14" x2="14" y1="11" y2="17"></line>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        ))}

        {newFiles.map((file, index) => (
          <div
            key={`new-${index}`}
            className="p-3 bg-white border border-solid border-gray-300 rounded-xl"
          >
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-x-3">
                <GoFile className="text-gray-500" size={24} />
                <span className="truncate">{file.name}</span>
              </div>
              <button
                type="button"
                className="text-gray-500 hover:text-gray-800 focus:outline-none focus:text-gray-800"
                onClick={() => handleRemoveNewFile(index)}
              >
                <svg
                  className="shrink-0 size-4"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M3 6h18"></path>
                  <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                  <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                  <line x1="10" x2="10" y1="11" y2="17"></line>
                  <line x1="14" x2="14" y1="11" y2="17"></line>
                </svg>
              </button>
            </div>
          </div>
        ))}
        {error && <p className="text-xs text-red-500 mt-4">{error}</p>}
      </div>
    </div>
  );
};

export default Upload;
