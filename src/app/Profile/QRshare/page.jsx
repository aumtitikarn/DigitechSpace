"use client";

import React, { useState } from "react";
import { IoIosStar } from "react-icons/io";
import { CiHeart } from "react-icons/ci";
import Image from 'next/image'
import Link from 'next/link';
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import Container from "../../components/Container";
import { useSession } from "next-auth/react";
import { FaLink } from "react-icons/fa";
import { useTranslation } from "react-i18next";

function page() {
  const { t, i18n } = useTranslation("translation");

  const handleSubmit = () => {
    alert(`Input 1: ${input1}`);
    setInput1("");

    };

  const { data: session, status } = useSession();
    
  if (status === "loading") {
      return <p>Loading...</p>;
    }
  


  return (
    <Container>
      <Navbar />
      <main className="flex flex-col md:flex-row w-full justify-center p-4">
  <div className="flex flex-col items-center w-full max-w-lg">
    
    <p style={{ fontSize: "24px", fontWeight: "bold" }} className="mt-6 text-center my-10">
      {t("nav.profile.share")}!
    </p>

    <div className="w-64 h-64 relative flex items-center justify-center my-4">
      <img
        src="/Qr.png"
        className="object-cover w-full h-full my-10"
        alt="Blog Image"
      />
    </div>

    <button
      onClick={handleSubmit}
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
