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
            <main className="flex-grow  lg:mx-40 lg:mt-10 lg:mb-20 mt-10 mb-1">
                <div className="container mx-auto mt-3  lg:ml-10 ">
                    <h1 className="text-3xl md:text-4xl font-bold mb-8 lg:ml-10 ml-8">Notification</h1>
                </div>
                <div className="flex flex-col items-center lg:items-start space-y-4 lg:ml-20 ">
                    <Card className="flex flex-col md:flex-row border-10 border-gray-300 rounded-lg shadow-md p-3 bg-[#E8F9FD] w-full max-w-[90%] lg:max-w-[950px]">
                        <CardBody className="flex flex-col justify-between">
                            <p className="text-sm md:text-xs mb-2 md:mb-3 font-bold">โครงงานของคุณได้รับการยืนยันแล้ว</p>
                            <p className="text-sm md:text-xs mt-auto">12/05/2567</p>
                        </CardBody>
                    </Card>
                    <Card className="flex flex-col md:flex-row border-10 border-gray-300 rounded-lg shadow-md p-3 bg-[#E8F9FD] w-full max-w-[90%] lg:max-w-[950px]">
                        <CardBody className="flex flex-col justify-between">
                            <p className="text-sm md:text-xs mb-2 md:mb-3 font-bold">โครงงานของคุณได้รับการยืนยันแล้ว</p>
                            <p className="text-sm md:text-xs mt-auto">12/05/2567</p>
                        </CardBody>
                    </Card>
                    <Card className="flex flex-col md:flex-row border-10 border-gray-300 rounded-lg shadow-md p-3 bg-[#E8F9FD] w-full max-w-[90%] lg:max-w-[950px]">
                        <CardBody className="flex flex-col justify-between">
                            <p className="text-sm md:text-xs mb-2 md:mb-3 font-bold">โครงงานของคุณได้รับการยืนยันแล้ว</p>
                            <p className="text-sm md:text-xs mt-auto">12/05/2567</p>
                        </CardBody>
                    </Card>
                </div>
            </main>
            <Footer />
        </Container>
    );
};

export default Notification;
