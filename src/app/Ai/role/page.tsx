"use client";

import Container from "../../components/Container";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useTranslation } from "next-i18next";
import { OrbitProgress } from "react-loading-indicators";

export default function Role() {
  const router = useRouter();
  const { t } = useTranslation("translation");
  const { data: session, status } = useSession();

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
  const handleButtonClick = async (roleai: string) => {
    if (session) {
      // Call API to update roleai in database
      const response = await fetch("/api/ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          roleai,
        }),
      });
  
      if (response.ok) {
        const result = await response.json();
        console.log(result.message); // แสดงข้อความสำเร็จหรือข้อผิดพลาด
        router.push("/Ai/interest");
      } else {
        console.error("Failed to update roleai");
      }
    } else {
      signIn();
    }
  };
  
  return (
    <div className="flex flex-col min-h-screen bg-[#FBFBFB] overflow-hidden">
      <Navbar />
    <main>
      <Container>
        <div className="flex-grow lg:mx-64 lg:mt-10 lg:mb-10 mt-10 mb-10 mx-5">
          <div className="text-center">
            <h3 className="text-3xl">{t("nav.ai.role.title")}</h3>
          </div>
          <div className="">
            <div className="mt-10 grid grid-cols-2 md:grid-cols-2  md:gap-[30px]  lg:grid-cols-4 ">
              <button
                onClick={() => handleButtonClick("student")}
                className="hover:bg-slate-200 rounded-lg border border-gray-300 bg-white shadow-xl w-[170px] h-[71px] flex-shrink-0 mx-auto mb-5"
              >
                <span className="text-gray-700">{t("nav.ai.role.student")}</span>
              </button>
              <button
                onClick={() => handleButtonClick("professor")}
                className="hover:bg-slate-200 rounded-lg border border-gray-300 bg-white shadow-xl w-[170px] h-[71px] flex-shrink-0 mx-auto mb-5"
              >
                <span className="text-gray-700">{t("nav.ai.role.professor")}</span>
              </button>
              <button
                onClick={() => handleButtonClick("developer")}
                className="hover:bg-slate-200 rounded-lg border border-gray-300 bg-white shadow-xl w-[170px] h-[71px] flex-shrink-0 mx-auto mb-5"
              >
                <span className="text-gray-700">{t("nav.ai.role.developer")}</span>
              </button>
              <button
                onClick={() => handleButtonClick("designer")}
                className="hover:bg-slate-200 rounded-lg border border-gray-300 bg-white shadow-xl w-[170px] h-[71px] flex-shrink-0 mx-auto mb-5"
              >
                <span className="text-gray-700">{t("nav.ai.role.designer")}</span>
              </button>
              <button
                onClick={() => handleButtonClick("executive")}
                className="hover:bg-slate-200 rounded-lg border border-gray-300 bg-white shadow-xl w-[170px] h-[71px] flex-shrink-0 mx-auto mb-5"
              >
                <span className="text-gray-700">{t("nav.ai.role.executive")}</span>
              </button>
              <button
                onClick={() => handleButtonClick("teacher")}
                className="hover:bg-slate-200 rounded-lg border border-gray-300 bg-white shadow-xl w-[170px] h-[71px] flex-shrink-0 mx-auto mb-5"
              >
                <span className="text-gray-700">{t("nav.ai.role.teacher")}</span>
              </button>
              <button
                onClick={() => handleButtonClick("researcher")}
                className="hover:bg-slate-200 rounded-lg border border-gray-300 bg-white shadow-xl w-[170px] h-[71px] flex-shrink-0 mx-auto mb-5"
              >
                <span className="text-gray-700">{t("nav.ai.role.researcher")}</span>
              </button>
              <button
                onClick={() => handleButtonClick("other")}
                className="hover:bg-slate-200 rounded-lg border border-gray-300 bg-white shadow-xl w-[170px] h-[71px] flex-shrink-0 mx-auto mb-5"
              >
                <span className="text-gray-700">{t("nav.ai.role.other")}</span>
              </button>
            </div>
          </div>
        </div>
        <Footer />
      </Container>
    </main>
    </div>
  );
}
