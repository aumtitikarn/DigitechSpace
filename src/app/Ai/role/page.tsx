"use client";

import Image from "next/image";
import Container from "../../components/Container";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";

export default function Role() {
  const router = useRouter();
  const { t, i18n } = useTranslation("translation");

  const { data: session } = useSession();
  if (!session) redirect("/auth/signin");
  console.log(session);

  // ฟังก์ชันเปลี่ยนเส้นทาง
  const handleButtonClick = () => {
    router.push("/Ai/interest");
  };

  return (
    <main>
      <Container>
        <Navbar session={session} />
        <div className="flex-grow lg:mx-64 lg:mt-10 lg:mb-10 mt-10 mb-10 mx-5">
          <div className="text-center">
            <h3 className="text-3xl">{t("nav.ai.role.title")}</h3>
          </div>
          <div className="">
            <div className="mt-10 grid grid-cols-2 md:grid-cols-2  md:gap-[30px]  lg:grid-cols-4 ">
              {/* สร้างกล่อง 8 กล่อง */}
              <button
                onClick={handleButtonClick}
                className="hover:bg-slate-200 rounded-lg border border-gray-300 bg-white shadow-xl w-[170px] h-[71px] flex-shrink-0 mx-auto mb-5"
              >
                <span className="text-gray-700">{t("nav.ai.role.student")}</span>
              </button>
              <button
                onClick={handleButtonClick}
                className="hover:bg-slate-200 rounded-lg border border-gray-300 bg-white shadow-xl w-[170px] h-[71px] flex-shrink-0 mx-auto mb-5"
              >
                <span className="text-gray-700">{t("nav.ai.role.professor")}</span>
              </button>
              <button
                onClick={handleButtonClick}
                className="hover:bg-slate-200 rounded-lg border border-gray-300 bg-white shadow-xl w-[170px] h-[71px] flex-shrink-0 mx-auto mb-5"
              >
                <span className="text-gray-700">{t("nav.ai.role.developer")}</span>
              </button>
              <button
                onClick={handleButtonClick}
                className="hover:bg-slate-200 rounded-lg border border-gray-300 bg-white shadow-xl w-[170px] h-[71px] flex-shrink-0 mx-auto mb-5"
              >
                <span className="text-gray-700">{t("nav.ai.role.designer")}</span>
              </button>
              <button
                onClick={handleButtonClick}
                className="hover:bg-slate-200 rounded-lg border border-gray-300 bg-white shadow-xl w-[170px] h-[71px] flex-shrink-0 mx-auto mb-5"
              >
                <span className="text-gray-700">{t("nav.ai.role.executive")}</span>
              </button>
              <button
                onClick={handleButtonClick}
                className="hover:bg-slate-200 rounded-lg border border-gray-300 bg-white shadow-xl w-[170px] h-[71px] flex-shrink-0 mx-auto mb-5"
              >
                <span className="text-gray-700">{t("nav.ai.role.teacher")}</span>
              </button>
              <button
                onClick={handleButtonClick}
                className="hover:bg-slate-200 rounded-lg border border-gray-300 bg-white shadow-xl w-[170px] h-[71px] flex-shrink-0 mx-auto mb-5"
              >
                <span className="text-gray-700">{t("nav.ai.role.researcher")}</span>
              </button>
              <button
                onClick={handleButtonClick}
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
  );
}
