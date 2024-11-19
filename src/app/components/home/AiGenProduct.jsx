"use client";

import React, { useEffect, useState, useCallback, useMemo } from "react";
import { IoIosStar } from "react-icons/io";
import { MdAccountCircle } from "react-icons/md";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { useSession } from "next-auth/react";
import Image from "next/image";

const ProductList = ({ products, titles }) => {
  const { t } = useTranslation("translation");
  const [failedImages, setFailedImages] = useState([]);

  return (
    <div className="flex flex-col items-center justify-center w-full">
      {titles.map((title, idx) => {
        const processedTitle = title.includes("/")
          ? title.split("/")[0].toLowerCase()
          : title.toLowerCase();
        const filteredProducts = products.filter(
          (product) => product.category.toLowerCase() === processedTitle
        );

        return (
          <div key={idx} className="flex flex-col justify-center w-full mb-3">
            <div className="flex items-center space-x-2 mt-3">
              <p className="font-bold" style={{ fontSize: "24px" }}>
                {t(`nav.project.${processedTitle}`)}
              </p>
            </div>
            <div className="flex overflow-x-auto gap-[30px]">
              {filteredProducts.map((product, index) => (
                <Link
                  key={index}
                  href={`/project/projectdetail/${product._id}`}
                >
                  <div className="w-[190px] h-auto lg:w-[230px] md:w-[210px] rounded-[10px] border border-[#BEBEBE] bg-white p-4 mb-5 mt-5">
                    <div className="flex flex-col">
                      <div className="relative w-full h-[150px] mb-4">
                        <Image
                          src={`/api/project/images/${product.imageUrl[0]}`}
                          alt={product.projectname}
                          fill
                          className="rounded-md object-cover"
                          sizes="(max-width: 768px) 190px, (max-width: 1024px) 210px, 230px"
                          priority={index < 2} // Prioritize loading first two images
                        />
                      </div>
                      <div className="flex flex-col justify-between h-full">
                        <p className="text-lg font-semibold mb-2 truncate">
                          {product.projectname}
                        </p>
                        <div className="flex items-center mb-2">
                          {product.profileImage &&
                          !failedImages?.includes?.(product._id) ? (
                            <Image
                              src={product.profileImage || ""}
                              alt="Author Profile"
                              width={20}
                              height={20}
                              className="rounded-full mr-2 w-[30px] h-[30px] object-cover"
                              onError={() => {
                                setFailedImages((prev) => [
                                  ...prev,
                                  product._id,
                                ]);
                              }}
                            />
                          ) : (
                            <span className="text-gray-500 mr-2 text-2xl">
                              <MdAccountCircle />
                            </span>
                          )}
                          <p className="text-sm text-gray-600 truncate">
                            {product.authorName}
                          </p>
                        </div>
                        <div className="flex items-center mb-2">
                          <span className="text-yellow-500 mr-2">
                            <IoIosStar />
                          </span>
                          <span className="lg:text-sm text-gray-600 text-[12px] truncate">
                            {product.rathing || "N/A"} ({product.review}) |{" "}
                            {t("nav.project.projectdetail.sold")} {product.sold}
                          </span>
                        </div>
                        <p className="text-lg font-bold text-[#33529B]">
                          {product.price} THB
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            <div className="flex-grow text-center">
              <Link
                href={`/project?category=${encodeURIComponent(processedTitle)}`}
              >
                <p className="text-[#33529B] font-bold mt-3 text-[18px] cursor-pointer">
                  {t("nav.home.seemore")} ({filteredProducts.length})
                </p>
              </Link>
            </div>
          </div>
        );
      })}
    </div>
  );
};

const PRODUCT_CATEGORIES = [
  {
    group: "Software Development",
    categories: ["website", "mobileapp", "program"],
  },
  { group: "Data and AI", categories: ["ai", "datasets"] },
  { group: "Hardware and IoT", categories: ["iot", "program"] },
  { group: "Content and Design", categories: ["document", "photo"] },
  {
    group: "3D and Modeling",
    categories: ["model", "photo", "document"],
  },
];

const THAI_TO_ENGLISH_MAP = {
  "โมเดล/3มิติ": "model",
  เว็บไซต์: "website",
  แอพพลิเคชัน: "mobileapp",
  เอกสาร: "document",
  เอไอ: "ai",
  ชุดข้อมูล: "datasets",
  ไอโอที: "iot",
  โปรแกรม: "program",
  รูปภาพ: "photo",
};

const Aigenproject = () => {
  const [titles, setTitles] = useState([]);
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const { data: session, status } = useSession();
  const { t } = useTranslation("translation");

  const normalizeCategory = useCallback((category) => {
    return (
      THAI_TO_ENGLISH_MAP[category.toLowerCase()] || category.toLowerCase()
    );
  }, []);

  const findRelatedCategories = useCallback(
    (title) => {
      const relatedCategories = new Set();
      PRODUCT_CATEGORIES.forEach((group) => {
        if (
          group.categories.some(
            (cat) => normalizeCategory(cat) === normalizeCategory(title)
          )
        ) {
          group.categories.forEach((category) => {
            if (normalizeCategory(category) !== normalizeCategory(title)) {
              relatedCategories.add(category);
            }
          });
        }
      });
      return Array.from(relatedCategories);
    },
    [normalizeCategory]
  ); // Now we only depend on normalizeCategory

  useEffect(() => {
    const fetchData = async () => {
      try {
        const projectsResponse = await fetch("/api/project/getProjects", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!projectsResponse.ok) {
          throw new Error("Failed to fetch projects");
        }

        const projectsData = await projectsResponse.json();
        setProducts(projectsData);

        const categoryCounts = projectsData.reduce((acc, project) => {
          const category = project.category.toLowerCase();
          acc[category] = (acc[category] || 0) + 1;
          return acc;
        }, {});

        let userTitles = [];
        if (status === "authenticated" && session?.user) {
          const interestsResponse = await fetch("/api/ai/interest/get", {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          });

          if (interestsResponse.ok) {
            const userData = await interestsResponse.json();
            if (userData.interests && userData.interests.length > 0) {
              userTitles = Array.isArray(userData.interests)
                ? userData.interests
                : userData.interests
                    .split(",")
                    .map((interest) => interest.trim());
            }
          }
        }

        if (!session || userTitles.length === 0) {
          userTitles = ["website", "mobileapp", "document"];
        }

        const titleSet = new Set();
        userTitles.forEach((title) => {
          const normalizedTitle = normalizeCategory(title);

          if (categoryCounts[normalizedTitle] > 0) {
            titleSet.add(normalizedTitle);

            const relatedCategories = findRelatedCategories(normalizedTitle);
            relatedCategories.forEach((category) => {
              const normalizedCategory = normalizeCategory(category);
              if (categoryCounts[normalizedCategory] > 0) {
                titleSet.add(normalizedCategory);
              }
            });
          }
        });

        setTitles(Array.from(titleSet));
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("An error occurred while fetching data");
      }
    };

    fetchData();
  }, [status, session, findRelatedCategories, normalizeCategory]);

  if (error) {
    return (
      <div>
        {t("error_occurred")}: {error}
      </div>
    );
  }

  return (
    <main className="bg-[#FBFBFB]">
      <div className="p-4">
        <ProductList products={products} titles={titles} />
      </div>
    </main>
  );
};

export default Aigenproject;
