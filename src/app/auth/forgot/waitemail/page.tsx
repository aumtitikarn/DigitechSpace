'use client';
import React from 'react';
import { Mail, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';
import Navbar from "./../../../components/Navbar";
import Footer from "./../../../components/Footer";
import { useSession } from "next-auth/react";
import { OrbitProgress } from "react-loading-indicators";

const CheckEmail = () => {
  const router = useRouter();
  const { t } = useTranslation();
  const { data: session, status } = useSession();

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
    <div>
      <Navbar />
      <div className="bg-[#FBFBFB] flex flex-col items-center justify-center py-20 mx-5 ">
        <div className="border border-blue-400 rounded-lg shadow hover:shadow-lg hover:-translate-y-1 transition-all duration-300 p-10">
          {/* Icon Wrapper - Added flex justify-center */}
          <div className="flex justify-center">
            <div className="bg-blue-100 p-4 rounded-full mb-6">
              <Mail className="w-8 h-8 text-[#33539B]" />
            </div>
          </div>

          {/* Content */}
          <div className="max-w-md text-center space-y-4">
            <h1 className="text-2xl font-bold text-gray-900">
              {t("email.check.title")}
            </h1>
            <p className="text-gray-600">
              {t("email.check.description")}
            </p>
            <p className="text-sm text-gray-500">
              {t("email.check.spam")}
            </p>
          </div>

          {/* Button Wrapper - Added flex justify-center */}
          <div className="flex justify-center">
            <button
              onClick={() => router.push('/auth/signin')}
              className="mt-8 flex items-center gap-2 px-6 py-3 bg-[#33539B] text-white rounded-md hover:bg-[#33539B]/90 transition-colors"
            >
              {t("email.check.signin")}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CheckEmail;