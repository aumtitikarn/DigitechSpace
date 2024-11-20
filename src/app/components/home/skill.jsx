"use client";

import React, { useState, useEffect } from "react";
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
  const [error, setError] = useState(null);
  const [showAll, setShowAll] = useState(false);

  const fetchPopularSkills = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch("/api/skills?mode=skills");
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch skills");
      }

      if (data.success && Array.isArray(data.skills)) {
        setSkills(data.skills);
      } else {
        console.error("Unexpected data format:", data);
        setError("Invalid data format received");
      }
    } catch (error) {
      console.error("Error fetching skills:", error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUsersBySkillsOrName = async () => {
    if (selectedSkills.length === 0 && !searchTerm) {
      setUsers([]);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      let url = "/api/skills?mode=users";

      // Add skills parameter if there are selected skills
      if (selectedSkills.length > 0) {
        const skillsParam = selectedSkills.join(",");
        url += `&skills=${encodeURIComponent(skillsParam)}`;
      }

      // Add name parameter if there is a search term
      if (searchTerm) {
        url += `&name=${encodeURIComponent(searchTerm)}`;
      }

      const response = await fetch(url);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch users");
      }

      if (data.success && Array.isArray(data.users)) {
        setUsers(data.users);
      } else {
        setError("Invalid user data format received");
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

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

  useEffect(() => {
    fetchPopularSkills();
  }, []);

  useEffect(() => {
    fetchUsersBySkillsOrName();
  }, [selectedSkills, searchTerm]);

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
          ) : error ? (
            <div className="w-full text-center text-red-500">{error}</div>
          ) : skills.length > 0 ? (
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
              No skills available
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

{/* แก้ไขส่วนการแสดงผล Users */}
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
                    <div className="relative w-[64px] h-[64px]">
                      {/* Border สีเหลือง */}
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

                      {/* รูปโปรไฟล์ */}
                      {user.imageUrl && !failedImages.includes(user._id) ? (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Image
                            src={`/api/editprofile/images/${user.imageUrl}`}
                            alt={user.name || "Profile"}
                            width={54}
                            height={54}
                            className="rounded-full object-cover "
                            onError={() => {
                              setFailedImages((prev) => [...prev, user._id]);
                            }}
                          />
                        </div>
                      ) : (
                        <MdAccountCircle className="w-[64px] h-[64px] text-gray-400" />
                      )}
                    </div>

                          {/* แถบเปอร์เซ็นต์ */}
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
                        <div>
                          <h3 className="font-medium text-gray-900 font-extrabold">
                            {user.name}
                          </h3>
                          <div className="flex flex-wrap items-center gap-2 mt-1">
                            <span className="text-sm text-gray-600">
                            {t("nav.skill.title")} :
                            </span>
                            {user.matchedSkills
                              ?.slice(0, 5)
                              .map((skill, index) => (
                                <span
                                  key={index}
                                  className="px-3 py-1 bg-blue-500 text-white text-sm rounded-full"
                                >
                                  {skill}
                                </span>
                              ))}
                            {user.matchedSkills?.length > 5 && (
                              <span className="text-sm text-gray-500">
                                +{user.matchedSkills.length - 5}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>
                ))
              ) : (
                <div className="w-full text-center py-4 text-gray-500">
                  ไม่พบผู้ใช้ที่มีทักษะที่เลือก
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
                  ดูเพิ่มเติม ({users.length - 10})
                </button>
              )}
            </div>
          )}
      </div>
    </div>
  );
};

export default PopularSkills;
