'use client';
import React, { useEffect, useState } from 'react';
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Card, CardBody } from '@nextui-org/react';
import { useSession } from "next-auth/react";
import { OrbitProgress } from "react-loading-indicators";
import { useTranslation } from "react-i18next";

interface NotificationCardProps {
    notificationValue: string;
    updatedAt: string; // เพิ่มการแสดงวันที่
}

const NotificationCard: React.FC<NotificationCardProps> = ({ notificationValue, updatedAt }) => {
    return (
        <Card className="flex flex-col md:flex-row border-2 border-gray-300 rounded-lg shadow-md p-3 bg-[#E8F9FD] w-full">
            <CardBody className="flex flex-col justify-between">
                <p className="text-sm md:text-xs mb-2 md:mb-3 font-bold">{notificationValue}</p>
                <p className="text-xs text-gray-500">{new Date(updatedAt).toLocaleString('th-TH')}</p> 
            </CardBody>
        </Card>
    );
};

const NotificationPage: React.FC = () => {
    const { data: session } = useSession();
    const { t } = useTranslation("translation");
    const [notificationData, setNotificationData] = useState<{ notifications: string[], updatedAt: string }>({
        notifications: [],
        updatedAt: ''
    });
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
                        setNotificationData(data); // Now we are getting both notifications and updatedAt
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
            <Navbar />
            <main className="flex-grow">
                <div className="lg:mx-64 lg:mt-10 lg:mb-10 mt-10 mb-10 mx-5">

                    <h1 className="text-[24px] font-bold">{t("nav.notification")}</h1>
                    {session?.user?.email ? (
                        <div className="flex flex-col lg:items-start space-y-4 mt-5">
                            {notificationData.notifications.length > 0 ? (
                                notificationData.notifications.map((notification, index) => (
                                    <NotificationCard key={index} notificationValue={notification} updatedAt={notificationData.updatedAt} />
                                ))
                            ) : (
                                <p>{t("noNotificationsFound")}</p>
                            )}
                        </div>
                    ) : (
                        <p>You need to log in to see your notifications.</p>
                    )}

                </div>
            </main>
            <Footer />
        </div>
    );
};

export default NotificationPage;

