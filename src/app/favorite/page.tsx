"use client";
import React from "react";
import Link from "next/link";
import { IoIosStar } from "react-icons/io";
import { MdAccountCircle } from "react-icons/md";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useTranslation } from "react-i18next";

// Define the Product type
interface Product {
  image: string;
  name: string;
  author: string;
  rating: string;
  reviews: number;
  sold: number;
  price: string;
}

// ReviewCard Component
const ReviewCard: React.FC<{ product: Product }> = ({ product }) => {
  const { t, i18n } = useTranslation("translation");
  return (
    <div
      className="rounded-[10px] border border-[#BEBEBE] bg-white p-4"
      style={{ width: "100%", height: "275px" }} // Ensuring consistent height
    >
      <div className="w-full h-full flex flex-col ">
        {/* Product Image */}
        <img
          src={product.image}
          alt="Product Image"
          className="w-full h-[150px] rounded-md object-cover mb-4"
        />
        <div className="flex flex-col h-full">
          <p className="text-lg font-semibold mb-2 truncate">
            {product.name}
          </p>
          <div className="flex mb-2">
            <span className="text-gray-500 mr-2 text-2xl">
              <MdAccountCircle />
            </span>
            <p className="text-sm text-gray-600 truncate">
              {product.author}
            </p>
          </div>
          <div className="flex mb-2">
            <span className="text-yellow-500 mr-2">
              <IoIosStar />
            </span>
            <span className="lg:text-sm text-gray-600 text-[12px] truncate">
              {product.rating} ({product.reviews}) | {t("nav.project.projectdetail.sold")} {product.sold}
            </span>
          </div>
          <p className="text-lg font-bold text-[#33529B]">
            {product.price} THB
          </p>
        </div>
      </div>
    </div>
  );
};

// Main Review Component
const Favorite: React.FC = () => {
  const { t, i18n } = useTranslation("translation");
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  if (!session) {
    redirect("/auth/signin");
    return null;
  }

  // Products array
  const products: Product[] = [
    {
      image:
        "https://cdn.stock2morrow.com/upload/book/1555_s2m-standard-banner-5.jpg",
      name: "Hi5 Website",
      author: "Titikarn Waita",
      rating: "4.8",
      reviews: 28,
      sold: 29,
      price: "50,000",
    },
    {
      image:
        "https://cdn.stock2morrow.com/upload/book/1555_s2m-standard-banner-5.jpg",
      name: "Another Project",
      author: "Titikarn Waita",
      rating: "4.5",
      reviews: 15,
      sold: 20,
      price: "75,000",
    },
    {
      image:
        "https://cdn.stock2morrow.com/upload/book/1555_s2m-standard-banner-5.jpg",
      name: "Hi5 Website",
      author: "Titikarn Waita",
      rating: "4.8",
      reviews: 28,
      sold: 29,
      price: "50,000",
    },
    {
      image:
        "https://cdn.stock2morrow.com/upload/book/1555_s2m-standard-banner-5.jpg",
      name: "Another Project",
      author: "Titikarn Waitattttt",
      rating: "4.5",
      reviews: 15,
      sold: 20,
      price: "75,000",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#FBFBFB] overflow-hidden">
      <Navbar session={session} />
      <main className="flex-grow">
        <div className="lg:mx-64 lg:mt-10 lg:mb-10 mt-10 mb-10 mx-5">
          <h1 className="font-bold mb-4 text-[24px]">{t("nav.favorite")}</h1>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map((product, index) => (
              <Link key={index} href="/project/projectdetail">
                <ReviewCard product={product} />
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Favorite;
