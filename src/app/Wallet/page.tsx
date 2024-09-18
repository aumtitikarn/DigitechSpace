"use client";

import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useSession } from "next-auth/react";
import { MdClose } from "react-icons/md";
import Bill from "./bill"; 
import { useTranslation } from "react-i18next";
import { OrbitProgress } from "react-loading-indicators";
import Swal from "sweetalert2";

interface BillData {
  fullname: string;
  date: string;
  amount: string;
  balance: string;
  email: string;
}

interface GradientCardSummaryProps {
  grossIncome: number;
  withdrawableAmount: number;
  serviceFee: number;
}

const formatAmount = (amount: number): string => {
  return amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

const GradientCardSummary: React.FC<GradientCardSummaryProps> = ({ grossIncome, withdrawableAmount, serviceFee }) => {
  const { t } = useTranslation("translation");

  return (
    <div className="bg-white rounded-lg p-6 text-white shadow-lg px-4 w-full lg:w-[500px] md:w-[450px] h-auto flex-shrink-0 rounded-t-[20px] border border-white bg-[#E3F8FF6B] shadow-[0px_4px_4px_rgba(0,0,0,0.25)] py-5">
      <h2 className="text-2xl font-bold mb-4 text-[#515151]">{t("nav.wallet.income")}</h2>
      <div className="space-y-3">
        <div className="flex justify-between items-center ">
          <span className="font-medium text-[#515151]">{t("nav.wallet.gross")}</span>
          <span className="font-bold text-[#515151]">{formatAmount(grossIncome)} THB</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="font-medium text-[#515151]">{t("nav.wallet.servicefee")}</span>
          <span className="font-bold text-[#515151]">{formatAmount(serviceFee)} THB</span>
        </div>
        <div className="flex justify-between items-center pt-3 border-t border--[#515151]">
          <span className="font-medium text-[#515151]">{t("nav.wallet.withdrawable")}</span>
          <span className="font-bold text-xl text-[#515151]">{formatAmount(withdrawableAmount)} THB</span>
        </div>
      </div>
    </div>
  );
};

const Wallet = () => {
  const { data: session, status } = useSession();
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [isBillVisible, setIsBillVisible] = useState(false);
  const { t } = useTranslation("translation");
  const [grossIncome, setGrossIncome] = useState<number>(0);
  const [withdrawableAmount, setWithdrawableAmount] = useState<number>(0);
  const [serviceFee, setServiceFee] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [billData, setBillData] = useState<BillData | null>(null);

  const formatDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    };
    const thaiDate = date.toLocaleDateString('th-TH', options);
    const [day, month, year] = thaiDate.split(' ');
    return `${day} ${month} ${year}`;
  };
  
  useEffect(() => {
    const fetchAmount = async () => {
      if (status === "authenticated") {
        try {
          const response = await fetch("/api/getAmount");
          if (response.ok) {
            const data = await response.json();
            if (typeof data.amount === "number") {
              const gross = data.amount;
              const fee = gross * 0.3;
              const withdrawable = gross - fee;
              
              setGrossIncome(gross);
              setServiceFee(fee);
              setWithdrawableAmount(withdrawable);
              
              setBillData({
                fullname: data.fullname,
                date: formatDate(new Date()),
                amount: gross.toString(),
                balance: withdrawable.toString(),
                email: session?.user?.email || "",
              });
            } else {
              setGrossIncome(0);
              setServiceFee(0);
              setWithdrawableAmount(0);
            }
          } else {
            throw new Error("Failed to fetch amount");
          }
        } catch (error) {
          console.error("Error fetching amount:", error);
          setError(
            error instanceof Error ? error.message : "An unknown error occurred"
          );
        } finally {
          setIsLoading(false);
        }
      } else if (status === "unauthenticated") {
        setIsLoading(false);
      }
    };

    fetchAmount();
  }, [status, session]);



  const handleWithdraw = async () => {
    const { value: withdrawAmount } = await Swal.fire({
      title: t("nav.wallet.input"),
      input: "text",
      inputLabel: t("nav.wallet.input2"),
      inputPlaceholder: t("nav.wallet.input3"),
    });

    if (withdrawAmount && billData) {
      const withdrawValue = parseFloat(withdrawAmount);
      if (isNaN(withdrawValue)) {
        Swal.fire({
          icon: 'error',
          title: 'Invalid Input',
          text: 'Please enter a valid number.',
        });
        return;
      }
  
      if (withdrawValue > withdrawableAmount) {
        Swal.fire({
          icon: 'error',
          title: 'Insufficient Funds',
          text: 'You do not have enough balance for this withdrawal.',
        });
        return;
      }
  
      const newBalance = withdrawableAmount - withdrawValue;
      setWithdrawableAmount(newBalance);
      setBillData({
        ...billData,
        date: formatDate(new Date()),
        amount: withdrawAmount,
        balance: newBalance.toFixed(2),
      });
      setIsBillVisible(true);
    }
  };

  if (status === "loading" || isLoading) {
    return (
      <div style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        textAlign: "center",
      }}>
        <OrbitProgress variant="track-disc" dense color="#33539B" size="medium" text="" textColor="" />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#FBFBFB]">
      <main className="flex-grow">
        <Navbar  />
        <div className="lg:mx-64 lg:mt-10 lg:mb-10 mt-10 mb-10 mx-5 sm:mx-2">
          <div className="flex items-center justify-center">
            <div className="flex flex-col items-center w-full">
              <div className="px-4 w-full lg:w-[500px] md:w-[450px] h-auto flex-shrink-0 rounded-t-[20px] border border-white bg-[#E3F8FF6B] shadow-[0px_4px_4px_rgba(0,0,0,0.25)] py-5">
                <p className="text-[#0E6FFF] font-bold text-[24px]"> {t("nav.wallet.balance")} </p>
                <p className="mt-5 font-bold text-[20px]">{formatAmount(withdrawableAmount)} THB</p>
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
            <GradientCardSummary 
              grossIncome={grossIncome}
              withdrawableAmount={withdrawableAmount}
              serviceFee={serviceFee}
            />
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
      {isBillVisible && billData && (
        <Bill
          name={billData.fullname}
          amount={billData.amount}
          balance={billData.balance}
          onClose={() => setIsBillVisible(false)}
        />
      )}
    </div>
  );
};

export default Wallet;
