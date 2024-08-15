'use client';
import React, { useState, useRef, useEffect } from 'react';
import { GoFile } from "react-icons/go";

const FileUploadWithLimitedSize = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<number[]>([]); // Track progress of each file
  const maxFilesize = 50; // Maximum total file size in MB
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Simulate file upload progress
    if (files.length > 0) {
      const intervals = files.map((_, index) => {
        return setInterval(() => {
          setProgress((prevProgress) => {
            const newProgress = [...prevProgress];
            if (newProgress[index] < 100) {
              newProgress[index] = newProgress[index] + 1; // Increase progress
            }
            return newProgress;
          });
        }, 100); // Update progress every 100ms
      });

      // Stop intervals once progress is complete
      const progressCheckInterval = setInterval(() => {
        if (progress.every((p) => p >= 100)) {
          clearInterval(progressCheckInterval);
          intervals.forEach(clearInterval); // Clear all intervals
        }
      }, 100);

      return () => {
        clearInterval(progressCheckInterval);
        intervals.forEach(clearInterval);
      };
    }
  }, [files, progress]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files || []);
    const currentFiles = [...files];
    let totalSize = selectedFiles.reduce((acc, file) => acc + file.size, 0) + currentFiles.reduce((acc, file) => acc + file.size, 0);

    if (totalSize > maxFilesize * 1024 * 1024) {
      setError('Total file size exceeds 50MB limit.');
      return;
    }

    const newFiles: File[] = [];
    let hasError = false;

    selectedFiles.forEach((file: File) => {
      if (file.size > maxFilesize * 1024 * 1024) {
        setError(`File ${file.name} exceeds size limit.`);
        hasError = true;
      } else {
        newFiles.push(file);
      }
    });

    if (!hasError) {
      setFiles([...currentFiles, ...newFiles]);
      setProgress([...progress, ...new Array(newFiles.length).fill(0)]); // Initialize progress for new files
      setError(null);
    }
  };

  const handleRemoveFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
    setProgress(progress.filter((_, i) => i !== index)); // Remove progress for deleted files
  };

  return (
    <div id="hs-file-upload-with-limited-file-size">
      <div
        className="cursor-pointer p-12 flex justify-center bg-white border border-dashed border-gray-300 rounded-xl "
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
              Drop your files here or
            </span>
            <span className="bg-white font-semibold text-blue-600 hover:text-blue-700 rounded-lg decoration-2 hover:underline focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-600 focus-within:ring-offset-2">
              browse
            </span>
          </div>
          <p className="mt-1 text-xs text-gray-400 ">
            Pick files up to {maxFilesize}MB total.
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
        {files.map((file, index) => (
          <div
            key={index}
            className="p-3 bg-white border border-solid border-gray-300 rounded-xl "
          >
            <div className="mb-1 flex justify-between items-center">
              <div className="flex items-center gap-x-3">
                <span className="size-10 flex justify-center items-center border border-gray-200 text-gray-500 rounded-lg ">
                <GoFile />
                </span>
                <div>
                  <p className="text-sm font-medium text-gray-800 ">
                    <span className="truncate inline-block max-w-[300px] align-bottom">
                      {file.name}
                    </span>
                  </p>
                  <p className="text-xs text-gray-500 ">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-x-2">
                <button
                  type="button"
                  className="text-gray-500 hover:text-gray-800 focus:outline-none focus:text-gray-800 "
                  onClick={() => handleRemoveFile(index)}
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

            <div className="flex items-center gap-x-3 whitespace-nowrap">
              <div
                className="flex w-full h-2 bg-gray-200 rounded-full overflow-hidden "
                role="progressbar"
                aria-valuenow={progress[index] || 0}
                aria-valuemin={0}
                aria-valuemax={100}
              >
                <div
                  className="flex flex-col justify-center rounded-full overflow-hidden bg-blue-600 text-xs text-white text-center whitespace-nowrap transition-all duration-500"
                  style={{ width: `${progress[index] || 0}%` }}
                ></div>
              </div>
              <div className="w-10 text-end">
                <span className="text-sm text-gray-800 ">
                  {progress[index] || 0}%
                </span>
              </div>
            </div>
          </div>
        ))}
        {error && (
          <p className="text-xs text-red-500 mt-4">
            {error}
          </p>
        )}
      </div>
    </div>
  );
};

export default FileUploadWithLimitedSize;
