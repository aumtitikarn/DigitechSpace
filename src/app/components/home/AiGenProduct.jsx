"use client";

import React, { useEffect, useState } from "react";
import { IoIosStar } from "react-icons/io";
import { MdAccountCircle } from "react-icons/md";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { useSession } from "next-auth/react";
import { OrbitProgress } from "react-loading-indicators";

const ProductList = ({ products, titles }) => {
  const { t } = useTranslation("translation");

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
                  <div className="w-[190px] h-auto lg:w-[230px] md:w-[210px] rounded-[10px] border border-[#BEBEBE] bg-white p-4  mb-5 mt-5">
                    <div className=" flex flex-col">
                      <img
                        src={`/api/project/images/${product.imageUrl[0]}`}
                        alt="Project Image"
                        className="w-full h-[150px] rounded-md object-cover mb-4"
                      />
                      <div className="flex flex-col justify-between h-full">
                        <p className="text-lg font-semibold mb-2 truncate">
                          {product.projectname}
                        </p>
                        <div className="flex items-center mb-2">
                          <span className="text-gray-500 mr-2 text-2xl">
                            <MdAccountCircle />
                          </span>
                          <p className="text-sm text-gray-600 truncate">
                            {product.author}
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




const Aigenproject = () => {
  const [titles, setTitles] = useState([]);
  const [products, setProducts] = useState([]);
  const { data: session, status } = useSession();
  const [error, setError] = useState(null);
  const { t } = useTranslation("translation");
  const productCategories = [
    {
      group: "Software Development",
      categories: [t("nav.project.website"), t("nav.project.mobileapp"), t("nav.project.program")],
    },
    { group: "Data and AI", categories: [t("nav.project.ai"), t("nav.project.datasets")] },
    { group: "Hardware and IoT", categories: [t("nav.project.iot"), t("nav.project.program")] },
    { group: "Content and Design", categories: [t("nav.project.document"), t("nav.project.photo")] },
    {
      group: "3D and Modeling",
      categories: [t("nav.project.model"), t("nav.project.photo"), t("nav.project.document")],
    },
  ];
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
        console.log("Fetched projects:", projectsData);

        // Count projects per category (case-insensitive)
        const categoryCounts = projectsData.reduce((acc, project) => {
          const category = project.category.toLowerCase();
          acc[category] = (acc[category] || 0) + 1;
          return acc;
        }, {});
        console.log("Category counts:", categoryCounts);

        let userTitles = [];
        if (status === "authenticated" && session.user) {
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
                : userData.interests.split(",");
            }
          }
        }
        console.log("User titles:", userTitles);

        if (userTitles.length === 0) {
          userTitles = getTopCategories(categoryCounts, 3);
        }
        console.log("Final user titles:", userTitles);

        // Process titles, replace with related categories if needed, and filter out those without products
        const finalTitles = userTitles.reduce((acc, title) => {
          const lowercaseTitle = title.toLowerCase();
          if (categoryCounts[lowercaseTitle] > 0) {
            acc.push(lowercaseTitle);
          }
        
          const relatedCategories = findRelatedCategories(lowercaseTitle);
          relatedCategories.forEach(category => {
            if (categoryCounts[category.toLowerCase()] > 0 && !acc.includes(category.toLowerCase())) {
              acc.push(category.toLowerCase());
            }
          });
        
          return acc;
        }, []);

        console.log("Processed titles:", finalTitles);
        setTitles(finalTitles);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("An error occurred while fetching data");
      }
    };

    const getTopCategories = (categoryCounts, count) => {
      return Object.entries(categoryCounts)
        .sort((a, b) => b[1] - a[1])
        .filter(([_, count]) => count > 0)
        .slice(0, count)
        .map(([category]) => category);
    };

    const findRelatedCategories = (title) => {
      const relatedCategories = new Set();
      productCategories.forEach((group) => {
        if (
          group.categories.some(
            (cat) => cat.toLowerCase() === title.toLowerCase()
          )
        ) {
          group.categories.forEach((category) => {
            if (category.toLowerCase() !== title.toLowerCase()) {
              relatedCategories.add(category);
            }
          });
        }
      });
      return Array.from(relatedCategories);
    };

    fetchData();
  }, [status, session]);

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
