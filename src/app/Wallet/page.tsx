"use client";

import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { MdClose } from "react-icons/md";
import Bill from "./bill"; 
import { useTranslation } from "react-i18next";
import { OrbitProgress } from "react-loading-indicators";
const Wallet = () => {
  const { data: session, status } = useSession();
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [isBillVisible, setIsBillVisible] = useState(false);
  const { t, i18n } = useTranslation("translation");

  if (status === "loading") {
    return <div style={{
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      textAlign: "center",
    }}>
    <OrbitProgress variant="track-disc" dense color="#33539B" size="medium" text="" textColor="" />
  </div>;
  }


  const handleWithdraw = () => {
    setIsBillVisible(true);
  };

  const receiptData = {
    name: 'สมชาย ใจดี',
    date: '16 สิงหาคม 2567',
    amount: '5,000',
    balance: '15,000'
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#FBFBFB]">
      <main className="flex-grow">
        <Navbar  />
        <div className="lg:mx-64 lg:mt-10 lg:mb-10 mt-10 mb-10 mx-5 sm:mx-2">
          <div className="flex items-center justify-center">
            <div className="flex flex-col items-center w-full">
              <div className="px-4 w-full lg:w-[500px] md:w-[450px] h-auto flex-shrink-0 rounded-t-[20px] border border-white bg-[#E3F8FF6B] shadow-[0px_4px_4px_rgba(0,0,0,0.25)] py-5">
                <p className="text-[#0E6FFF] font-bold text-[24px]"> {t("nav.wallet.balance")} </p>
                <p className="mt-5 font-bold text-[20px]">0.00 THB</p>
              </div>
              <div
                className="px-4 lg:p-2 lg:px-4 w-full lg:w-[500px] md:w-[450px] lg:h-auto flex-shrink-0 rounded-b-[20px] border border-r-[#F4F4F4] border-b-[#F4F4F4] border-l-[#F4F4F4] bg-[#BFEDFF] flex items-center justify-end cursor-pointer"
                onClick={() => setIsPopupVisible(true)}
              >
                <p className="text-[#0E6FFF] font-bold text-[16px]">
                {t("nav.wallet.fee")}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-10 flex flex-col items-center">
            <button
              type="submit"
              className="w-full md:w-[450px] lg:w-[500px] flex justify-center rounded-md bg-[#33539B] px-3 py-3 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-slate-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              onClick={handleWithdraw}
            >
               <p className="text-[18px]">{t("nav.wallet.withdrawn")}</p>
            </button>
            <p className="mt-4 text-gray-500">
            {t("nav.wallet.des")}
            </p>
          </div>
        </div>
      </main>
      <Footer />

      {/* Popup สำหรับ Service fee */}
      {isPopupVisible && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="relative bg-white rounded-lg shadow-lg p-8 w-[90%] max-w-[400px]">
            <MdClose
              className="absolute top-3 right-3 text-gray-600 cursor-pointer"
              size={24}
              onClick={() => setIsPopupVisible(false)}
            />
            <p className="text-gray-600">
              <b>{t("nav.wallet.service")}</b> {t("nav.wallet.desser")}
            </p>
          </div>
        </div>
      )}

      {/* Popup สำหรับใบเสร็จ */}
      {isBillVisible && (
        <Bill
          data={receiptData}
          onClose={() => setIsBillVisible(false)}
        />
      )}
    </div>
  );
};

export default Wallet;
