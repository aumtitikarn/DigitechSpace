
'use client';

import React from 'react';
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { GoCheck ,GoShare,GoHeartFill } from "react-icons/go";
import Link from "next/link";
import Filter from "./filter"
import { OrbitProgress } from "react-loading-indicators";
import { useRouter } from 'next/router';

type SearchParams = {
  category?: string;
};

type Props = {
  searchParams: SearchParams;
};

const Project = ({ searchParams }: Props) => {
    const { data: session, status } = useSession();
    const category = searchParams.category;

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
    <div className="flex flex-col min-h-screen bg-[#FBFBFB]">
    <main className="flex-grow ">
     <Navbar  />
     <div className=" lg:mt-20 lg:mb-20 mt-10 mb-10 mx-5 lg:mx-20 ">
      <Filter initialCategory={category}/>
      </div>
    </main>
    <Footer />
    </div>
  );
};


export default Project;

