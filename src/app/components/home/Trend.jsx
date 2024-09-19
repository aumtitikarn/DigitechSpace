"use client";

import React, { useState } from "react";
import { FaSearch, FaFire } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import { useRouter } from 'next/navigation';

function Trend({ session }) {
  const { t, i18n } = useTranslation("translation");
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/project?search=${encodeURIComponent(searchTerm.trim())}`);
    }
  };
  
  return (
    <main className="flex flex-col items-center justify-center p-4 w-full">
      <div className="flex flex-col justify-center w-full">
        <div className="relative mt-4">
        <form onSubmit={handleSearchSubmit} className="relative">
          <input
            type="text"
            placeholder={t("nav.home.search")}
            className="w-full p-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </form>
        </div>
        <div className="flex items-center space-x-2 mt-10">
          <p className="font-bold" style={{ fontSize: "24px" }}>
            {t("nav.home.trend")}
          </p>
          <FaFire className="text-red-500 text-2xl" />
        </div>
        <div
          className="mt-9 overflow-x-auto   lg:flex-col lg:items-center"
          style={{ scrollbarWidth: "auto", msOverflowStyle: "auto" }}
        >
          <div className="flex space-x-4 lg:flex-start">
            {[
              "เว็บไซต์",
              "แอพขายของ",
              "เว็บโซเชียล",
              "NFT",
              "Blockchain",
              "แอพขายของ",
              "NFT",
              "Blockchain",
              "แอพขายของ",
              "เว็บไซต์",
            ].map((label, index) => (
              <button
                key={index}
                className="w-[112px] h-[35px] flex-shrink-0 rounded-full bg-[#FFC107] text-black font-semibold"
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}

export default Trend;
