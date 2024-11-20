"use client";
import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Navbar from '../components/Navbar';
import Container from '../components/Container';
import Footer from '../components/Footer';
import Header from '../components/Header';
import Service from '../components/home/Service';
import Catagory from '../components/home/Catagory';
import Trend from '../components/home/Trend';
import Blog from '../components/home/Blog';
import Skill from '../components/home/skill';
import AiGenProduct from '../components/home/AiGenProduct';
import { redirect } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { OrbitProgress } from "react-loading-indicators";

const useAutoCheck = (session: any) => {
  useEffect(() => {
    const performAutoCheck = async () => {
      if (session?.user?.email) {
        try {
          const response = await fetch('/api/myproject/autocheck', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
          });

          if (!response.ok) {
            throw new Error('Failed to perform auto-check');
          }

          const result = await response.json();
          console.log('Auto-check result:', result);
        } catch (error) {
          console.error('Error performing auto-check:', error);
        }
      }
    };

    performAutoCheck();
  }, [session]);
};


export default function Home() {
  const { data: session, status } = useSession();
  const { t, i18n } = useTranslation('translation');
  useAutoCheck(session);
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
    <main className="bg-[#FBFBFB]">
      <Navbar />
      <Container>
        <div className="lg:mx-60 mt-10 mb-5">
          <div className="mb-10">
            <Header />
          </div>
          <div className="mb-10">
            <Trend session={session} />
          </div>
          <div className="mb-10">
            <Catagory />
          </div>
          <div className="mb-8">
            <Skill />
          </div>
          <AiGenProduct />
          <div className="mb-10">
            <Blog />
          </div>
          <div className="mb-10">
            <Service />
          </div>
        </div>
        <Footer />
      </Container>
    </main>
  );
}
