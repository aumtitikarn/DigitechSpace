// ./interest
'use client';

import { useState, useEffect } from "react";
import Container from "../../components/Container";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { IoDocumentTextOutline } from "react-icons/io5";
import { BsBox } from "react-icons/bs";
import { MdWeb } from "react-icons/md";
import { MdOutlineAppShortcut } from "react-icons/md";
import { GoDependabot } from "react-icons/go";
import { AiOutlineDatabase } from "react-icons/ai";
import { IoTerminalOutline } from "react-icons/io5";
import { HiOutlineComputerDesktop } from "react-icons/hi2";
import { MdOutlinePhotoFilter } from "react-icons/md";
import { useTranslation } from "react-i18next";
import { OrbitProgress } from "react-loading-indicators";

export default function Interest() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [selected, setSelected] = useState<string[]>([]);
  const { t, i18n } = useTranslation("translation");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [status, router]);
  
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
  const handleButtonClick = (type: string) => {
    setSelected((prevSelected) => {
      if (prevSelected.includes(type)) {
        // Remove from selection if already selected
        return prevSelected.filter(item => item !== type);
      } else if (prevSelected.length < 15) {
        // Add to selection if not already selected and less than 15 selected
        return [...prevSelected, type];
      }
      return prevSelected;
    });
  };

  const handleNextClick = async () => {
    if (selected.length > 0) {
      try {
        const response = await fetch('/api/ai/interest', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            interests: selected,
          }),
        });
        const result = await response.json();
        console.log("API Response:", result);
  
        if (result.message === 'User updated successfully') {
          // รีเฟรชเซสชันหลังการอัปเดต
          await signIn("credentials", { redirect: false });
          router.push(`/`);
        }
      } catch (error) {
        console.error("Error sending data:", error);
      }
    }
  };
  

  return (
    <main>
      <Container>
        <div className="flex-grow lg:mx-64 lg:mt-10 lg:mb-10 mt-10 mb-10 mx-5">
          <h3 className="text-center text-3xl mb-10">
            {t("nav.ai.interest.des")}
          </h3>
          <div className="mt-10 grid grid-cols-2 gap-6 mx-auto max-w-7xl sm:grid-cols-2 lg:grid-cols-4">
            {[
              { type: t("nav.project.document"), icon: <IoDocumentTextOutline size={24} /> },
              { type: t("nav.project.model"), icon: <BsBox size={24} /> },
              { type: t("nav.project.website"), icon: <MdWeb size={24} /> },
              { type: t("nav.project.mobileapp"), icon: <MdOutlineAppShortcut size={24} /> },
              { type: t("nav.project.ai"), icon: <GoDependabot size={24} /> },
              { type: t("nav.project.datasets"), icon: <AiOutlineDatabase size={24} /> },
              { type: t("nav.project.iot"), icon: <IoTerminalOutline size={24} /> },
              { type: t("nav.project.program"), icon: <HiOutlineComputerDesktop size={24} /> },
              { type: t("nav.project.photo"), icon: <MdOutlinePhotoFilter size={24} /> }
            ].map(({ type, icon }) => (
              <button
                key={type}
                className={`hover:bg-slate-200 rounded-lg border bg-white shadow-xl w-[170px] h-[71px] flex flex-row items-center justify-center mx-auto space-x-2 ${
                  selected.includes(type) ? "border-blue-500" : "border-gray-300"
                }`}
                onClick={() => handleButtonClick(type)}
                disabled={selected.length >= 15 && !selected.includes(type)} // Disable if limit is reached
              >
                {icon}
                <span className="text-gray-700">{type}</span>
              </button>
            ))}
          </div>
          <div className="flex justify-center">
            <button
              className="mt-10 lg:px-[100px] lg:py-3 lg:w-auto w-full mx-auto md:px-[100px] md:py-3 md:w-auto rounded-md bg-[#33539B] px-3 py-3 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-slate-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#33539B]"
              onClick={handleNextClick}
              disabled={selected.length === 0}
            >
              Next
            </button>
          </div>
        </div>
        <Footer />
      </Container>
    </main>
  );
}
