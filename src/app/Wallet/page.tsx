"use client";

import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { MdClose } from "react-icons/md";

const Wallet = () => {
  const { data: session, status } = useSession();
  const [isPopupVisible, setIsPopupVisible] = useState(false);

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
    <div className="lg:mx-64 lg:mt-10 lg:mb-10 mt-10 mb-10 mx-5 sm:mx-2">
      <div className="flex items-center justify-center">
        <div className="flex flex-col items-center w-full">
          <div className="px-4 w-full lg:w-[500px] md:w-[450px] h-auto flex-shrink-0 rounded-t-[20px] border border-white bg-[#E3F8FF6B] shadow-[0px_4px_4px_rgba(0,0,0,0.25)] py-5">
            <p className="text-[#0E6FFF] font-bold text-[24px] "> Balance </p>
            <p className="mt-5 font-bold text-[20px]">0.00 ฿</p>
          </div>
          <div
            className="px-4 lg:p-2 lg:px-4 w-full lg:w-[500px] md:w-[450px] lg:h-auto flex-shrink-0 rounded-b-[20px] border border-r-[#F4F4F4] border-b-[#F4F4F4] border-l-[#F4F4F4] bg-[#BFEDFF]  flex items-center justify-end cursor-pointer"
            onClick={() => setIsPopupVisible(true)}
          >
            <p className="text-[#0E6FFF] font-bold text-[16px]">
              Service fee 20%
            </p>
          </div>
        </div>
      </div>

      <div className="mt-10 flex flex-col items-center">
        <button
          type="submit"
          className="w-full md:w-[450px] lg:w-[500px] flex justify-center rounded-md bg-[#33539B] px-3 py-3 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-slate-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Withdraw
        </button>
        <p className="mt-4 text-gray-500">
          * We will transfer money to you via seller information within 1-3 days.
        </p>
      </div>
    </div>
  </main>
  <Footer />


  

      {/* Popup */}
      {isPopupVisible && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="relative bg-white rounded-lg shadow-lg p-8 w-[90%] max-w-[400px]">
            <MdClose
              className="absolute top-3 right-3 text-gray-600 cursor-pointer"
              size={24}
              onClick={() => setIsPopupVisible(false)}
            />
            <p className="text-gray-600">
              <b>Service fee</b> is the collection of system service fees that are deducted
              from the price of the freelancer's work per job sold.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Wallet;
