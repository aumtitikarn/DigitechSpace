"use client";

import React, { useState } from "react";
import { useSession } from "next-auth/react";
import { CiHeart } from "react-icons/ci";
import Navbar from "../components/Navbar";
import { redirect } from "next/navigation";
import Footer from "../components/Footer";
import Container from "../components/Container";
import Link from 'next/link';
import { FaPlus } from "react-icons/fa6";
import { IoIosSearch } from "react-icons/io";
import { MdAccountCircle } from "react-icons/md";
import { Button } from "react-bootstrap";

function page () {
  const [activeButton, setActiveButton] = useState(null);

  const handleClick = (button) => {
    setActiveButton(button === activeButton ? null : button);
  };

  const { data: session, status } = useSession();
    
  if (status === "loading") {
      return <p>Loading...</p>;
    }
  
    if (!session) {
      redirect("/auth/signin");
      return null;
    }
  
    const handleFileUpload = (e) => {
      const file = e.target.files[0];
      if (file) {
        // จัดการไฟล์ที่ถูกอัปโหลด
        console.log('Uploaded file:', file);
      }
    };

  return (
    <Container>
    <Navbar session={session} />
    <main className="flex flex-col items-center w-full">
    <div className="w-full max-w-screen-lg p-4">
    <p className="mt-3" style={{ fontSize: "24px", fontWeight:"bold"}}>Add Blog</p>

    
    <button
  onClick={() => document.getElementById('file-upload').click()}
  className={`flex items-center justify-center w-40 h-40 rounded-md p-2 bg-white flex-grow border-2 ${
    activeButton === "button1" ? "border-b-indigo-700 border-b-4" : ""
  }`}
>
  <div className="flex items-center justify-center w-10 h-10">
    <p>Project</p>
  </div>
  <input
    id="file-upload"
    type="file"
    className="hidden"
    onChange={(e) => handleFileUpload(e)}
  />
</button>



    </div>
    </main>
    <Footer />
  </Container>
  )
}

export default page