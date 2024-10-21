"use client";
import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Card, CardBody } from "@nextui-org/react";
import { useSession } from "next-auth/react";
import { OrbitProgress } from "react-loading-indicators";
import { useTranslation } from "react-i18next";

interface Notification {
  message: string;
  timestamp: string;
}

interface NotificationData {
  notifications: {
    message: string[];
    times: string[];
  };
  updatedAt: string | null;
}

const NotificationCard: React.FC<Notification> = ({ message, timestamp }) => {
  return (
    <Card className="flex flex-col md:flex-row border-2 border-gray-300 rounded-lg shadow-md p-3 bg-[#E8F9FD] w-full">
      <CardBody className="flex flex-col justify-between">
        <p className="text-[16px]  mb-2 md:mb-3 font-bold">{message}</p>
        <p className="text-xs text-gray-500">
          {new Date(timestamp).toLocaleString("th-TH")}
        </p>
      </CardBody>
    </Card>
  );
};

const NotificationPage: React.FC = () => {
  const { data: session } = useSession();
  const { t } = useTranslation("translation");
  const [notificationData, setNotificationData] =
    useState<NotificationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null); // Add error state

  useEffect(() => {
    const fetchNotifications = async () => {
      if (session?.user?.email) {
        try {
          const response = await fetch("/api/notification", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email: session.user.email }),
          });

          const data = await response.json();
          if (response.ok) {
            setNotificationData(data);
          } else {
            setError(data.message || "Failed to fetch notifications.");
          }
        } catch (error) {
          setError;
        } finally {
          setLoading(false);
        }
      }
    };

    fetchNotifications();
  }, [session]);

  if (loading) {
    return (
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          textAlign: "center",
        }}
      >
        <OrbitProgress
          variant="track-disc"
          dense
          color="#33539B"
          size="medium"
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#FBFBFB]">
      <Navbar />
      <main className="flex-grow">
        <div className="lg:mx-64 lg:mt-10 lg:mb-10 mt-10 mb-10 mx-5">
          <h1 className="text-[24px] font-bold">{t("nav.notification")}</h1>
            <div className="flex flex-col lg:items-start space-y-4 mt-5">
              {error ? (
                <p className="text-red-500">{error}</p>
              ) : notificationData &&
                notificationData.notifications.message.length > 0 &&
                notificationData.notifications.times.length > 0 ? (
                notificationData.notifications.message
                  .map((message, index) => ({
                    message,
                    timestamp: notificationData.notifications.times[index],
                  }))
                  .sort(
                    (a, b) =>
                      new Date(b.timestamp).getTime() -
                      new Date(a.timestamp).getTime()
                  ) // เรียงจากใหม่ไปเก่า
                  .map((notification, index) => (
                    <NotificationCard
                      key={index}
                      message={notification.message}
                      timestamp={notification.timestamp}
                    />
                  ))
              ) : (
                <p>{t("status.nonoti")}</p>
              )}
            </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default NotificationPage;
