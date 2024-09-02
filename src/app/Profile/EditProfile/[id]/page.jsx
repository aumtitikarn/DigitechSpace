"use client";

import React, { useState } from "react";
import { IoIosStar } from "react-icons/io";
import { CiHeart } from "react-icons/ci";
import Image from "next/image";
import Link from "next/link";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import Container from "../../../components/Container";
import { useSession } from "next-auth/react";
import { FaLink } from "react-icons/fa";
import Box from "next-auth/providers/box";
import { MdAccountCircle } from "react-icons/md";
import { FaPlus } from "react-icons/fa6";
import { useTranslation } from "react-i18next";

function page() {
  const { data: session, status } = useSession();
  const { t, i18n } = useTranslation("translation");
  if (status === "loading") {
    return <p>Loading...</p>;
  }

  const handleSave = async () => {
    // ส่งข้อมูลที่ได้รับการแก้ไขกลับไปยังเซิร์ฟเวอร์
    const response = await fetch("/api/auth/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
      }),
    });

    if (response.ok) {
      console.log("Profile saved");
      // ทำสิ่งที่ต้องการเมื่อบันทึกข้อมูลสำเร็จ
    } else {
      console.log("Error saving profile");
    }
  };

  return (
    <Container>
      <Navbar />
      <main className="flex flex-col md:flex-row w-full justify-center p-4 my-[50px]">
        <div className="flex flex-col items-center w-full max-w-lg">
          <div className="flex flex-row justify-center">
            <div className="relative">
              <MdAccountCircle
                className="rounded-full text-gray-500"
                style={{ width: "95px", height: "95px", margin: "-10px" }}
              />
              <div
                className="absolute right-0 bottom-0 bg-white rounded-full p-1 border-2 border-black"
                style={{ transform: "translate(25%, 25%)" }}
              >
                <FaPlus size={18} className="text-black" />
              </div>
            </div>
          </div>

          <div className="flex flex-row justify-center">
            <p
              style={{ fontSize: "24px", fontWeight: "bold" }}
              className="mt-6"
            >
              {session?.user?.name}
            </p>
          </div>
          {session?.user?.role == "NormalUser" && (
            <div className="flex flex-col items-center w-full mt-4">
              <div className="flex flex-row items-center w-full mt-4">
                <p>{t("nav.profile.editprofile.name")}</p>
              </div>
              <input
                type="text"
                placeholder={session?.user?.name}
                className="w-full p-2 mb-4 border border-gray-300 rounded"
              />
              <div className="flex flex-row items-center w-full mt-4">
                <p>{t("nav.profile.editprofile.email")}</p>
              </div>
              <input
                type="email"
                placeholder="Enter email"
                className="w-full p-2 mb-4 border border-gray-300 rounded"
              />
              <div className="flex flex-row items-center w-full mt-4">
                <p>{t("nav.profile.editprofile.pnum")}</p>
              </div>
              <input
                type="text"
                placeholder="Enter phone number"
                className="w-full p-2 mb-4 border border-gray-300 rounded"
              />
              <div className="flex flex-row items-center w-full mt-4">
                <p>{t("nav.profile.editprofile.facebook")}</p>
              </div>
              <input
                type="text"
                placeholder="Enter your facebook"
                className="w-full p-2 mb-4 border border-gray-300 rounded"
              />
              <div className="flex flex-row items-center w-full mt-4">
                <p>{t("nav.profile.editprofile.line")}</p>
              </div>
              <input
                type="text"
                placeholder="Enter your ID"
                className="w-full p-2 mb-4 border border-gray-300 rounded"
              />
              <button
                onClick={handleSave}
                className="bg-blue-500 text-white px-4 py-2 rounded w-full hover:bg-blue-600"
                style={{ backgroundColor: "#33539B" }}
              >
                {t("nav.profile.editprofile.save")}
              </button>
            </div>
          )}

          {session?.user?.role !== "NormalUser" && (
            <div className="flex flex-col items-center w-full mt-4">
              <div className="flex flex-row items-center w-full mt-4">
                <p>{t("nav.profile.editprofile.name")}</p>
              </div>
              <input
                type="text"
                placeholder="Enter name"
                className="w-full p-2 mb-4 border border-gray-300 rounded"
              />
              <div className="flex flex-row items-center w-full mt-4">
                <p>{t("nav.profile.editprofile.email")}</p>
              </div>
              <div className="w-full p-2 mb-4 text-zinc-400">
                {session?.user?.email}
              </div>
              <div className="flex flex-row items-center w-full mt-4">
                <p>{t("nav.profile.editprofile.pnum")}</p>
              </div>
              <input
                type="text"
                placeholder="Enter phone number"
                className="w-full p-2 mb-4 border border-gray-300 rounded"
              />
              <div className="flex flex-row items-center w-full mt-4">
                <p>{t("nav.profile.editprofile.facebook")}</p>
              </div>
              <input
                type="text"
                placeholder="Enter your facebook"
                className="w-full p-2 mb-4 border border-gray-300 rounded"
              />
              <div className="flex flex-row items-center w-full mt-4">
                <p>{t("nav.profile.editprofile.line")}</p>
              </div>
              <input
                type="text"
                placeholder="Enter your ID"
                className="w-full p-2 mb-4 border border-gray-300 rounded"
              />
              <button
                onClick={handleSave}
                className="bg-blue-500 text-white px-4 py-2 rounded w-full hover:bg-blue-600"
                style={{ backgroundColor: "#33539B" }}
              >
                {t("nav.profile.editprofile.save")}
              </button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </Container>
  );
}

export default page;
