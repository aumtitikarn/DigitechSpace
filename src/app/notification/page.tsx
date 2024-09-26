'use client';

import React, { useEffect, useState } from 'react';
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Card, CardBody } from '@nextui-org/react';
import { useSession } from "next-auth/react";
import { OrbitProgress } from "react-loading-indicators";
import { useTranslation } from "react-i18next";

// กำหนดโครงสร้างของข้อมูล Notification
interface Notification {
    email: string;
    notification: string;
    addedAt: string;
}

const NotificationPage = () => {
    const { data: session, status } = useSession();
    const { t } = useTranslation("translation");
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNotifications = async () => {
            if (session?.user?.email) {
                try {
                    const response = await fetch('/api/notification', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ email: session.user.email }),
                    });

                    const data = await response.json();

                    if (response.ok) {
                        setNotifications(data.notifications || []); // ควรใช้ 'data.notifications' เพื่อดึงการแจ้งเตือน
                    } else {
                        console.error(data.message);
                    }
                } catch (error) {
                    console.error("Error fetching notifications:", error);
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchNotifications();
    }, [session]);

    if (loading) {
        return (
            <div style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                textAlign: "center",
            }}>
                <OrbitProgress variant="track-disc" dense color="#33539B" size="medium" text="" textColor="" />
            </div>
        );
    }
    
    return (
        <div className="flex flex-col min-h-screen bg-[#FBFBFB]">
            <main className="flex-grow">
                <Navbar />
                <div className="lg:mx-64 lg:mt-10 lg:mb-10 mt-10 mb-10 mx-5">
                    <div className="container mt-3">
                        <h1 className="text-[24px] font-bold">{t("nav.notification")}</h1>
                    </div>
                    {notifications.map((notification, index) => (
                    <div className="flex flex-col lg:items-start space-y-4 mt-5">
                        {notification.notifications.map((message, msgIndex) => (
                            <Card key={index} className="flex flex-col md:flex-row border-2 border-gray-300 rounded-lg shadow-md p-3 bg-[#E8F9FD] w-full">
                                <CardBody className="flex flex-col justify-between">
                                    {/* Map through multiple notifications for each user */}
                                    
                                        <div key={msgIndex} className="mb-4">
                                            <p className="text-sm md:text-xs mb-2 md:mb-3 font-bold">{message}</p>
                                            <p className="text-sm md:text-xs mt-auto">
                                                {new Date(notification.addedAt).toLocaleDateString('th-TH', {
                                                    year: 'numeric', month: '2-digit', day: '2-digit'
                                                })}
                                            </p>
                                        </div>
                                    
                                </CardBody>
                            </Card>
                        ))}
                    </div>
                    ))}
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default NotificationPage;
