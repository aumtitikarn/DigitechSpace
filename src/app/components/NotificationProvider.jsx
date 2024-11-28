"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { usePathname } from 'next/navigation';
import Navbar from './Navbar';
import { OrbitProgress } from "react-loading-indicators";

export default function NotificationProvider({ children }) {
  const { data: session, status } = useSession();
  const [notificationCount, setNotificationCount] = useState(0);
  const pathname = usePathname();

  useEffect(() => {
    const fetchNotificationCount = async () => {
      if (session?.user?.email) {
        try {
          const response = await fetch("/api/notification", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: session.user.email }),
          });
          const data = await response.json();
          const unreadCount = pathname === '/notification' ? 0 : data.notifications.read.filter(status => !status).length;
          setNotificationCount(unreadCount);
        } catch (error) {
          console.error("Error fetching notifications:", error);
        }
      }
    };

    fetchNotificationCount();
  }, [session, pathname]);

  if (status === "loading") {
    return (
      <div style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        textAlign: "center",
      }}>
        <OrbitProgress
          variant="track-disc"
          dense
          color="#33539B"
          size="medium"
          text=""
          textColor=""
        />
      </div>
    );
  }

  return (
    <>
      <Navbar notificationCount={notificationCount} />
      {children}
    </>
  );
}