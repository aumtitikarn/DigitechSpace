'use client';

import React from "react";
import { useRouter } from 'next/navigation'; // Import the redirect function from next/navigation
import Link from "next/link";
import { useSession } from "next-auth/react";
import Home from "./Home/page";
import { OrbitProgress } from "react-loading-indicators";

export default function Page() {
  const { data: session, status } = useSession();
  const router = useRouter(); // Use the useRouter hook to get the router instance

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
    <div>
     <Home/>
    </div>
  );
}
