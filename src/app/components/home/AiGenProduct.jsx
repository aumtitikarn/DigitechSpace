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
              <p className="text-[#33529B] font-bold mt-3 text-[18px]">
                {t("nav.home.seemore")} ({filteredProducts.length})
              </p>
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

  useEffect(() => {
    const fetchUserData = async () => {
      if (status === "authenticated" && session.user) {
        try {
          const response = await fetch("/api/ai/interest/get", {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          });

          if (response.ok) {
            const userData = await response.json();
            if (userData.interests && userData.interests.length > 0) {
              setTitles(
                Array.isArray(userData.interests)
                  ? userData.interests
                  : userData.interests.split(",")
              );
            } else {
              await fetchTopCategories();
            }
          } else {
            const errorData = await response.json();
            console.error("Failed to fetch user interests:", errorData);
            setError(errorData.message || "Failed to fetch user interests");
            await fetchTopCategories();
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          setError("An error occurred while fetching user data");
          await fetchTopCategories();
        }
      } else if (status === "unauthenticated") {
        await fetchTopCategories();
      }
    };

    const fetchTopCategories = async () => {
      try {
        const response = await fetch("/api/project/getProjects", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const projectsData = await response.json();
          setProducts(projectsData);

          // Count projects per category
          const categoryCounts = projectsData.reduce((acc, project) => {
            acc[project.category] = (acc[project.category] || 0) + 1;
            return acc;
          }, {});

          // Sort categories by project count and get top 3
          const topCategories = Object.entries(categoryCounts)
            .sort((a, b) => b[1] - a[1])
            .filter(([_, count]) => count > 0)
            .slice(0, 3)
            .map(([category]) => category);

          setTitles(topCategories);
        } else {
          console.error("Failed to fetch projects");
          setError("Failed to fetch projects");
        }
      } catch (error) {
        console.error("Error fetching projects:", error);
        setError("An error occurred while fetching projects");
      }
    };

    fetchUserData();
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