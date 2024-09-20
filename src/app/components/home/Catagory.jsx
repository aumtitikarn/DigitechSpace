"use client";

import React from "react";
import { FaSearch, FaFire } from "react-icons/fa";
import { IoDocumentTextOutline, IoTerminalOutline } from "react-icons/io5";
import { BsBox } from "react-icons/bs";
import {
  MdWeb,
  MdOutlineAppShortcut,
  MdOutlinePhotoFilter,
} from "react-icons/md";
import Link from "next/link";
import { GoDependabot } from "react-icons/go";
import { AiOutlineDatabase } from "react-icons/ai";
import { HiOutlineComputerDesktop } from "react-icons/hi2";
import { RiMenuSearchLine } from "react-icons/ri";
import { useTranslation } from "react-i18next";

function Catagory() {
  const { t } = useTranslation("translation");

  const buttonsData = [
    { type: t("nav.project.document"), server: "document", icon: <IoDocumentTextOutline size={24} /> },
    { type: t("nav.project.model"), server: "model", icon: <BsBox size={24} /> },
    { type: t("nav.project.website"), server: "website", icon: <MdWeb size={24} /> },
    { type: t("nav.project.mobileapp"), server: "mobileapp", icon: <MdOutlineAppShortcut size={24} /> },
    { type: t("nav.project.ai"), server: "ai", icon: <GoDependabot size={24} /> },
    { type: t("nav.project.datasets"), server: "datasets", icon: <AiOutlineDatabase size={24} /> },
    { type: t("nav.project.iot"), server: "iot", icon: <IoTerminalOutline size={24} /> },
    { type: t("nav.project.program"), server: "program", icon: <HiOutlineComputerDesktop size={24} /> },
    { type: t("nav.project.photo"), server: "photo", icon: <MdOutlinePhotoFilter size={24} /> },
    { type: t("nav.project.other"), server: "other", icon: <RiMenuSearchLine size={24} /> },
  ];



  return (
    <main className="flex flex-col items-center justify-center px-4 w-full">
      <div className="flex flex-col justify-center w-full">
        <div className="flex items-center space-x-2 mt-3">
          <p className="font-bold" style={{ fontSize: "24px" }}>
            {t("nav.project.catagory")}
          </p>
        </div>
        <div className="mt-[20px]">
          <div className="grid gap-4 grid-cols-3 lg:grid-cols-4 xl:grid-cols-10">
            {buttonsData.map((button, index) => (
              <Link
              href={`/project?category=${button.server}`}
            >
              <button
                key={index}
                className="w-full h-[80px] flex flex-col items-center justify-center rounded-lg text-black p-2"
              >
                {button.icon}
                <span className="mt-2">{button.type}</span>
              </button>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}

export default Catagory;
