"use client";

import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useSession } from "next-auth/react";
import { IoIosStar } from "react-icons/io";
import { MdAccountCircle } from "react-icons/md";
import Link from "next/link";

type Product = {
  image: string;
  name: string;
  author: string;
  rating: string;
  reviews: number;
  sold: number;
  price: string;
};

// Define the type for the ProductList props
interface ProductListProps {
  products: Product[];
}

// ProductList Component
const ProductList: React.FC<ProductListProps> = ({ products }) => {
  const { data: session } = useSession();

  return (
    <div className="flex-grow">
      <Navbar session={session} />
      <div className="lg:mx-64 lg:mt-20 lg:mb-20 mt-10 mb-10 mx-5">
        <h1 className="text-[24px] font-bold">Ordered items</h1>
        <div>
          {products.map((product, index) => (
            <Link key={index} href="/projectdetail" passHref>
              <div className="mt-2">
                <div className="w-full h-auto flex-shrink-0 rounded-[5px] border-[0.5px] border-gray-400 bg-white shadow-sm mt-5 flex items-center p-4">
                  {/* Product Image */}
                  <img
                    src={product.image}
                    alt="Product Image"
                    className="w-[150px] h-[90px] rounded-md object-cover mr-4"
                  />
                  <div className="flex flex-col justify-between h-full">
                    <p className="text-lg font-semibold truncate sm:w-[190px] lg:w-[1200px]">{product.name}</p>
                    <div className="flex items-center">
                      <span className="text-gray-500 mr-2 text-2xl">
                        <MdAccountCircle />
                      </span>
                      <p className="text-sm text-gray-600 truncate sm:w-[190px] lg:w-[1200px]">{product.author}</p>
                    </div>
                    <div className="flex items-center">
                      <span className="text-yellow-500 mr-2">
                        <IoIosStar />
                      </span>
                      <span className="text-sm text-gray-600">
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
            </Link>
          ))}
        </div>
        <div className="mt-10">
          <button
            type="submit"
            className=" flex w-full justify-center rounded-md bg-[#33539B] px-3 py-3 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-slate-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Payment with debit/credit card
          </button>
          <button
            type="submit"
            className="mt-5 flex w-full justify-center rounded-md bg-[#33539B] px-3 py-3 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-slate-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Payment with mobile banking
          </button>
        </div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const products: Product[] = [
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
    // Add more products as needed
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#FBFBFB]">
      <main className="flex-grow">
        <ProductList products={products} />
      </main>
      <Footer />
    </div>
  );
};

export default App;
