"use client";

import React, { useState } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import Upload from "./upload";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { MdDeleteOutline } from "react-icons/md";


const Project = () => {
  const { data: session, status } = useSession();
  const [inputs, setInputs] = useState([{ id: Date.now() }]);

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  if (!session) {
    redirect("/auth/signin");
    return null;
  }

  const handleAdd = () => {
    setInputs([...inputs, { id: Date.now() }]); // Add a new input field with a unique id
  };

  const handleRemove = (id: number) => {
    setInputs(inputs.filter(input => input.id !== id)); // Remove the input field with the specified id
  };

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
          <div className="mt-5">
            <Upload />
          </div>
          <div>
            <textarea
              id="des"
              name="des"
              placeholder="Description"
              required
              rows={10} // Adjust the number of visible rows as needed
              className="mt-5 block w-full px-3 py-2 bg-white border border-slate-300 shadow-sm placeholder-slate-400 rounded-md sm:text-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1"
            ></textarea>
          </div>
          <h1 className="mt-5 text-[24px] font-bold">Receive</h1>
          <p className="text-gray-500">What customers will receive</p>
          <div>
            {inputs.map((input) => (
              <div key={input.id} className="flex items-center mt-5">
                <input
                  id={`receive-${input.id}`}
                  name={`receive-${input.id}`}
                  type="text"
                  placeholder="Receive"
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
              className="mt-5 flex w-full justify-center rounded-md bg-[#38B6FF] px-3 py-3 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-sky-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              onClick={handleAdd}
            >
              Add Receive
            </button>
          </div>
          <div className="mt-5">
            <select
              id="category"
              name="category"
              className="block w-full px-3 py-2 bg-white border border-slate-300 shadow-sm placeholder-slate-400 rounded-md sm:text-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1"
            >
              <option value="" disabled selected>Select Category</option>
              <option value="category1">Document</option>
              <option value="category2">Model/3D</option>
              <option value="category1">Website</option>
              <option value="category2">MobileApp</option>
              <option value="category3">Datasets</option>
              <option value="category1">AI</option>
              <option value="category2">IOT</option>
              <option value="category3">Program</option>
              <option value="category3">Photo/Art</option>
              <option value="category3">Other</option>
            </select>
          </div>
          <button
              type="submit"
              className="mt-5 flex w-full justify-center rounded-md bg-[#33539B] px-3 py-3 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-slate-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Add a project
            </button>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Project;