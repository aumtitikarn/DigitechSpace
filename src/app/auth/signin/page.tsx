"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn, signOut, useSession } from "next-auth/react";
import { useTranslation } from "react-i18next";
import Navbar from "./../../components/Navbar";
import Footer from "./../../components/Footer";
import { OrbitProgress } from "react-loading-indicators";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const { data: session, status } = useSession();
  const { t, i18n } = useTranslation("translation");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      if (status === "authenticated") {
        try {
          const sessionResponse = await fetch("/api/auth/session");
          const sessionData = await sessionResponse.json();
          console.log("interests : ", sessionData.user?.interests);

          if (sessionData.user?.roleaii) {
            if (sessionData.user?.interests) {
              router.replace("/");
            } else {
              router.replace("/Ai/interest");
            }
          } else {
            router.replace("/Ai/role");
          }
        } catch (error) {
          console.error("Error checking session:", error);
          setError("An error occurred while checking your session.");
        }
      }
    };

    checkSession();
  }, [status, router]);

  if (status === "loading") {
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const lowercaseEmail = email.toLowerCase();
    try {
      const res = await signIn("credentials", {
        lowercaseEmail,
        password,
        redirect: false,
      });

      if (res?.error) {
        setError(t("authen.signin.invalid"));
        return;
      }
      const sessionResponse = await fetch("/api/auth/session");
      const sessionData = await sessionResponse.json();
      console.log("interests : ", sessionData.user?.interests);
      if (sessionData.user?.roleaii) {
        if (sessionData.user?.interests) {
          router.replace("/");
        } else {
          router.replace("/Ai/interest");
        }
      } else {
        router.replace("/Ai/role");
      }
    } catch (error) {
      console.log(error);
      setError(t("authen.signin.error"));
    }
  };
  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  return (
    <div>
      <div
        style={{ backgroundColor: "#FBFBFB", height: "100vh" }}
        className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8"
      >
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <div className="relative mx-auto h-24 w-auto">
            <Image
              src="https://m1r.ai/7ttM.png"
              alt="Digitech Space"
              fill
              className="object-contain"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              priority
              unoptimized 
            />
          </div>
          <h2
            style={{ color: "#33539B", fontSize: "29px" }}
            className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight"
          >
            {t("authen.signin.title")}
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form
            className="space-y-6"
            action="#"
            method="POST"
            onSubmit={handleSubmit}
          >
            <div>
            {error && <p className="text-red-500">{error}</p>}
              <div className="mt-3">
                <input
                  id="email"
                  name="email"
                  type="email"
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  placeholder={t("authen.signin.email")}
                  required
                  className="block w-full px-3 py-2 bg-white border border-slate-300 shadow-sm placeholder-slate-400 rounded-md sm:text-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1"
                />
                <div className="relative mt-3">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  placeholder={t("authen.signin.password")}
                  required
                  className="block w-full px-3 py-2 bg-white border border-slate-300 shadow-sm placeholder-slate-400 rounded-md sm:text-sm mt-3 focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1"
                />
                <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute inset-y-0 right-0 flex items-center pr-3"
            >
              <Image
                width={20}
                height={20}
                src={showPassword ? "/hide.png" : "/hide.png"}
                alt="Toggle visibility"
              />
            </button>
            </div>
                <div className="text-sm mt-3">
                  <Link
                    href="/auth/forgot"
                    style={{ color: "#33539B" }}
                    className="font-semibold text-indigo-600 hover:text-indigo-500"
                  >
                    {t("authen.signin.forgot")}
                  </Link>
                </div>
              </div>
            </div>
            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-[#33539B] px-3 py-3 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-slate-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                {t("authen.signin.title")}
              </button>
              
            </div>
          </form>
          <div className="flex items-center my-3">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="mx-4 text-gray-500">{t("authen.or")}</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>
          <div className="flex flex-row space-x-4">
            <button
              className="flex-1 flex items-center justify-center rounded-lg border-2 border-sky-600 px-4 py-2"
              onClick={() => signIn("google")}
            >
              <div className="relative w-5 h-5 mr-4 ml-5">
                <Image
                  src="/google.png"
                  alt="Google"
                  fill
                  className="object-contain"
                  sizes="20px"
                />
              </div>
            </button>
            <button
              className="flex-1 flex items-center justify-center rounded-lg border-2 border-sky-600 px-4 py-2"
              onClick={() => signIn("facebook")}
            >
              <div className="relative w-6 h-6 mr-4 ml-5">
                <Image
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Facebook_Logo_%282019%29.png/600px-Facebook_Logo_%282019%29.png"
                  alt="Facebook"
                  fill
                  className="object-contain"
                  sizes="24px"
                  priority
                  unoptimized 
                />
              </div>
            </button>
            <button
              className="flex-1 flex items-center justify-center rounded-lg border-2 border-sky-600 px-4 py-2"
              onClick={() => signIn("github")}
            >
              <div className="relative w-6 h-6 mr-4 ml-5">
                <Image
                  src="/github.png"
                  alt="Github"
                  fill
                  className="object-contain"
                  sizes="24px"
                />
              </div>
            </button>
          </div>
          <div>
            <p className="text-center mt-20">
              {t("authen.p1")}
              <u>
                <b>
                  {" "}
                  <Link href="/policy" className="hover:text-gray-500">
                    {t("authen.p2")}
                  </Link>
                </b>
              </u>
              {t("authen.p3")}
              <u>
                <b>
                  <Link href="/policy" className="hover:text-gray-500">
                    {t("authen.p4")}
                  </Link>
                </b>
              </u>
              {t("authen.p5")}
              <u>
                <b>
                  <Link href="/policy" className="hover:text-gray-500">
                    {t("authen.p6")}
                  </Link>
                </b>
              </u>
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}