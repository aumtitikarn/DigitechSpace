"use client";
import React, { useEffect, useState, useCallback } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Card, CardBody, Button } from "@nextui-org/react";
import { useSession } from "next-auth/react";
import { OrbitProgress } from "react-loading-indicators";
import { useTranslation } from "react-i18next";
import { Trash2, Trash } from "lucide-react";
import Swal from "sweetalert2";

interface NotificationData {
  notifications: {
    message: string[];
    times: string[];
  };
  updatedAt: string | null;
}

interface NotificationCardProps {
  message: string;
  timestamp: string;
  onDelete: (index: number) => void;
  index: number;
}

const NotificationCard: React.FC<NotificationCardProps> = ({ 
  message, 
  timestamp, 
  onDelete, 
  index 
}) => {
  return (
    <Card className="flex flex-col md:flex-row border-2 border-gray-300 rounded-lg shadow-md p-3 bg-[#E8F9FD] w-full">
      <CardBody className="flex flex-col justify-between">
        <div className="flex justify-between items-start gap-4">
          <p className="text-[16px] mb-2 md:mb-3 font-bold">{message}</p>
          <button
            onClick={() => onDelete(index)}
            className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-50 transition-colors"
          >
            <Trash2 size={20} />
          </button>
        </div>
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
  const [notificationData, setNotificationData] = useState<NotificationData>({
    notifications: {
      message: [],
      times: []
    },
    updatedAt: null
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNotifications = useCallback(async () => {
    if (session?.user?.email) {
      try {
        setLoading(true);
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
        setError("An error occurred while fetching notifications.");
      } finally {
        setLoading(false);
      }
    }
  }, [session]);
  
  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const handleDeleteSingle = async (index: number) => {
    if (!session?.user?.email) return;

    try {
      const result = await Swal.fire({
        icon: "warning",
        title: t("status.confirmDelete"),
        text: t("status.confirmDeleteSingle"),
        showCancelButton: true,
        confirmButtonText: t("button.confirm"),
        cancelButtonText: t("button.cancel"),
      });

      if (result.isConfirmed) {
        const response = await fetch("/api/notification", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: session.user.email,
            messageIndex: index,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          setNotificationData(data);
          Swal.fire({
            icon: "success",
            title: t("status.success"),
            text: t("status.deleteSuccess"),
            timer: 1500,
            showConfirmButton: false,
          });
        } else {
          throw new Error("Failed to delete notification");
        }
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: t("status.error"),
        text: t("status.errorDelete"),
      });
    }
  };

  const handleDeleteAll = async () => {
    if (!session?.user?.email) return;

    try {
      const result = await Swal.fire({
        icon: "warning",
        title: t("status.confirmDeleteAll"),
        text: t("status.confirmDeleteAllText"),
        showCancelButton: true,
        confirmButtonText: t("button.confirm"),
        cancelButtonText: t("button.cancel"),
      });

      if (result.isConfirmed) {
        const response = await fetch("/api/notification/delete-all", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: session.user.email }),
        });

        if (response.ok) {
          const data = await response.json();
          setNotificationData(data);
          Swal.fire({
            icon: "success",
            title: t("status.success"),
            text: t("status.deleteAllSuccess"),
            timer: 1500,
            showConfirmButton: false,
          });
        } else {
          throw new Error("Failed to delete all notifications");
        }
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: t("status.error"),
        text: t("status.errorDeleteAll"),
      });
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <OrbitProgress variant="track-disc" dense color="#33539B" size="medium" />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#FBFBFB]">
      <Navbar />
      <main className="flex-grow">
        <div className="lg:mx-64 lg:mt-10 lg:mb-10 mt-10 mb-10 mx-5">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">{t("nav.notification")}</h1>
            {notificationData.notifications.message.length > 0 && (
              <Button
                color="danger"
                variant="flat"
                size="sm"
                startContent={<Trash size={18} />}
                onClick={handleDeleteAll}
                className="font-medium"
              >
                {t("button.deleteAll")}
              </Button>
            )}
          </div>

          <div className="flex flex-col lg:items-start space-y-4">
            {error ? (
              <p className="text-red-500">{error}</p>
            ) : notificationData.notifications.message.length > 0 ? (
              notificationData.notifications.message.map((message, index) => (
                <NotificationCard
                  key={index}
                  message={message}
                  timestamp={notificationData.notifications.times[index]}
                  onDelete={handleDeleteSingle}
                  index={index}
                />
              ))
            ) : (
              <p className="text-gray-500">{t("status.nonoti")}</p>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default NotificationPage;