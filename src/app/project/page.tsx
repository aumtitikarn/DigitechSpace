'use client';

import React from 'react';
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { GoCheck ,GoShare,GoHeartFill } from "react-icons/go";
import Link from "next/link";

const Project = () => {
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
     <div className="flex flex-col items-center p-4 lg:flex-col lg:items-start lg:space-x-8">
      <div className="  lg:w-2/5 flex justify-cente ">
        <img
          src="/face.png"
          alt="Project Image"
          className="w-full h-auto object-cover"
        />
      </div>

      {/* Information Section */}
      <div className="w-full lg:w-3/5] ">
      <div className="flex items-start justify-between mt-4">
       <div>
    <h1 className="text-xl font-bold mt-4 lg:mt-0">Facebook Website</h1>
    <p className="text-sm text-gray-500">By Titikarn Waitayasuwan</p>
    <p className="text-lg text-blue-600 font-bold mt-2">45,000 THB</p>
    <p className="text-yellow-500 mt-2">4.8 (28) | 1 day ago</p>
       </div>

  <div className="flex flex-col items-end">
    <div className="flex space-x-2 mt-10">
      <GoShare className="text-gray-600 cursor-pointer text-2xl" />
      <Link href="/favorite">
      <GoHeartFill className="text-gray-600 cursor-pointer text-2xl" />
      </Link>
    </div>
    <button className="bg-blue-600 text-white px-10 py-2 rounded-lg mt-4">
      Buy
    </button>
  </div>
</div>

        {/* Description Section */}
        <div className="bg-gray-100 p-4 rounded-lg mt-4">
          <h2 className="text-lg font-semibold">Description</h2>
          <p className="text-sm text-gray-600 mt-2">
            This is just a dummy text that has been inserted as a placeholder for the actual content...
          </p>
        </div>
        
        {/* Receive Section */}
        <div className="bg-gray-100 p-4 rounded-lg mt-4">
          <h2 className="text-lg font-semibold">Receive</h2>
          <ul className="list-none text-sm text-gray-600 mt-2">
  <li className="flex items-center">
    <GoCheck className="w-5 h-5 text-green-500 mr-2" />
    รายการ
  </li>
  <li className="flex items-center">
    <GoCheck className="w-5 h-5 text-green-500 mr-2" />
    ชุดข้อความ
  </li>
  <li className="flex items-center">
    <GoCheck className="w-5 h-5 text-green-500 mr-2" />
    ข้อมูล
  </li>
</ul>
        </div>
        
        {/* Review Section */}
        <div className="bg-gray-100 p-4 rounded-lg mt-4">
          <h2 className="text-lg font-semibold">Review</h2>
          <div className="mt-2">
            <p className="font-bold">Thanchank - 5.0</p>
            <p className="text-sm text-gray-600">ดีมาก ประทับใจมากค่ะ</p>
          </div>
          <div className="mt-2">
            <p className="font-bold">Thuncharee - 5.0</p>
            <p className="text-sm text-gray-600">ดีมาก ประทับใจมากค่ะ</p>
          </div>
          <a href="#" className="text-blue-600 mt-2 inline-block">See more (168)</a>
        </div>
      </div>
      </div>
      <Footer />
    </div>
  );
};


export default Project;
