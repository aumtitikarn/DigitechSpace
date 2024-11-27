"use client";

import React, { useState, useEffect } from "react";
import { FaSearch, FaFire } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Swal from "sweetalert2";

function Trend({ session }) {
  const { t, i18n } = useTranslation("translation");
  const [searchTerm, setSearchTerm] = useState("");
  const [popularSearches, setPopularSearches] = useState([]);
  const router = useRouter();

  useEffect(() => {
    fetchPopularSearches();
  }, []);

  const fetchPopularSearches = async () => {
    try {
      const response = await fetch("/api/search/get");
      if (response.ok) {
        const data = await response.json();
        setPopularSearches(data);
      }
    } catch (error) {
      console.error("Error fetching popular searches:", error);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchSubmit = async (e) => {
    Swal.fire({
      icon: "info",
      title: "Processing...",
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/project?search=${encodeURIComponent(searchTerm.trim())}`);
      setTimeout(() => {
        Swal.close();
      }, 1000);

      try {
        await fetch("/api/search/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ searchTerm: searchTerm.trim() }),
        });
        fetchPopularSearches(); // Refresh popular searches
      } catch (error) {
        console.error("Error saving search:", error);
      }
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
          {popularSearches.length > 0 ? (
            popularSearches.map((search, index) => (
              <Link
                key={index}
                href={`/project?search=${search.term}`}
              >
                <button className="w-[112px] h-[35px] flex-shrink-0 rounded-full border-solid border-3 border-[#FFC107] hover:bg-[#FFC107] text-black font-semibold">
                  {search.term}
                </button>
              </Link>
            ))
          ) : (
            <div className="col-span-full flex justify-center items-center">
              <p className="mt-2 text-gray-500 text-sm lg:text-base whitespace-nowrap">
                {t("nav.project.notrend")}
              </p>
            </div>
          )}
          </div>
        </div>
      </div>
    </main>
  );
}

export default Trend;
