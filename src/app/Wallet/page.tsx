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

const formatAmount = (amount: number | undefined | null): string => {
  if (typeof amount !== "number" || isNaN(amount)) {
    return "0.00";
  }
  return amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

const GradientCardSummary: React.FC<GradientCardSummaryProps> = ({
  grossIncome,
  withdrawableAmount,
  serviceFee,
}) => {
  const { t } = useTranslation("translation");

  return (
    <div className="bg-white rounded-lg p-6 text-white shadow-lg px-4 w-full  h-auto flex-shrink-0 rounded-t-[20px] border border-white bg-[#E3F8FF6B] shadow-[0px_4px_4px_rgba(0,0,0,0.25)] py-5">
      <h2 className="text-2xl font-bold mb-4 text-[#515151]">
        {t("nav.wallet.income")}
      </h2>
      <div className="space-y-3">
        <div className="flex justify-between items-center ">
          <span className="font-medium text-[#515151]">
            {t("nav.wallet.gross")}
          </span>
          <span className="font-bold text-[#515151]">
            {formatAmount(grossIncome)} THB
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="font-medium text-[#515151]">
            {t("nav.wallet.servicefee")}
          </span>
          <span className="font-bold text-[#515151]">
            {formatAmount(serviceFee)} THB
          </span>
        </div>
        <div className="flex justify-between items-center pt-3 border-t border--[#515151]">
          <span className="font-medium text-[#515151]">
            {t("nav.wallet.withdrawable")}
          </span>
          <span className="font-bold text-xl text-[#515151]">
            {formatAmount(withdrawableAmount)} THB
          </span>
        </div>
      </div>
    </div>
  );
};
interface Purchase {
  date: string;
  projectName: string;
  price: number;
  fee: number;
  netAmount: number;
}

const Wallet = () => {
  const { data: session, status } = useSession();
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [isBillVisible, setIsBillVisible] = useState(false);
  const { t } = useTranslation("translation");
  const [grossIncome, setGrossIncome] = useState<number>(0);
  const [withdrawableAmount, setWithdrawableAmount] = useState<number>(0);
  const [serviceFee, setServiceFee] = useState<number>(0);
  const [net, setNet] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [billData, setBillData] = useState<BillData | null>(null);
  const [purchaseHistory, setPurchaseHistory] = useState<Purchase[]>([]);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("th-TH", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  useEffect(() => {
    fetchAmount();
    fetchPurchaseHistory(); // New function to fetch purchase history
  }, [status, session]);

  const fetchPurchaseHistory = async () => {
    if (status === "authenticated") {
      try {
        const response = await fetch("/api/getPurchaseHistory");
        if (response.ok) {
          const data: Purchase[] = await response.json();
          setPurchaseHistory(data);
        } else {
          throw new Error("Failed to fetch purchase history");
        }
      } catch (error) {
        console.error("Error fetching purchase history:", error);
      }
    }
  };

  const fetchAmount = async () => {
    if (status === "authenticated") {
      try {
        const response = await fetch("/api/getAmount");
        if (response.ok) {
          const data = await response.json();
          if (
            typeof data.amount === "number" &&
            typeof data.withdrawable === "number"
          ) {
            setGrossIncome(data.amount);
            setServiceFee(data.servicefee);
            setWithdrawableAmount(data.withdrawable);

            setBillData({
              fullname: data.fullname,
              date: formatDate(new Date()),
              amount: data.amount.toString(),
              balance: data.withdrawable.toString(),
              email: session?.user?.email || "",
            });
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

  const handleWithdraw = async () => {
    if (withdrawableAmount <= 0) {
      Swal.fire({
        icon: "error",
        title: "No Funds Available",
        text: "You don't have any funds available for withdrawal.",
      });
      return;
    }

    try {
      const response = await fetch("/api/withdrawal", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: session?.user?.id,
          amount: withdrawableAmount,
          fullname: billData?.fullname || "",
          date: formatDate(new Date()),
          servicefee: serviceFee,
          email: session?.user?.email || "",
          balance: withdrawableAmount.toString(),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Withdrawal failed");
      }

      const result = await response.json();

      // อัปเดตสถานะโดยใช้ข้อมูลที่ได้รับจาก server
      setGrossIncome(result.updatedAmount);
      setWithdrawableAmount(result.updatedWithdrawable);
      setServiceFee(result.updatedServiceFee);
      setNet(result.updatedNet);

      if (billData) {
        setBillData({
          ...billData,
          date: formatDate(new Date()),
          amount: withdrawableAmount.toFixed(2),
          balance: "0.00",
        });
      }

      // แสดง Swal alert เมื่อถอนสำเร็จ
      Swal.fire({
        icon: "success",
        title: "Withdrawal Successful",
        text: `You have successfully withdrawn ${formatAmount(withdrawableAmount)} THB.`,
      });

      // เรียกใช้ fetchAmount เพื่ออัปเดตข้อมูลทั้งหมดใหม่
      await fetchAmount();
    } catch (error) {
      console.error("Withdrawal error:", error);
      let errorMessage =
        "There was an error processing your withdrawal. Please try again later.";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      Swal.fire({
        icon: "error",
        title: "Withdrawal Failed",
        text: errorMessage,
      });
    }
  };

  if (status === "loading" || isLoading) {
    return (
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          textAlign: "center",
        }}
      >
        <OrbitProgress
          variant="track-disc"
          dense
          color="#33539B"
          size="medium"
          text=""
          textColor=""
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#FBFBFB]">
      <Navbar />
      <main className="flex-grow p-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Side */}
          <div className="w-full lg:w-1/2">
            <div className="flex gap-4 mb-6">
              {/* Total Income Box */}
              <div className="flex-1 bg-white rounded-lg p-4 shadow-md">
                <h2 className="text-lg font-bold text-[#515151] mb-2">
                  {t("nav.wallet.gross")}
                </h2>
                <p className="text-2xl font-bold text-[#33539B]">
                  {formatAmount(grossIncome)} THB
                </p>
              </div>
              {/* Withdrawable Amount Box */}
              <div className="flex-1 bg-white rounded-lg p-4 shadow-md">
                <h2 className="text-lg font-bold text-[#515151] mb-2">
                  {t("nav.wallet.withdrawable")}
                </h2>
                <p className="text-2xl font-bold text-[#33539B]">
                  {formatAmount(withdrawableAmount)} THB
                </p>
              </div>
            </div>
            {/* Income Summary */}
            <GradientCardSummary
              grossIncome={grossIncome}
              withdrawableAmount={withdrawableAmount}
              serviceFee={serviceFee}
            />
            {/* Withdraw Button */}
            <button
              className="w-full mt-6 bg-[#33539B] text-white py-3 rounded-md font-semibold text-lg hover:bg-[#264177]"
              onClick={handleWithdraw}
              disabled={withdrawableAmount <= 0}
            >
              {t("nav.wallet.withdrawn")} ({formatAmount(withdrawableAmount)}{" "}
              THB)
            </button>
          </div>

          {/* Right Side - Purchase History Table */}
          <div className="w-full lg:w-1/2 bg-white rounded-lg shadow-md p-4">
            <h2 className="text-xl font-bold text-[#515151] mb-4">
              {t("nav.wallet.purchaseHistory")}
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="p-2 text-left">{t("nav.wallet.date")}</th>
                    <th className="p-2 text-left">
                      {t("nav.wallet.projectName")}
                    </th>
                    <th className="p-2 text-right">{t("nav.wallet.price")}</th>
                    <th className="p-2 text-right">{t("nav.wallet.fee")}</th>
                    <th className="p-2 text-right">
                      {t("nav.wallet.netAmount")}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {purchaseHistory.map((purchase: Purchase, index: number) => (
                    <tr key={index} className="border-b">
                      <td className="p-2">
                        {formatDate(new Date(purchase.date))}
                      </td>
                      <td className="p-2">{purchase.projectName}</td>
                      <td className="p-2 text-right">
                        {formatAmount(purchase.price)} THB
                      </td>
                      <td className="p-2 text-right">
                        {formatAmount(purchase.fee)} THB
                      </td>
                      <td className="p-2 text-right">
                        {formatAmount(purchase.netAmount)} THB
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
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
          amount={billData.amount} // จำนวนเงินที่กรอกในการถอน
          balance={billData.balance} // ยอดคงเหลือใหม่หลังจากหักถอน
          onClose={() => setIsBillVisible(false)}
        />
      )}
    </div>
  );
};

export default Wallet;
