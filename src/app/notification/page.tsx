'use client';

import React from 'react';
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Card, CardBody } from '@nextui-org/react';
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useTranslation } from "react-i18next";

const Notification = () => {
    const { data: session, status } = useSession();
    const { t, i18n } = useTranslation("translation");

    if (status === "loading") {
        return <p>Loading...</p>;
    }


    return (
        <div className="flex flex-col min-h-screen bg-[#FBFBFB]">
            <main className="flex-grow">
                <Navbar  />
                <div className="lg:mx-64 lg:mt-10 lg:mb-10 mt-10 mb-10 mx-5">
                    <div className="container mt-3 ">
                        <h1 className="text-[24px] font-bold">{t("nav.notification")}</h1>
                    </div>
                    <div className="flex flex-col lg:items-start space-y-4 mt-5">
                        <Card className="flex flex-col md:flex-row border-10 border-gray-300 rounded-lg shadow-md p-3 bg-[#E8F9FD] w-full ">
                            <CardBody className="flex flex-col justify-between">
                                <p className="text-sm md:text-xs mb-2 md:mb-3 font-bold">โครงงานของคุณได้รับการยืนยันแล้ว</p>
                                <p className="text-sm md:text-xs mt-auto">12/05/2567</p>
                            </CardBody>
                        </Card>
                        <Card className="flex flex-col md:flex-row border-10 border-gray-300 rounded-lg shadow-md p-3 bg-[#E8F9FD] w-full ">
                            <CardBody className="flex flex-col justify-between">
                                <p className="text-sm md:text-xs mb-2 md:mb-3 font-bold">โครงงานของคุณได้รับการยืนยันแล้ว</p>
                                <p className="text-sm md:text-xs mt-auto">12/05/2567</p>
                            </CardBody>
                        </Card>
                        <Card className="flex flex-col md:flex-row border-10 border-gray-300 rounded-lg shadow-md p-3 bg-[#E8F9FD] w-full">
                            <CardBody className="flex flex-col justify-between">
                                <p className="text-sm md:text-xs mb-2 md:mb-3 font-bold">โครงงานของคุณได้รับการยืนยันแล้ว</p>
                                <p className="text-sm md:text-xs mt-auto">12/05/2567</p>
                            </CardBody>
                        </Card>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default Notification;
