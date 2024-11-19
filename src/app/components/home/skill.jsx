"use client";
import React from 'react';
import { FaSearch, FaFire } from "react-icons/fa";
import { useTranslation } from "react-i18next";

const PopularSkills = () => {
    const { t, i18n } = useTranslation("translation");
  const skills = [
    'next.js',
    'design thingking',
    'React',
    'Python',
    'google site',
    'Mongodb',
    'Wix',
    'google site'
  ];

  return (
    <div className="p-4 max-w-4xl">
      <div className="flex justify-between items-center ">
        <h2 className="text-xl font-bold">Popular skills</h2>
        <div className="relative">
        <input
              type="text"
              placeholder={t("nav.home.search")}
              className="w-full p-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              value={searchTerm}
              onChange={handleSearchChange}
            />
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
      </div>
      
      <p className="text-sm text-gray-600 mb-[10px]">Popular skills of SUT students</p>
      
      <div className="flex flex-wrap gap-2">
        {skills.map((skill, index) => (
          <button
            key={index}
            className="px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
          >
            {skill}
          </button>
        ))}
      </div>
    </div>
  );
};

export default PopularSkills;