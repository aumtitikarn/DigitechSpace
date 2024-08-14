"use client";

import React, { useState } from "react";
import { IoIosStar } from "react-icons/io";
import { MdAccountCircle } from "react-icons/md";
import Link from "next/link";

// ProductList Component
const ProductList = ({ products }) => {
  return (
    <div className="flex flex-col items-center justify-center px-4 w-full">
      <div className="flex flex-col justify-center w-full">
        <div className="flex items-center space-x-2 mt-3">
          <p className="font-bold" style={{ fontSize: "24px" }}>
            Website
          </p>
        </div>
        <Link href="/project/projectdetail">
          <div className="flex overflow-x-auto gap-[30px]">
            {products.map((product, index) => (
              <div
                key={index}
                className="flex-shrink-0 rounded-[10px] border border-[#BEBEBE] bg-white p-4 mb-6 mt-5"
                style={{ width: "203px", height: "275px" }}
              >
                <div className="w-full h-full flex flex-col">
                  {/* รูปภาพสินค้า */}
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
                        {product.rating} ({product.reviews}) | Sold{" "}
                        {product.sold}
                      </span>
                    </div>
                    <p className="text-lg font-bold text-[#33529B]">
                      {product.price} THB
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Link>
        <div className="flex-grow text-center">
          <p className="text-[#33529B] font-bold mt-7 text-[18px]">
            See more (128)
          </p>
        </div>
      </div>
    </div>
  );
};

const App = () => {
  const products = [
    {
      image:
        "https://cdn.stock2morrow.com/upload/book/1555_s2m-standard-banner-5.jpg",
      name: "Hi5 Website",
      author: "Titikarn Waitayasuwan",
      rating: "4.8",
      reviews: 28,
      sold: 29,
      price: "50,000",
    },
    {
      image:
        "https://cdn.stock2morrow.com/upload/book/1555_s2m-standard-banner-5.jpg",
      name: "Hi5 Website",
      author: "Titikarn Waitayasuwan",
      rating: "4.8",
      reviews: 28,
      sold: 29,
      price: "50,000",
    },
    {
      image:
        "https://cdn.stock2morrow.com/upload/book/1555_s2m-standard-banner-5.jpg",
      name: "Hi5 Website",
      author: "Titikarn Waitayasuwan",
      rating: "4.8",
      reviews: 28,
      sold: 29,
      price: "50,000",
    },
    {
      image:
        "https://cdn.stock2morrow.com/upload/book/1555_s2m-standard-banner-5.jpg",
      name: "Hi5 Website",
      author: "Titikarn Waitayasuwan",
      rating: "4.8",
      reviews: 28,
      sold: 29,
      price: "50,000",
    },
    {
      image:
        "https://cdn.stock2morrow.com/upload/book/1555_s2m-standard-banner-5.jpg",
      name: "Hi5 Website",
      author: "Titikarn Waitayasuwan",
      rating: "4.8",
      reviews: 28,
      sold: 29,
      price: "50,000",
    },
    {
      image:
        "https://cdn.stock2morrow.com/upload/book/1555_s2m-standard-banner-5.jpg",
      name: "Hi5 Website",
      author: "Titikarn Waitayasuwan",
      rating: "4.8",
      reviews: 28,
      sold: 29,
      price: "50,000",
    },
  ];

  return (
    <main className="bg-[#FBFBFB]">
      <div className="p-4">
        <ProductList products={products} />
      </div>
    </main>
  );
};

export default App;
