"use client";

import React from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { Card, CardBody } from "@nextui-org/react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import Link from 'next/link'

const Notification = () => {
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
          <div className="container mt-3 ">
            <h1 className="text-[24px] font-bold">Seller Information</h1>
          </div>
          <div className="mt-3">
            <input
              id="fullname"
              name="fullname"
              type="text"
              autoComplete="fullname"
              placeholder="Full Name (Enter the title)"
              required
              className="block w-full px-3 py-2 bg-white border border-slate-300 shadow-sm placeholder-slate-400 rounded-md sm:text-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1"
            />
            <input
              id="phonenumber"
              name="phonenumber"
              type="text"
              autoComplete="phonenumber"
              placeholder="Phone number"
              required
              className="mt-3 block w-full px-3 py-2 bg-white border border-slate-300 shadow-sm placeholder-slate-400 rounded-md sm:text-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1"
            />
            <input
              id="nationalid"
              name="nationalid"
              type="text"
              autoComplete="nationalid"
              placeholder="NationalID"
              required
              className="mt-3 block w-full px-3 py-2 bg-white border border-slate-300 shadow-sm placeholder-slate-400 rounded-md sm:text-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1"
            />
            <input
              id="namebank"
              name="namebank"
              type="text"
              autoComplete="namebank"
              placeholder="Bank used to receive income"
              required
              className="mt-3 block w-full px-3 py-2 bg-white border border-slate-300 shadow-sm placeholder-slate-400 rounded-md sm:text-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1"
            />
            <input
              id="numberbankacc"
              name="numberbankacc"
              type="text"
              autoComplete="numberbankacc"
              placeholder="Bank account number (numbers only)"
              required
              className="mt-3 mb-10 block w-full px-3 py-2 bg-white border border-slate-300 shadow-sm placeholder-slate-400 rounded-md sm:text-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1"
            />
          </div>
          <div className="border-t border-gray-300 mb-5"></div>
          <div className="container mt-3 ">
            <h1 className="text-[24px] font-bold">Address</h1>
          </div>
          <div className="mt-3">
            <input
             id="housenum"
              name="housenum"
              type="text"
              autoComplete="housenum"
              placeholder="House number, street, alley/alley, village"
              required
              className="block w-full px-3 py-2 bg-white border border-slate-300 shadow-sm placeholder-slate-400 rounded-md sm:text-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1"
            />
            <input
              id="subdistrict"
              name="subdistrict"
              type="text"
              autoComplete="subdistrict"
              placeholder="Subdistrict"
              required
              className="mt-3 block w-full px-3 py-2 bg-white border border-slate-300 shadow-sm placeholder-slate-400 rounded-md sm:text-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1"
            />
            <input
              id="district"
              name="district"
              type="text"
              autoComplete="district"
              placeholder="District"
              required
              className="mt-3 block w-full px-3 py-2 bg-white border border-slate-300 shadow-sm placeholder-slate-400 rounded-md sm:text-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1"
            />
            <input
              id="province"
              name="province"
              type="text"
              autoComplete="province"
              placeholder="Province"
              required
              className="mt-3 block w-full px-3 py-2 bg-white border border-slate-300 shadow-sm placeholder-slate-400 rounded-md sm:text-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1"
            />
            <input
              id="postalnumber"
              name="postalnumber"
              type="text"
              autoComplete="postalnumber"
              placeholder="Postal number"
              required
              className="mt-3 block w-full px-3 py-2 bg-white border border-slate-300 shadow-sm placeholder-slate-400 rounded-md sm:text-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1"
            />
          </div>
          <div>
            <Link href="/Sell">
          <button
                type="submit"
                className="mt-3 flex w-full justify-center rounded-md bg-[#33539B] px-3 py-3 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-slate-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Save
              </button>
              </Link>
            </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Notification;
