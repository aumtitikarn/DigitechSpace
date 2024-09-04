"use client";

import React, { useEffect, useState } from "react";
import { IoIosStar } from "react-icons/io";
import { MdAccountCircle } from "react-icons/md";
import Link from "next/link";
import { useTranslation } from 'react-i18next';
import { useSession } from "next-auth/react";

// Define ProductList Component
const ProductList = ({ products, titles }) => {
  const { t } = useTranslation('translation');
  
  return (
    <div className="flex flex-col items-center justify-center w-full">
      {titles.map((title, idx) => {
        const processedTitle = title.includes('/') ? title.split('/')[0].toLowerCase() : title.toLowerCase();
        return (
          <div key={idx} className="flex flex-col justify-center w-full mb-3">
            <div className="flex items-center space-x-2 mt-3">
              <p className="font-bold" style={{ fontSize: "24px" }}>
                {t(`nav.project.${processedTitle}`)}
              </p>
            </div>
            <div className="flex overflow-x-auto gap-[30px]">
              {products.map((product, index) => (
                <Link key={index} href="/project/projectdetail">
                  <div
                    className="flex-shrink-0 rounded-[10px] border border-[#BEBEBE] bg-white p-4 mb-6 mt-5"
                    style={{ width: "203px", height: "275px" }}
                  >
                    <div className="w-full h-full flex flex-col">
                      {/* Product Image */}
                      <img
                        src={product.image}
                        alt="Product Image"
                        className="w-full h-[150px] rounded-md object-cover mb-4"
                      />
                      <div className="flex flex-col justify-between h-full">
                        <p className="text-lg font-semibold mb-2 truncate">
                          {product.name}
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
                          <span className="lg:text-sm text-gray-600 text-[12px]">
                            {product.rating} ({product.reviews}) | {t("nav.project.projectdetail.sold")}{" "}
                            {product.sold}
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
                {t("nav.home.seemore")} (128)
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
  const { data: session, status } = useSession();
  const [error, setError] = useState(null);
  const { t } = useTranslation('translation');

  const products = [
    {
      image: "https://cdn.stock2morrow.com/upload/book/1555_s2m-standard-banner-5.jpg",
      name: "Hi5 Website",
      author: "Titikarn Waitayasuwan",
      rating: "4.8",
      reviews: 28,
      sold: 29,
      price: "50,000",
    },
    // Add more products if needed
  ];

  useEffect(() => {
    const fetchUserData = async () => {
      if (status === "authenticated" && session.user) {
        try {
          const response = await fetch('/api/ai/interest/get', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          });
          
          if (response.ok) {
            const userData = await response.json();
            if (userData.interests && userData.interests.length > 0) {
              setTitles(Array.isArray(userData.interests) ? userData.interests : userData.interests.split(','));
            } else {
              // Set default titles if no interests are found
              setTitles(["website", "mobileapp", "ai"]);
            }
          } else {
            const errorData = await response.json();
            console.error("Failed to fetch user interests:", errorData);
            setError(errorData.message || "Failed to fetch user interests");
            // Set default titles in case of error
            setTitles(["website", "mobileapp", "ai"]);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          setError("An error occurred while fetching user data");
          // Set default titles in case of error
          setTitles(["website", "mobileapp", "ai"]);
        }
      } else if (status === "unauthenticated") {
        // Set default titles for unauthenticated users
        setTitles(["website", "mobileapp", "ai"]);
      }
    };

    fetchUserData();
  }, [status, session]);



  return (
    <main className="bg-[#FBFBFB]">
      <div className="p-4">
        <ProductList products={products} titles={titles} />
      </div>
    </main>
  );
};

export default Aigenproject;