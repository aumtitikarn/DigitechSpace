"use client";

import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

const Wallet = () => {
  const { data: session, status } = useSession();

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
          <div className="flex items-center justify-center">
            <div className="flex flex-col items-center">
              <div className="lg:p-10 lg:w-[854px] lg:h-[257px] flex-shrink-0 rounded-t-[20px] border border-white bg-[#E3F8FF6B] shadow-[0px_4px_4px_rgba(0,0,0,0.25)] px-40 py-5">
                <p className="text-[#0E6FFF] font-bold text-[29px]"> Balance </p>
                <p className="mt-10 font-bold text-[25px]">0.00 ฿</p>
              </div>
              <div className="lg:p-2 lg:px-4 lg:w-[854px] lg:h-[56px] flex-shrink-0 rounded-b-[20px] border border-r-[#F4F4F4] border-b-[#F4F4F4] border-l-[#F4F4F4] bg-[#BFEDFF] px-[200px] py-5 flex items-center justify-end">
                <p className="text-[#0E6FFF] font-bold text-[16px]">Service fee 20%</p>
              </div>
            </div>
          </div>
          <div className="mt-10 flex flex-col items-center">
            <button
              type="submit"
              className="w-[854px] flex justify-center rounded-md bg-[#33539B] px-3 py-3 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-slate-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Withdraw
            </button>
            <p className="mt-4 text-gray-500 text-center">
              * We will transfer money to you via seller information within 1-3 days.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Wallet;
