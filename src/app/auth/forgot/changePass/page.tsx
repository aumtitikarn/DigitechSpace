"use client";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { OrbitProgress } from "react-loading-indicators";
import Navbar from "./../../../components/Navbar";
import Footer from "./../../../components/Footer";
import { useTranslation } from "react-i18next";
import Swal from "sweetalert2";

export default function changePass() {
  const { data: session, status } = useSession();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { t, i18n } = useTranslation("translation");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [token, setToken] = useState("");
  const [message, setMessage] = useState("");
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const tokenParam = searchParams.get("token");
    if (tokenParam) setToken(tokenParam);
  }, [searchParams]);

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

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!passwordRegex.test(password)) {
      Swal.fire({
        icon: "error",
        text: t("authen.signup.status.pass"),
      });
      return;
    }
    if (password !== confirmPassword) {
      Swal.fire({
        icon: "error",
        title: t("authen.signup.status.passmatch"),
      });
      return;
    }

   
  console.log('Sending reset request with token:', token);

  try {
    const response = await fetch('/api/forgot/resetpassword', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token, password }),
    });

    const data = await response.json();
    console.log('Reset password response:', data);

    if (response.ok) {
      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Password changed successfully',
      }).then(() => {
        router.push('/auth/signin');
      });
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: data.message || 'An error occurred',
      });
    }
  } catch (error) {
    console.error('Error in reset password request:', error);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'An error occurred',
    });
  }
};
  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleConfirmPasswordVisibility = () =>
    setShowConfirmPassword(!showConfirmPassword);

  return (
    <div className="flex flex-col h-screen">
      <Navbar />
      <main className="flex-grow flex items-center justify-center bg-[#FBFBFB] px-6">
        <div className="w-full max-w-sm">
          <div className="text-center">
            <img
              className="mx-auto h-24 w-auto"
              src="https://m1r.ai/7ttM.png"
              alt="Digitech Space"
            />
            <h2
              style={{ color: "#33539B", fontSize: "29px" }}
              className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight"
            >
              {t("authen.forgot.titlech")}
            </h2>
          </div>

          <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <div className="mt-3">
                  <div className="relative mt-3">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      placeholder={t("authen.forgot.pass1")}
                      onChange={(e) => setPassword(e.target.value)}
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
                  <div className="relative mt-3">
                    <input
                      id="confirmpassword"
                      name="confirmpassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder={t("authen.forgot.pass2")}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      className="block w-full px-3 py-2 bg-white border border-slate-300 shadow-sm placeholder-slate-400 rounded-md sm:text-sm mt-3 focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1"
                    />
                    <button
                      type="button"
                      onClick={toggleConfirmPasswordVisibility}
                      className="absolute inset-y-0 right-0 flex items-center pr-3"
                    >
                      <Image
                        width={20}
                        height={20}
                        src={showConfirmPassword ? "/hide.png" : "/hide.png"}
                        alt="Toggle visibility"
                      />
                    </button>
                  </div>
                </div>
              </div>
              <div>
                <button
                  type="submit"
                  className="flex w-full justify-center rounded-md bg-[#33539B] px-3 py-3 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-slate-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  {t("authen.forgot.conti")}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
