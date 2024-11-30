"use client";

import React from "react";
import {
  IoDocumentTextOutline,
  IoTerminalOutline
} from "react-icons/io5";
import {
  MdWeb,
  MdOutlineAppShortcut,
  MdOutlinePhotoFilter,
} from "react-icons/md";
import { BsBox } from "react-icons/bs";
import { GoDependabot } from "react-icons/go";
import { AiOutlineDatabase } from "react-icons/ai";
import { HiOutlineComputerDesktop } from "react-icons/hi2";
import { RiMenuSearchLine } from "react-icons/ri";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { useRouter, useSearchParams } from "next/navigation";

function Category() {
  const { t } = useTranslation("translation");
  const router = useRouter();
  const searchParams = useSearchParams();

  const buttonsData = [
    { type: t("nav.project.document"), server: "Document", icon: <IoDocumentTextOutline size={24} /> },
    { type: t("nav.project.model"), server: "Model", icon: <BsBox size={24} /> },
    { type: t("nav.project.website"), server: "Website", icon: <MdWeb size={24} /> },
    { type: t("nav.project.mobileapp"), server: "MobileApp", icon: <MdOutlineAppShortcut size={24} /> },
    { type: t("nav.project.ai"), server: "Ai", icon: <GoDependabot size={24} /> },
    { type: t("nav.project.datasets"), server: "Datasets", icon: <AiOutlineDatabase size={24} /> },
    { type: t("nav.project.iot"), server: "IOT", icon: <IoTerminalOutline size={24} /> },
    { type: t("nav.project.program"), server: "Program", icon: <HiOutlineComputerDesktop size={24} /> },
    { type: t("nav.project.photo"), server: "Photo", icon: <MdOutlinePhotoFilter size={24} /> },
    { type: t("nav.project.other"), server: "Other", icon: <RiMenuSearchLine size={24} /> },
  ];

  const handleCategoryClick = (category) => {
    // Preserve existing search parameters
    const currentParams = new URLSearchParams(searchParams.toString());
    currentParams.set('category', category);
    
    router.push(`/project?${currentParams.toString()}`);
  };

  return (
    <main className="flex flex-col items-center justify-center px-4 w-full">
      <div className="flex flex-col justify-center w-full">
        <div className="flex items-center space-x-2 mt-3">
          <p className="font-bold text-2xl">
            {t("nav.project.catagory")}
          </p>
        </div>
        <div className="mt-5">
          <div className="grid gap-4 grid-cols-3 lg:grid-cols-4 xl:grid-cols-8">
            {buttonsData.map((button, index) => (
              <button
                key={index}
                onClick={() => handleCategoryClick(button.server)}
                className="w-full h-20 flex flex-col items-center justify-center rounded-lg text-black p-2 hover:bg-gray-100 transition-colors"
              >
                {button.icon}
                <span className="mt-2 text-sm">{button.type}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}

export default Category;