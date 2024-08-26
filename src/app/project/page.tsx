
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

  return (
    <div className="flex flex-col min-h-screen bg-[#FBFBFB]">
    <main className="flex-grow ">
     <Navbar  />
     <div className='lg:flex lg:justify-center'>
     <div className="lg:mr-[50px] lg:mt-20 lg:mb-20 mt-10 mb-10 mx-5 mx-30">
      <Filter/>
      </div>
      </div>
    </main>
    <Footer />
    </div>
  );
};


export default Project;

