'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation'
import { useSession } from "next-auth/react";
import Navbar from "./../../components/Navbar";
import Footer from "./../../components/Footer";
import { OrbitProgress } from "react-loading-indicators";
import { useTranslation } from 'react-i18next';
import Swal from 'sweetalert2';

export default function forgot() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { t, i18n } = useTranslation('translation');

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

  const handleSubmit = async (e:any) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/forgot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        Swal.fire({
          icon: 'success',
          title: t("authen.signup.status.send"),
        });
      } else {
        setError(data.message || 'An error occurred. Please try again.');
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

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
            style={{ color: '#33539B', fontSize: '29px' }}
            className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight"
          >
            {t("authen.forgot.title")}
          </h2>
        </div>
  
        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <div className="mt-3">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder={t("authen.forgot.email")}
                  required
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full px-3 py-2 bg-white border border-slate-300 shadow-sm placeholder-slate-400 rounded-md sm:text-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1"
                />
              </div>
            </div>
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex w-full justify-center rounded-md bg-[#33539B] px-3 py-3 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-slate-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  {t("authen.forgot.send")}
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
