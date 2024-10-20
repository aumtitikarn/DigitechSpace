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

  return (
    <div>
     <Home/>
    </div>
  );
}
