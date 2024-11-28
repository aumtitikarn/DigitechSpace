"use client";

import React, { useState, useEffect } from "react";
import { IoIosStar } from "react-icons/io";
import { CiHeart } from "react-icons/ci";
import Image from 'next/image'
import Link from 'next/link';
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import Container from "../../../components/Container";
import { useSession } from "next-auth/react";
import { FaLink } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import { OrbitProgress } from "react-loading-indicators";
import QRCode from 'react-qr-code';

function Page() {
  const { t, i18n } = useTranslation("translation");
  const [copySuccess, setCopySuccess] = useState("");
  const { data: session, status } = useSession();
  // เก็บ URL ไว้ใน state
  const [profileUrl, setProfileUrl] = useState("");

  // ใช้ useEffect เพื่อสร้าง URL เมื่อ component mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const currentURL = window.location.href;
      const userId = currentURL.substring(currentURL.lastIndexOf("/") + 1);
      const newLink = `http://localhost:3000/Profile/ViewProfile/${userId}`;
      setProfileUrl(newLink);
    }
  }, []); // empty dependency array means this runs once on mount

  const handleCopyLink = () => {
    navigator.clipboard.writeText(profileUrl)
      .then(() => {
        setCopySuccess(t("nav.profile.copy"));
        // เพิ่ม timeout เพื่อเคลียร์ข้อความหลังจาก 2 วินาที
        setTimeout(() => setCopySuccess(""), 2000);
      })
      .catch(err => {
        setCopySuccess(t("nav.profile.copy_fail"));
        setTimeout(() => setCopySuccess(""), 2000);
      });
  };

  if (status === "loading") {
    return (
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
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
    <Container>
      <main className="flex flex-col md:flex-row w-full justify-center p-4 mb-20 mt-10">
        <div className="flex flex-col items-center w-full max-w-lg">
          <p className="text-2xl font-bold mt-6 text-center my-10">
            {t("nav.profile.share")}!
          </p>

          {/* QR Code จะไม่ถูกสร้างใหม่เมื่อ copySuccess เปลี่ยน */}
          <div className="w-64 h-64 relative flex items-center justify-center my-4">
            {profileUrl && <QRCode value={profileUrl} size={256} />}
          </div>

          <div className="flex flex-col items-center gap-2">
            <button
              onClick={handleCopyLink}
              className="text-white px-4 py-2 rounded mx-2 hover:bg-blue-700 w-64 flex items-center justify-center transition-colors"
              style={{ backgroundColor: "#33539B" }}
            >
              <FaLink className="mr-2" />
              {t("nav.profile.copy")}
            </button>
            {copySuccess && (
              <p className="text-green-500 text-sm">{copySuccess}</p>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </Container>
  );
}

export default Page;