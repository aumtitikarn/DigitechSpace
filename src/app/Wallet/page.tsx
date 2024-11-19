"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { MdClose } from "react-icons/md";
import { useTranslation } from "react-i18next";
import { OrbitProgress } from "react-loading-indicators";
import Swal from "sweetalert2";
import { IoAlertCircleOutline } from "react-icons/io5";
import { useRouter, useSearchParams } from "next/navigation";
import dynamic from 'next/dynamic';
import { format as dateFnsFormat } from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';

const Navbar = dynamic(() => import("../components/Navbar"), { ssr: false });
const Footer = dynamic(() => import("../components/Footer"), { ssr: false });
const Bill = dynamic(() => import("./bill"), { ssr: false });


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
  const [isPopupVisible, setIsPopupVisible] = useState(false);

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
          <span className="font-medium text-[#515151] ">
            <span className="font-medium text-[#515151]">
              <p className="flex items-center">
                {t("nav.wallet.servicefee")}
                <IoAlertCircleOutline
                  className="inline-block ml-1 mr-1"
                  onClick={() => setIsPopupVisible(true)}
                />
                :
              </p>
            </span>
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
    </div>
  );
};
interface Purchase {
  date: string;
  projectName: string;
  price: number;
  serviceFee: number;
  balance: number;
}

const formatDate = (input: string | Date): string => {
  try {
    const date = input instanceof Date ? input : new Date(input);
    return formatInTimeZone(date, 'Asia/Bangkok', 'dd/MM/yyyy');
  } catch {
    return "Invalid Date";
  }
};

const createDateTimeForAPI = (): string => {
  try {
    const date = new Date();
    return formatInTimeZone(date, 'Asia/Bangkok', 'dd/MM/yyyy HH:mm:ss');
  } catch {
    return formatInTimeZone(new Date(), 'Asia/Bangkok', 'dd/MM/yyyy HH:mm:ss');
  }
};



const Wallet = () => {
  const { data: session, status } = useSession();
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const { t } = useTranslation("translation");
  const [grossIncome, setGrossIncome] = useState<number>(0);
  const [withdrawableAmount, setWithdrawableAmount] = useState<number>(0);
  const [serviceFee, setServiceFee] = useState<number>(0);
  const [net, setNet] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [billData, setBillData] = useState<BillData | null>(null);
  const [purchaseHistory, setPurchaseHistory] = useState<Purchase[]>([]);
  const [withdrawalAmount, setWithdrawalAmount] = useState<string>("0");
  const [showBill, setShowBill] = useState<boolean>(false);
  const [selectedMonth, setSelectedMonth] = useState<string>('All');
  const [selectedYear, setSelectedYear] = useState<string>('All');
  const [isBrowser, setIsBrowser] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsBrowser(true);
  }, []);

  const fetchAmount = React.useCallback(async () => {
    if (status === "authenticated") {
      try {
        const response = await fetch("/api/getAmount");
        if (response.ok) {
          const data = await response.json();
          if (typeof data.amount === "number" && typeof data.withdrawable === "number") {
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
        }
      } catch (error) {
        setError(error instanceof Error ? error.message : "An unknown error occurred");
      } finally {
        setIsLoading(false);
      }
    } else if (status === "unauthenticated") {
      setIsLoading(false);
    }
  }, [status, session?.user?.email]);


  const months = [
    { value: 'All', label: t('months.all') },
    { value: '01', label: t('months.january') },
    { value: '02', label: t('months.february') },
    { value: '03', label: t('months.march') },
    { value: '04', label: t('months.april') },
    { value: '05', label: t('months.may') },
    { value: '06', label: t('months.june') },
    { value: '07', label: t('months.july') },
    { value: '08', label: t('months.august') },
    { value: '09', label: t('months.september') },
    { value: '10', label: t('months.october') },
    { value: '11', label: t('months.november') },
    { value: '12', label: t('months.december') },
  ];

  const currentYear = new Date().getFullYear();
  const years = [t('months.all'), ...Array.from({ length: 5 }, (_, i) => (currentYear - i).toString())];

  const filteredPurchaseHistory = purchaseHistory.filter((purchase) => {
    const purchaseDate = new Date(purchase.date);
    const purchaseMonth = (purchaseDate.getMonth() + 1).toString().padStart(2, '0');
    const purchaseYear = purchaseDate.getFullYear().toString();
  
    const matchMonth = selectedMonth === 'All' || purchaseMonth === selectedMonth;
    const matchYear = selectedYear === 'All' || purchaseYear === selectedYear;
  
    return matchMonth && matchYear;
  });



  const fetchPurchaseHistory = React.useCallback(async () => {
    if (status === "authenticated") {
      try {
        const response = await fetch("/api/withdrawal/getHistory");
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
  }, [status]);



  
  useEffect(() => {
    if (selectedMonth !== 'All' || selectedYear !== 'All') {
      console.log('Filtered history:', filteredPurchaseHistory);
    }
  }, [selectedMonth, selectedYear, filteredPurchaseHistory]);

  useEffect(() => {
    if (status === "authenticated") {
      fetchAmount();
      fetchPurchaseHistory();
    }
  }, [status, fetchAmount, fetchPurchaseHistory]);
  
  const handleWithdraw = async () => {
    if (withdrawableAmount <= 0) {
      Swal.fire({
        icon: "error",
        title: "No Funds Available",
        text: "You don't have any funds available for withdrawal.",
      });
      return;
    }

    const amountToWithdraw = withdrawableAmount;

    const result = await Swal.fire({
      title: t("nav.wallet.confirm"),
      text: `${t("nav.wallet.condes1")} ${formatAmount(amountToWithdraw)} ${t("nav.wallet.condes2")}`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: t("nav.wallet.yes"),
      cancelButtonText: t("nav.wallet.no"),
    });

    if (result.isConfirmed) {
      try {
        const response = await fetch("/api/withdrawal", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: session?.user?.id,
            amount: amountToWithdraw,
            fullname: billData?.fullname || "",
            date: createDateTimeForAPI(),
            servicefee: serviceFee,
            email: session?.user?.email || "",
            balance: "0.00",
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Withdrawal failed");
        }

        const result = await response.json();

        setGrossIncome(result.updatedAmount);
        setWithdrawableAmount(0);
        setServiceFee(result.updatedServiceFee);
        setNet(result.updatedNet);

        // Set the withdrawal amount
        setWithdrawalAmount(amountToWithdraw.toFixed(2));

        // Show the bill
        setShowBill(true);

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
    }
  };
  useEffect(() => {
    if (showBill) {
      setBillData(prevData => ({
        fullname: prevData?.fullname || "",
        date: createDateTimeForAPI(),
        amount: withdrawalAmount,
        balance: "0.00",
        email: session?.user?.email || ""
      }));
    }
  }, [showBill, withdrawalAmount, session?.user?.email]);


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
  // const formatCurrencyShort = (amount: number): string => {
  //   if (amount >= 1000000) {
  //     return (amount / 1000000).toFixed(1) + "m";
  //   } else if (amount >= 1000) {
  //     return (amount / 1000).toFixed(1) + "k";
  //   } else {
  //     return amount.toFixed(0);
  //   }
  // };

  // const formatCurrency = (amount: number, short: boolean = true): string => {
  //   if (short) {
  //     return formatCurrencyShort(amount);
  //   } else {
  //     return amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  //   }
  // };

  return (
    <div className="flex flex-col min-h-screen bg-[#FBFBFB]">
      <Navbar />
      <main className="flex-grow p-6 lg:mx-[90px] lg:my-[90px]">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Side */}
          <div className="w-full lg:w-[950px]">
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
          <div className="w-full lg:w-70 bg-white rounded-lg shadow-md p-4 flex flex-col lg:h-[400px] h-[500px]">
            <div className="flex justify-between mb-4">
              <h2 className="text-xl font-bold text-[#515151]">
                {t("nav.wallet.purchaseHistory")}
              </h2>
              <p className="text-gray-500 text-[14px]">
                {t("nav.wallet.hisdes")}
              </p>
            </div>
            <div className="flex gap-4 mb-4">
              <select
                className="p-2 border rounded"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
              >
                {months.map((month) => (
                  <option key={month.value} value={month.value}>
                    {month.label}
                  </option>
                ))}
              </select>
              <select
                className="p-2 border rounded"
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
              >
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
            <div className="overflow-x-auto flex-grow">
              <div className="h-full overflow-y-auto">
                <table className="w-full">
                  <thead className=" top-0 bg-white">
                    <tr className="bg-gray-100">
                      <th className="p-2 text-left">{t("nav.wallet.date")}</th>
                      <th className="p-2 text-left">{t("nav.wallet.projectName")}</th>
                      <th className="p-2 text-right">{t("nav.wallet.price")}</th>
                      <th className="p-2 text-right">{t("nav.wallet.fee")}</th>
                      <th className="p-2 text-right">{t("nav.wallet.netAmount")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPurchaseHistory.map((purchase: Purchase, index: number) => (
                      <tr key={index} className="border-b">
                        <td className="p-2">{formatDate(purchase.date)}</td>
                        <td className="p-2">{purchase.projectName}</td>
                        <td className="p-2 text-right">{formatAmount(purchase.price)}</td>
                        <td className="p-2 text-right">{formatAmount(purchase.serviceFee)}</td>
                        <td className="p-2 text-right">{formatAmount(purchase.balance)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />

      {/* Popup สำหรับใบเสร็จ */}
      {showBill && billData && (
        <Bill
          name={billData.fullname}
          amount={withdrawalAmount}
          balance={billData.balance}
          onClose={() => setShowBill(false)}
        />
      )}
    </div>
  );
};

export default dynamic(() => Promise.resolve(Wallet), { ssr: false });