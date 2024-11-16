'use client';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Link from "next/link";
import { useTranslation } from "react-i18next";
import Navbar from "./../../components/Navbar";
import Footer from "./../../components/Footer";
import { OrbitProgress } from "react-loading-indicators";
import { useSession } from "next-auth/react";

export default function PreAuth() {
  const router = useRouter();
  const { t, i18n } = useTranslation("translation");
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
    <div className='bg-[#FBFBFB]'>
      <Navbar />
      <div className="flex min-h-screen flex-col justify-center lg:mx-[500px] mx-10 my-[120px]">
        <div className="mx-auto w-full max-w-sm">
          <div className="relative w-[244px] h-[116px] mx-auto mb-20">
          <Image
              className="mx-auto h-24 w-auto"
              src="https://m1r.ai/7ttM.png"
              alt="Digitech Space"
              width={96}
              height={96}
              priority
              unoptimized 
            />
          </div>
        </div>

        <div className="my-6">
          <button
            type="button" 
            onClick={() => router.push('/auth/signin')}
            className="flex w-full justify-center rounded-md bg-[#33539B] px-3 py-3 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-slate-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            {t("authen.signin.title")}
          </button>
        </div>

        <div className="flex items-center my-3">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="mx-4 text-gray-500">or</span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>

        <div className="my-6">
          <button
            type="button" 
            onClick={() => router.push('/auth/signup')}
            className="flex w-full justify-center rounded-md bg-[#33539B] px-3 py-3 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-slate-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            {t("authen.signup.creat")}
          </button>
        </div>

        <div className="my-6">
          <button
            type="button"
            className="my-6 text-black flex w-full justify-center items-center rounded-full border-2 border-gray-400 bg-[#FFFFFF] px-3 py-3 text-sm font-semibold leading-6 text-black shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            <Image
              src="/google.png"
              alt="Google"
              width={24}
              height={24}
              className="flex-shrink-0 mr-4"
            />
            {t("authen.con1")}
          </button>

          <button
            type="button"
            className="my-6 text-black flex w-full justify-center items-center rounded-full border-2 border-gray-400 bg-[#FFFFFF] px-3 py-3 text-sm font-semibold leading-6 text-black shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            <Image
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Facebook_Logo_%282019%29.png/600px-Facebook_Logo_%282019%29.png"
              alt="Facebook"
              width={24}
              height={24}
              className="flex-shrink-0 mr-4"
              priority
              unoptimized 
            />
            {t("authen.con2")}
          </button>

          <button
            type="button"
            className="my-6 text-black flex w-full justify-center items-center rounded-full border-2 border-gray-400 bg-[#FFFFFF] px-3 py-3 text-sm font-semibold leading-6 text-black shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            <Image
              src="/github.png"
              alt="Github"
              width={24}
              height={24}
              className="flex-shrink-0 mr-4"
            />
            {t("authen.con3")}
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
}