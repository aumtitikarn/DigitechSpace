"use client";

import React, { useState } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { GoCheck, GoShare, GoHeartFill } from "react-icons/go";
import Link from "next/link";

const Project = () => {
  const { data: session, status } = useSession();
  const [selected, setSelected] = useState("normal");


  if (status === "loading") {
    return <p>Loading...</p>;
  }

  if (!session) {
    redirect("/auth/signin");
    return null;
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#FBFBFB]">
      <main className="flex-grow">
        <Navbar session={session} />
        <div className="lg:mx-64 lg:mt-10 lg:mb-10 mt-10 mb-10 mx-5">
          <h1 className="text-[24px] font-bold">Add Project</h1>
          <div>
            <input
              id="projectname"
              name="projectname"
              type="text"
              placeholder="Project Name"
              required
              className="mt-5 block w-full px-3 py-2 bg-white border border-slate-300 shadow-sm placeholder-slate-400 rounded-md sm:text-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1"
            />
          </div>
          
          <div id="hs-file-upload-with-limited-file-size" data-hs-file-upload='{
              "url": "/upload",
              "maxFilesize": 1,
              "extensions": {
                "default": {
                  "class": "shrink-0 size-5"
                },
                "xls": {
                  "class": "shrink-0 size-5"
                },
                "zip": {
                  "class": "shrink-0 size-5"
                },
                "csv": {
                  "icon": "<svg xmlns=\\"http://www.w3.org/2000/svg\\" width=\\"24\\" height=\\"24\\" viewBox=\\"0 0 24 24\\" fill=\\"none\\" stroke=\\"currentColor\\" stroke-width=\\"2\\" stroke-linecap=\\"round\\" stroke-linejoin=\\"round\\"><path d=\\"M4 22h14a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v4\\"/><path d=\\"M14 2v4a2 2 0 0 0 2 2h4\\"/><path d=\\"m5 12-3 3 3 3\\"/><path d=\\"m9 18 3-3-3-3\\"/></svg>",
                  "class": "shrink-0 size-5"
                }
              }
            }'>
            <template data-hs-file-upload-preview="">
              <div className="p-3 bg-white border border-solid border-gray-300 rounded-xl">
                <div className="mb-1 flex justify-between items-center">
                  <div className="flex items-center gap-x-3">
                    <span className="size-10 flex justify-center items-center border border-gray-200 text-gray-500 rounded-lg" data-hs-file-upload-file-icon="">
                    <img className="rounded-lg hidden" data-dz-thumbnail="" />
                    </span>
                    <div>
                      <p className="text-sm font-medium text-gray-800">
                        <span className="truncate inline-block max-w-[300px] align-bottom" data-hs-file-upload-file-name=""></span>.<span data-hs-file-upload-file-ext=""></span>
                      </p>
                      <p className="text-xs text-gray-500" data-hs-file-upload-file-size="" data-hs-file-upload-file-success=""></p>
                      <p className="text-xs text-red-500" style= {{display: 'none'}} data-hs-file-upload-file-error="">File exceeds size limit.</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-x-2">
                    <span className="hs-tooltip [--placement:top] inline-block" style={{ display: 'none' }} data-hs-file-upload-file-error="">
                      <span className="hs-tooltip-toggle text-red-500 hover:text-red-800 focus:outline-none focus:text-red-800">
                        <svg className="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <circle cx="12" cy="12" r="10"></circle>
                          <line x1="12" x2="12" y1="8" y2="12"></line>
                          <line x1="12" x2="12.01" y1="16" y2="16"></line>
                        </svg>
                        <span className="hs-tooltip-content max-w-[100px] hs-tooltip-shown:opacity-100 hs-tooltip-shown:visible opacity-0 transition-opacity inline-block absolute invisible z-10 py-1 px-2 bg-gray-900 text-xs font-medium text-white rounded shadow-sm" role="tooltip">
                          Please try to upload a file smaller than 1MB.
                        </span>
                      </span>
                    </span>
                    <button type="button" className="text-gray-500 hover:text-gray-800 focus:outline-none focus:text-gray-800" data-hs-file-upload-reload="">
                      <svg className="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"></path>
                        <path d="M21 3v5h-5"></path>
                      </svg>
                    </button>
                    <button type="button" className="text-gray-500 hover:text-gray-800 focus:outline-none focus:text-gray-800" data-hs-file-upload-remove="">
                      <svg className="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
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
                  <div className={`flex justify-center w-[130px] items-center py-4 border border-[#ccc] ${selected ? "border-blue-500" : ""}`}                  >
                    <div className="flex flex-col justify-center rounded-full overflow-hidden bg-blue-600 text-xs text-white text-center whitespace-nowrap transition-all duration-500 hs-file-upload-complete:bg-green-500" style= {{width: 0}} data-hs-file-upload-progress-bar-pane=""></div>
                  </div>
                  <div className="w-10 text-end">
                    <span className="text-sm text-gray-800">
                      <span data-hs-file-upload-progress-bar-value="">0</span>%
                    </span>
                  </div>
                </div>
              </div>
            </template>

            <div className="cursor-pointer p-12 flex justify-center bg-white border border-dashed border-gray-300 rounded-xl" data-hs-file-upload-trigger="">
              <div className="text-center">
                <span className="inline-flex justify-center items-center size-16 bg-gray-100 text-gray-800 rounded-full">
                  <svg className="shrink-0 size-6" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="17 8 12 3 7 8"></polyline>
                    <line x1="12" x2="12" y1="3" y2="15"></line>
                  </svg>
                </span>
                <p className="mt-1 text-gray-800">
                  <span className="font-semibold">Click to upload</span> or drag and drop
                </p>
                <p className="mt-2 text-xs text-gray-500">PNG, JPG, GIF up to 1MB</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Project;
