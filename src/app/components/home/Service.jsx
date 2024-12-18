"use client";

import React, { useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { useTranslation } from 'react-i18next';
import { useRouter } from "next/navigation";
import { redirect } from "next/navigation";
import { useSession } from "next-auth/react";

function Service() {
  const [showtext, setShowtext] = useState(false);
  const [showtext1, setShowtext1] = useState(false);
  const [showtext2, setShowtext2] = useState(false);
  const [showtext3, setShowtext3] = useState(false);
  const { t, i18n } = useTranslation('translation');
  const { data: session, status } = useSession();
  const [input1, setInput1] = useState("");
  const [input2, setInput2] = useState("");

  const [report, setReport] = useState("");
  const [email,setEmail] = useState("");

  const handleClick = () => {
    setShowtext((prevShowMessage) => !prevShowMessage);
  };

  const handleClick1 = () => {
    setShowtext1((prevShowMessage) => !prevShowMessage);
  };

  const handleClick2 = () => {
    setShowtext2((prevShowMessage) => !prevShowMessage);
  };

  const handleClick3 = () => {
    setShowtext3((prevShowMessage) => !prevShowMessage);
  };

  // const handleSubmit = () => {
  //   alert(`Input 1: ${input1}, Input 2: ${input2}`);
  //   setInput1("");
  //   setInput2("");
  // };

  const router = useRouter();
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!session || !session.user) {
        console.error("Session not loaded or user not logged in");
        return;
    }

    try {
        const response = await fetch("/api/postservice", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                report,
                email,
                username: session.user?.name || session.user?.email,  // ดึง username หรือ email จาก session
            }),
        });

        const data = await response.json();
        if (response.ok) {
            console.log("Data sent successfully:", data);
            router.push(`/Home`);  // Redirect ไปที่หน้า Home
        } else {
            console.error("Error sending data:", data.message);
        }
    } catch (error) {
        console.error("Error:", error);
    }
};

  


  return (
    <main className="flex flex-col md:flex-row w-full justify-center p-4">
      <div className="flex flex-col w-full max-w-auto">
        <div className="flex flex-col justify-center">
          <h1 className="text-lg font-bold" style={{fontSize:"24px"}}>{t("nav.home.faq.title")}</h1>
        </div>

        <button
          onClick={handleClick}
          className="flex flex-row justify-between w-full p-4 mt-4 bg-white border border-gray-300 rounded"
        >
          <div className="flex flex-col justify-center w-auto h-10 font-semibold">
            {t("nav.home.faq.q1")}
          </div>
          <div className="flex items-center justify-center w-10 h-10 bg-gray-100 rounded-full">
            {showtext ? <FaChevronUp /> : <FaChevronDown />}
          </div>
        </button>
        {showtext && (
          <div style={{backgroundPosition: "0px 0px", backgroundImage: "linear-gradient(180deg, #FFFFFFFF 0%, #E3F8FF 100%)"}} className=" w-full p-2 mt-4 border border-gray-300 rounded">
           {t("nav.home.faq.a1")}
          </div>
        )}

        <button
          onClick={handleClick1}
          className="flex flex-row justify-between w-full p-4 mt-4 bg-white border border-gray-300 rounded"
        >
          <div className="font-semibold flex flex-col justify-center w-auto h-10">
          {t("nav.home.faq.q2")}
          </div>
          <div className="flex items-center justify-center w-10 h-10 bg-gray-100 rounded-full">
            {showtext1 ? <FaChevronUp /> : <FaChevronDown />}
          </div>
        </button>
        {showtext1 && (
          <div style={{backgroundPosition: "0px 0px", backgroundImage: "linear-gradient(180deg, #FFFFFFFF 0%, #E3F8FF 100%)"}} className="w-full p-2 mt-4 border border-gray-300 rounded">
            {t("nav.home.faq.a2")}
          </div>
        )}

        <button
          onClick={handleClick2}
          className="flex flex-row justify-between w-full p-4 mt-4 bg-white border border-gray-300 rounded"
        >
          <div className="font-semibold flex flex-col justify-center w-auto h-10">
          {t("nav.home.faq.q3")}
          </div>
          <div className="flex items-center justify-center w-10 h-10 bg-gray-100 rounded-full">
            {showtext2 ? <FaChevronUp /> : <FaChevronDown />}
          </div>
        </button>
        {showtext2 && (
          <div style={{backgroundPosition: "0px 0px", backgroundImage: "linear-gradient(180deg, #FFFFFFFF 0%, #E3F8FF 100%)"}} className="w-full p-2 mt-4 border border-gray-300 rounded">
            {t("nav.home.faq.a3")}
          </div>
        )}

        <button
          onClick={handleClick3}
          className="flex flex-row justify-between w-full p-4 mt-4 bg-white border border-gray-300 rounded"
        >
          <div className="font-semibold flex flex-col justify-center w-auto h-10">
          {t("nav.home.faq.q4")}
          </div>
          <div className="flex items-center justify-center w-10 h-10 bg-gray-100 rounded-full">
            {showtext3 ? <FaChevronUp /> : <FaChevronDown />}
          </div>
        </button>
        {showtext3 && (
          <div style={{backgroundPosition: "0px 0px", backgroundImage: "linear-gradient(180deg, #FFFFFFFF 0%, #E3F8FF 100%)"}} className="w-full p-2 mt-4 border border-gray-300 rounded">
            {t("nav.home.faq.a4")}
          </div>
        )}

        <div className="flex flex-col justify-center w-full mt-10">
          <h1 className="text-lg font-bold" style={{fontSize:"24px"}}>{t("nav.home.service.title")}</h1>
          <p className="mt-2 text-lg">
          {t("nav.home.service.des")}
          </p>
          <form onSubmit={handleSubmit}>
      <div className="mt-4">
        <input
          type="text"
          onChange={(e) => setReport(e.target.value)}
          placeholder={t("nav.home.service.problem")}
          className="w-full p-2 mb-2 border border-gray-300 rounded"
          required
        />
        <input
          type="text"
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t("nav.home.service.email")}
          className="w-full p-2 mb-2 border border-gray-300 rounded"
          required
        />
        <button
          className="w-full p-2 text-white rounded mt-3"
          style={{ backgroundColor: "#33539B" }}
        >
          {t("nav.home.service.send")}
        </button>
      </div>
    </form>
        </div>
      </div>
    </main>
  );
}

export default Service;
