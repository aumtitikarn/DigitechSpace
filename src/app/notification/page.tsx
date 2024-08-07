'use client';

import React from 'react';
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Card, CardBody } from '@nextui-org/react';
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import Container from "../components/Container";

const Notification = () => {
    const { data: session, status } = useSession();

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  if (!session) {
    redirect("/auth/signin");
    return null;
  }
  return (
    <Container>
      <Navbar session={session} />
      <main className="flex-grow px-6 py-12 lg:px-8">
        <div className="container mx-auto mt-1">
          <h1 className="text-3xl md:text-4xl font-bold mb-8">Notification</h1>
        </div>
        <Card className="flex flex-col md:flex-row border-10 border-gray-300 rounded-lg shadow-md mb-4 p-10 bg-[#E8F9FD] w-full  h-auto">
          <CardBody className="flex flex-col justify-between">
            <p className="text-base md:text-lg mb-10">โครงงานของคุณได้รับการยืนยันแล้ว</p>
            <p className="text-base md:text-lg mt-auto">12/05/2567</p>
          </CardBody>
        </Card>
        <Card className="flex flex-col md:flex-row border-10 border-gray-300 rounded-lg shadow-md mb-4 p-10 bg-[#E8F9FD] w-full  h-auto">
          <CardBody className="flex flex-col justify-between">
            <p className="text-base md:text-lg mb-10">โครงงานของคุณได้รับการยืนยันแล้ว</p>
            <p className="text-base md:text-lg mt-auto">12/05/2567</p>
          </CardBody>
        </Card>
        <Card className="flex flex-col md:flex-row border-10 border-gray-300 rounded-lg shadow-md mb-4 p-10 bg-[#E8F9FD] w-full h-auto">
          <CardBody className="flex flex-col justify-between">
            <p className="text-base md:text-lg mb-10">โครงงานของคุณได้รับการยืนยันแล้ว</p>
            <p className="text-base md:text-lg mt-auto">12/05/2567</p>
          </CardBody>
        </Card>
      </main>
      <Footer />
    </Container>
  );
};

export default Notification;
