"use client";

import React from "react";
import { Checkmark } from "react-checkmark";
import { useTranslation } from "react-i18next";

const Bill = ({ name, amount, balance, onClose }) => {
  const { t } = useTranslation("translation");

  // ใช้ toLocaleString() เพื่อ format ตัวเลขให้มี , คั่นหลักพัน
  const formatNumber = (num) => {
    return parseFloat(num).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('th-TH', {
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
    });
  };


  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative bg-white rounded-lg shadow-lg p-8 w-[90%] max-w-[400px]">
        <div className="mb-5">
          <Checkmark />
        </div>
        <h2 className="text-xl font-bold mb-5 text-center">{t("nav.wallet.bill.title")}</h2>
        <div className="flex flex-col">
          <div className="flex justify-between odd:bg-[#D9D9D9] even:bg-[#FFF] p-2 ">
            <span className="font-semibold flex-1 text-center">{t("nav.wallet.bill.fullname")}</span>
            <span className="flex-1 text-center">{name}</span>
          </div>
          <div className="flex justify-between border-t border-b border-gray-500 odd:bg-[#D9D9D9] even:bg-[#FFF] p-2">
            <span className="font-semibold flex-1 text-center">
              {t("nav.wallet.bill.date")}
            </span>
            <span className="flex-1 text-center">{formatDate(new Date())}</span>
          </div>
          <div className="flex justify-between odd:bg-[#D9D9D9] even:bg-[#FFF] p-2">
            <span className="font-semibold flex-1 text-center">{t("nav.wallet.withdrawn")}</span>
            <span className="flex-1 text-center">{formatNumber(amount)}</span>
          </div>
          <div className="flex justify-between border-t border-b border-gray-500 odd:bg-[#D9D9D9] even:bg-[#FFF] p-2 ">
            <span className="font-semibold flex-1 text-center">
              {t("nav.wallet.balance")}
            </span>
            <span className="flex-1 text-center">{formatNumber(balance)}</span>
          </div>
          <button
            type="button"
            className="w-full mt-5 flex justify-center rounded-md bg-[#33539B] px-3 py-3 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-slate-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            onClick={onClose}
          >
            <p className="text-[18px]">{t("nav.wallet.bill.success")}</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Bill;
