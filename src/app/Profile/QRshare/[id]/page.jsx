"use client";

import React, { useState } from "react";
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

function page() {
    const { t, i18n } = useTranslation("translation");
    const [copySuccess, setCopySuccess] = useState(""); 
  
    const { data: session, status } = useSession();
  
    const handleCopyLink = () => {
      
      const currentURL = window.location.href; 
      
      const userId = currentURL.substring(currentURL.lastIndexOf("/") + 1);
       
      const newLink = `http://localhost:3000/Profile/ViewProfile/${userId}`;
  
      navigator.clipboard.writeText(newLink)
        .then(() => {
          setCopySuccess(t("nav.profile.copied")); 
        })
        .catch(err => {
          setCopySuccess(t("nav.profile.copy_fail")); 
        });
    };
  
    
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
  
  const currentURL = typeof window !== 'undefined' ? window.location.href : '';
  const userId = currentURL.substring(currentURL.lastIndexOf("/") + 1);
  const profileLink = `http://localhost:3000/Profile/ViewProfile/${userId}`;

  return (
    <Container>
      <Navbar />
      <main className="flex flex-col md:flex-row w-full justify-center p-4">
  <div className="flex flex-col items-center w-full max-w-lg">
    
    <p style={{ fontSize: "24px", fontWeight: "bold" }} className="mt-6 text-center my-10">
      {t("nav.profile.share")}!
    </p>


    <div className="w-64 h-64 relative flex items-center justify-center my-4">
      <QRCode value={profileLink} size={256} /> {/* Generate QR code */}
    </div>

    <button
      onClick={handleCopyLink}
      className="text-white px-4 py-2 rounded mx-2 hover:bg-green-600 w-64 flex items-center justify-center my-10"
      style={{backgroundColor:"#33539B"}}
    >
      <FaLink className="mr-2"/>
      {t("nav.profile.copy")}
    </button>
  </div>
</main>
    <Footer />
    </Container>
  );
}

export default page;
