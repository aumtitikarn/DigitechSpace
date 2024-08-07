'use client';

import React from 'react';
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

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
    <div className="flex flex-col min-h-screen">
     <Navbar session={session} />
    
      <Footer />
    </div>
  );
};


export default Project;
