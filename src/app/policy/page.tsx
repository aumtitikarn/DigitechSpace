"use client";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useTranslation } from "react-i18next";
import { OrbitProgress } from "react-loading-indicators";
import parse from "html-react-parser";

interface PolicyData {
  type: string;
  policy: string;
}

const PolicyPage = () => {
  const { data: session, status } = useSession();
  const { t, i18n } = useTranslation("translation");
  const [policy, setPolicy] = useState({ thai: "", english: "" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPolicy = async () => {
      try {
        const response = await fetch("/api/policy");
        const data: PolicyData[] = await response.json();
        setPolicy({
          thai:
            data.find((p: PolicyData) => p.type === "privacy-policy-thai")
              ?.policy || "",
          english:
            data.find((p: PolicyData) => p.type === "privacy-policy-english")
              ?.policy || "",
        });
        setLoading(false);
      } catch (error) {
        console.error("Error fetching policy:", error);
        setLoading(false);
      }
    };

    fetchPolicy();
  }, []);

  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === "th" ? "en" : "th");
  };

  if (status === "loading" || loading) {
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

  return (
    <main className="bg-[#FBFBFB]">
      <Navbar />
      <div className="lg:mx-20 mx-5 mt-10 mb-10">
        <div className="policy-content">
          <div className="rounded-[10px] border border-[#BEBEBE] bg-white p-4 shadow-2xl">
            <p className="text-[16px]">
              {parse(i18n.language === "th" ? policy.thai : policy.english)}
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
};

export default PolicyPage;
