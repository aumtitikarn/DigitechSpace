"use client";

import React, { useState, useEffect, useCallback } from "react";
import { FaSearch } from "react-icons/fa";
import { MdAccountCircle } from "react-icons/md";
import { IoClose } from "react-icons/io5";
import { useTranslation } from "react-i18next";
import debounce from "lodash/debounce";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
const proxyUrl = (url) => `/api/proxy?url=${encodeURIComponent(url)}`;

const isValidHttpUrl = (string) => {
  try {
    const url = new URL(string);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
};
const PopularSkills = () => {
  const { t } = useTranslation("translation");
  const { data: session, status } = useSession();
  const [skills, setSkills] = useState([]);
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [failedImages, setFailedImages] = useState([]);
  const [showAll, setShowAll] = useState(false);

  const fetchPopularSkills = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/skills?mode=skills");
      const data = await response.json();
      
      if (data.success && Array.isArray(data.skills)) {
        setSkills(data.skills);
      }
    } catch (error) {
      console.error("Error fetching skills:", error);
    } finally {
      setIsLoading(false);
    }
  }, []); // ไม่มี dependencies เพราะไม่ได้ใช้ state ใดๆ ในฟังก์ชัน
  
  const fetchUsersBySkillsOrName = useCallback(async () => {
    if (selectedSkills.length === 0 && !searchTerm) {
      setUsers([]);
      return;
    }
  
    try {
      setIsLoading(true);
      let url = "/api/skills?mode=users";
      if (selectedSkills.length > 0) {
        const skillsParam = selectedSkills.join(",");
        url += `&skills=${encodeURIComponent(skillsParam)}`;
      }
      if (searchTerm) {
        url += `&name=${encodeURIComponent(searchTerm)}`;
      }
  
      const response = await fetch(url);
      const data = await response.json();
  
      if (data.success && Array.isArray(data.users)) {
        setUsers(data.users);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setIsLoading(false);
    }
  }, [selectedSkills, searchTerm]);
  
  useEffect(() => {
    fetchPopularSkills();
  }, [fetchPopularSkills]);
  
  useEffect(() => {
    fetchUsersBySkillsOrName();
  }, [fetchUsersBySkillsOrName]);

  const removeSkill = (skillToRemove) => {
    setSelectedSkills(
      selectedSkills.filter((skill) => skill !== skillToRemove)
    );
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && searchTerm) {
      const isDuplicate = selectedSkills.some(
        (skill) => skill.toLowerCase() === searchTerm.toLowerCase()
      );

      if (
        !isDuplicate &&
        skills.some((skill) => skill.toLowerCase() === searchTerm.toLowerCase())
      ) {
        setSelectedSkills([...selectedSkills, searchTerm]);
        setSearchTerm("");
      }
      e.preventDefault();
    }
  };

  const handleSkillClick = (skill) => {
    const isDuplicate = selectedSkills.some(
      (existingSkill) => existingSkill.toLowerCase() === skill.toLowerCase()
    );

    if (!isDuplicate) {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  const debouncedSearch = debounce((term) => {
    setSearchTerm(term);
  }, 300);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    debouncedSearch(value);
  };



  const getDisplayedUsers = () => {
    if (typeof window !== "undefined" && window.innerWidth <= 768 && !showAll) {
      return users.slice(0, 30);
    }
    return users;
  };

  // Rest of the component remains exactly the same...
  if (selectedSkills.length === 0 && !searchTerm) {
    return (
      <div className="p-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">{t("nav.skill.popskill")}</h2>
          <div className="relative">
            <input
              type="text"
              defaultValue={searchTerm}
              onChange={handleSearchChange}
              onKeyDown={handleKeyDown}
              placeholder={t("nav.skill.search")}
              className="w-full p-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            />
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
        </div>

        <p className="text-sm text-gray-600 mb-[30px]">
          {t("nav.skill.popskilldes")}
        </p>

        <div className="flex flex-wrap gap-2">
          {isLoading ? (
            <div className="w-full text-center text-gray-500">
              Loading skills...
            </div>
          )  : skills.length > 0 ? (
            skills.map((skill, index) => (
              <button
                key={index}
                className="px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
                onClick={() => handleSkillClick(skill)}
              >
                {skill}
              </button>
            ))
          ) : (
            <div className="w-full text-center text-gray-500">
              {t("nav.skill.noskill")}
            </div>
          )}
        </div>
      </div>
    );
  }
  const handleRedirect = (e) => {
    if (!session) {
      e.preventDefault(); // Prevent the link from navigating
      router.push("/auth/signin"); // Redirect to signin if no session
    }
  };
  // const getImageSource = (user) => {
  //   if (user?.imageUrl?.[0]) {
  //     const imageUrl = user.imageUrl[0];
  //     return isValidHttpUrl(imageUrl)
  //       ? proxyUrl(imageUrl)
  //       : `/api/editprofile/images/${imageUrl}`;
  //   }
  //   if (user?.imageUrl) {
  //     return `/api/editprofile/images/${user.imageUrl}`;
  //   }
  //   if (user?.image) {
  //     return proxyUrl(user.image);
  //   }
  //   return null;
  // };

  // const imageSource = getImageSource();
  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">{t("nav.skill.popskill")}</h2>
        <div className="relative">
          <input
            type="text"
            defaultValue={searchTerm}
            onChange={handleSearchChange}
            onKeyDown={handleKeyDown}
            placeholder={t("nav.skill.search")}
            className="w-full p-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
          />
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {selectedSkills.map((skill, index) => (
          <div
            key={index}
            className="flex items-center gap-1 px-3 py-1 bg-blue-500 text-white rounded-full"
          >
            {skill}
            <button
              onClick={() => removeSkill(skill)}
              className="hover:text-blue-200"
            >
              <IoClose />
            </button>
          </div>
        ))}
      </div>

      <div className="mb-4 flex justify-between items-center">
        <p className="text-[16px]">{t("nav.skill.properties")} ({users.length})</p>
        <div className="flex items-center gap-4">
          <button
            onClick={() => {
              setSelectedSkills([]);
              setSearchTerm("");
            }}
            className="text-[16px] text-gray-500 hover:text-gray-700"
          >
            {t("nav.skill.clear")}
          </button>
        </div>
      </div>

      <div className="flex flex-col">
  <div className="relative flex-grow">
    <div className="md:overflow-x-auto md:whitespace-nowrap scrollbar-none">
      <div className="flex flex-col md:flex-row gap-4 md:w-max">
        {isLoading ? (
          <div className="w-full text-center py-4">Loading...</div>
        ) : getDisplayedUsers().length > 0 ? (
          getDisplayedUsers().map((user) => (
            <div
              key={user._id}
              className="bg-[#E6ECFF] rounded-lg p-4 md:min-w-[300px] flex-shrink-0"
            >
              <Link
                href={`/Profile/ViewProfile/${user._id || "#"}`}
                onClick={handleRedirect}
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    {/* Profile image section - unchanged */}
                    <div className="relative w-[64px] h-[64px]">
                      <div className="absolute inset-0">
                        <svg viewBox="0 0 100 100" className="w-[64px] h-[64px]">
                          <circle
                            cx="50"
                            cy="50"
                            r="47"
                            fill="none"
                            stroke="#FFE495"
                            strokeWidth="6"
                          />
                        </svg>
                      </div>

                      {user.imageUrl && !failedImages.includes(user._id) ? (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Image
                            src={`/api/editprofile/images/${user.imageUrl}`}
                            alt={user.name || "Profile"}
                            width={54}
                            height={54}
                            className="rounded-full object-cover"
                            onError={() => {
                              setFailedImages((prev) => [...prev, user._id]);
                            }}
                          />
                        </div>
                      ) : (
                        <MdAccountCircle className="w-[64px] h-[64px] text-gray-400" />
                      )}
                    </div>

                    {/* Match percentage indicator */}
                    <div
                      className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 bg-[#FFE495] rounded-full w-10 h-5 flex items-center justify-center"
                      style={{
                        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                      }}
                    >
                      <p className="text-[#4D4D4D] text-xs font-medium">
                        {user.matchPercentage}%
                      </p>
                    </div>
                  </div>

                  {/* User info and skills section */}
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 font-extrabold">
                      {user.name}
                    </h3>
                    {/* Skills section */}
                    <div className="mt-2">
                      <p className="text-sm text-gray-600 mb-1">
                        {t("nav.skill.title")}:
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {/* Show matched skills first */}
                        {user.matchedSkills && user.matchedSkills.length > 0 ? (
                          user.matchedSkills.slice(0, 3).map((skill, index) => (
                            <span
                              key={`matched-${index}`}
                              className="px-2 py-1 bg-blue-500 text-white text-xs rounded-full"
                            >
                              {skill}
                            </span>
                          ))
                        ) : user.skills && user.skills.length > 0 ? (
                          // If no matched skills, show all skills
                          user.skills.slice(0, 3).map((skill, index) => (
                            <span
                              key={`skill-${index}`}
                              className="px-2 py-1 bg-blue-500 text-white text-xs rounded-full"
                            >
                              {skill}
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-gray-500">
                            {t("nav.skill.noskill")}
                          </span>
                        )}
                        
                        {/* Show remaining skills count */}
                        {user.skills && user.skills.length > 3 && (
                          <span className="text-xs text-gray-500 mt-1">
                            +{user.skills.length - 3}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))
        ) : (
          <div className="w-full text-center py-4 text-gray-500">
            {t("nav.skill.nouser")}
          </div>
        )}
      </div>
    </div>
  </div>


        {typeof window !== "undefined" &&
          window.innerWidth <= 768 &&
          users.length > 0 && (
            <div className="mt-6 flex flex-col items-center gap-4 pt-4">
              {!showAll && users.length > 10 && (
                <button
                  onClick={() => setShowAll(true)}
                  className="px-6 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
                >
                  {t("nav.home.seemore")} ({users.length - 10})
                </button>
              )}
            </div>
          )}
      </div>
    </div>
  );
};

export default PopularSkills;
