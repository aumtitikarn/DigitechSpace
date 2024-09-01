'use client';
import Image from 'next/image'
import { useSession } from "next-auth/react";
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { OrbitProgress } from "react-loading-indicators";

export default function changePass() {
  const router = useRouter()
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

  
    return (
      <div 
        style={{ backgroundColor: "#FBFBFB", height: '100vh' }}
        className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8"
      >
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img
            className="mx-auto h-24 w-auto"
            src="https://m1r.ai/bdebq.png"
            alt="Digitech Space"
          />
          <h2 
            style={{ color: '#33539B', fontSize: '29px' }}
            className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight"
          >
            Change Password
          </h2>
        </div>
  
        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form className="space-y-6" action="#" method="POST">
            <div>
              <div className="mt-3">
              <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  placeholder="Password"
                  required
                  className="block w-full px-3 py-2 bg-white border border-slate-300 shadow-sm placeholder-slate-400 rounded-md sm:text-sm mt-3 focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1"
                />
                <input
                  id="confirmpassword"
                  name="confirmpassword"
                  type="password"
                  placeholder="Confirm Password"
                  required
                  className="block w-full px-3 py-2 bg-white border border-slate-300 shadow-sm placeholder-slate-400 rounded-md sm:text-sm mt-3 focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1"
                />
              </div>
            </div>
            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-[#33539B] px-3 py-3 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-slate-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Continue
              </button>
            </div>
          </form>
        </div>
      </div>
    );
}
