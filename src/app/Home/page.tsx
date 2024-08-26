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
import AiGenProduct from '../components/home/AiGenProduct';
import { redirect } from 'next/navigation';
import { useTranslation } from 'react-i18next';

export default function Home() {
  const { data: session } = useSession();
  const { t, i18n } = useTranslation('translation');


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
