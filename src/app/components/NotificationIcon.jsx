import React from "react";
import Link from "next/link";
import { IoIosNotifications } from "react-icons/io";

const NotificationIcon = ({ notificationCount = 0 }) => {
  const iconStyles = {
    fontSize: "32px",
  };

  return (
    <div className="relative">
      <Link href="/notification">
        <div className="relative group">
          <div className="mx-1" />
          <IoIosNotifications
            style={iconStyles}
            className="text-white hover:text-[#b2b0d4] hover:shadow-xl hover:scale-105"
          />
          {notificationCount > 0 && (
            <span
              className="absolute -top-1 -right-1 bg-red-500 text-white text-xs 
           font-bold rounded-full h-5 w-5 flex items-center justify-center 
           animate-pulse z-50"
            >
              {notificationCount > 99 ? "99+" : notificationCount}
            </span>
          )}
        </div>
      </Link>
    </div>
  );
};

export default NotificationIcon;
