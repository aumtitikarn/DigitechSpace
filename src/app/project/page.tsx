
'use client';

import React from 'react';
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { GoCheck ,GoShare,GoHeartFill } from "react-icons/go";
import Link from "next/link";
import Filter from "./filter"


const Project = () => {
    const { data: session, status } = useSession();

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  if (!session) {
    redirect("/auth/signin");
    return null;
  }
  return (
    <div className="flex flex-col min-h-screen bg-[#FBFBFB]">
    <main className="flex-grow ">
     <Navbar session={session} />
     <div className="lg:mx-64 lg:mt-20 lg:mb-20 mt-10 mb-10 mx-5">
      <Filter/>
      </div>
    </main>
    <Footer />
    </div>
  );
};


export default Project;

