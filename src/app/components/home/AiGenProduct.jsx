"use client";

import React from "react";
import { IoIosStar } from "react-icons/io";
import { MdAccountCircle } from "react-icons/md";

function Product1() {
  return (
    <main className="flex flex-col items-center justify-center px-4 w-full">
      <div className="flex flex-col justify-center w-full">
        <div className="flex items-center space-x-2 mt-3">
          <p className="font-bold" style={{ fontSize: "24px" }}>
            Website
          </p>
        </div>
        <div className="mt-2">
          <div className="w-full h-auto flex-shrink-0 rounded-[5px] border-[0.5px] border-gray-400 bg-white shadow-sm mt-5 flex items-center p-4">
            {/* รูปภาพสินค้า */}
            <img
              src="https://cdn.stock2morrow.com/upload/book/1555_s2m-standard-banner-5.jpg"
              alt="Product Image"
              className="w-[150px] h-[90px] rounded-md object-cover mr-4"
            />
            <div className="flex flex-col justify-between h-full">
              <p className="text-lg font-semibold">Hi5 Website</p>
              <div className="flex items-center">
                <span className="text-gray-500 mr-2 text-2xl">
                  <MdAccountCircle />
                </span>
                <p className="text-sm text-gray-600">Titikarn Waitayasuwan</p>
              </div>
              <div className="flex items-center">
                <span className="text-yellow-500 mr-2">
                  <IoIosStar />
                </span>
                <span className="text-sm text-gray-600">
                  4.8 (28) | Sold 29
                </span>
              </div>
              <p className="text-lg font-bold text-[#33529B]">50,000 THB</p>
            </div>
          </div>
        </div>
        <div className="mt-2">
          <div className="w-full h-auto flex-shrink-0 rounded-[5px] border-[0.5px] border-gray-400 bg-white shadow-sm mt-5 flex items-center p-4">
            {/* รูปภาพสินค้า */}
            <img
              src="https://cdn.stock2morrow.com/upload/book/1555_s2m-standard-banner-5.jpg"
              alt="Product Image"
              className="w-[150px] h-[90px] rounded-md object-cover mr-4"
            />
            <div className="flex flex-col justify-between h-full">
              <p className="text-lg font-semibold">Hi5 Website</p>
              <div className="flex items-center">
                <span className="text-gray-500 mr-2 text-2xl">
                  <MdAccountCircle />
                </span>
                <p className="text-sm text-gray-600">Titikarn Waitayasuwan</p>
              </div>
              <div className="flex items-center">
                <span className="text-yellow-500 mr-2">
                  <IoIosStar />
                </span>
                <span className="text-sm text-gray-600">
                  4.8 (28) | Sold 29
                </span>
              </div>
              <p className="text-lg font-bold text-[#33529B]">50,000 THB</p>
            </div>
          </div>
        </div>
        <div className="mt-2">
          <div className="w-full h-auto flex-shrink-0 rounded-[5px] border-[0.5px] border-gray-400 bg-white shadow-sm mt-5 flex items-center p-4">
            {/* รูปภาพสินค้า */}
            <img
              src="https://cdn.stock2morrow.com/upload/book/1555_s2m-standard-banner-5.jpg"
              alt="Product Image"
              className="w-[150px] h-[90px] rounded-md object-cover mr-4"
            />
            <div className="flex flex-col justify-between h-full">
              <p className="text-lg font-semibold">Hi5 Website</p>
              <div className="flex items-center">
                <span className="text-gray-500 mr-2 text-2xl">
                  <MdAccountCircle />
                </span>
                <p className="text-sm text-gray-600">Titikarn Waitayasuwan</p>
              </div>
              <div className="flex items-center">
                <span className="text-yellow-500 mr-2">
                  <IoIosStar />
                </span>
                <span className="text-sm text-gray-600">
                  4.8 (28) | Sold 29
                </span>
              </div>
              <p className="text-lg font-bold text-[#33529B]">50,000 THB</p>
            </div>
          </div>
        </div>
        <div className="flex-grow text-center">
          <p className="text-[#33529B] font-bold mt-7 text-[18px]">
            See more (128)
          </p>
        </div>
      </div>
    </main>
  );
}

export default Product1;
