"use client";

import React, { useState } from "react";
import { IoIosStar } from "react-icons/io";
import { CiHeart } from "react-icons/ci";
import Image from 'next/image'
import Link from 'next/link';
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Container from "../components/Container";
import { useSession } from "next-auth/react";
import { FaLink } from "react-icons/fa";
import Box from "next-auth/providers/box";

function page() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  if (!session) {
    redirect("/auth/signin");
    return null;
  }

  const handleSave = () => {
    console.log("Profile saved");
  };

  return (
    <Container>
      <Navbar session={session} />
      <main className="flex flex-col md:flex-row w-full justify-center p-4">
        <div className="flex flex-col items-center w-full max-w-lg">
          
          <div className="flex flex-row justify-center">
            <div className="bg-gray-300 w-40 h-40 rounded-full"></div>
          </div>

          <div className="flex flex-row justify-center">
            <p style={{ fontSize: "24px", fontWeight: "bold" }} className="mt-6">
            {session?.user?.name}
            </p>
          </div>
          {session?.user?.role == "NormalUser" && (
          <div className="flex flex-col items-center w-full mt-4">
            <div className="flex flex-row items-center w-full mt-4">
            <p>Name</p>
            </div>
            <input
              type="text"
              placeholder="Enter name"
              className="w-full p-2 mb-4 border border-gray-300 rounded"
            />
            <div className="flex flex-row items-center w-full mt-4">
            <p>Email</p>
            </div>
            <input
              type="email"
              placeholder="Enter email"
              className="w-full p-2 mb-4 border border-gray-300 rounded"
            />
            <button
              onClick={handleSave}
              className="bg-blue-500 text-white px-4 py-2 rounded w-full hover:bg-blue-600"
              style={{backgroundColor:"#33539B"}}
            >
              Save
            </button>
          </div>
          )}

        {session?.user?.role !== "NormalUser" && (
          <div className="flex flex-col items-center w-full mt-4">
            <div className="flex flex-row items-center w-full mt-4">
            <p>Name</p>
            </div>
            <input
              type="text"
              placeholder="Enter name"
              className="w-full p-2 mb-4 border border-gray-300 rounded"
            />
            <div className="flex flex-row items-center w-full mt-4">
            <p>Email</p>
            </div>
            <div className="w-full p-2 mb-4 border border-gray-300 rounded text-zinc-400">{session?.user?.email}</div>
            <button
              onClick={handleSave}
              className="bg-blue-500 text-white px-4 py-2 rounded w-full hover:bg-blue-600"
              style={{backgroundColor:"#33539B"}}
            >
              Save
            </button>
          </div>
          )}
        </div>
      </main>
      <Footer />
    </Container>
  );
}

export default page;
