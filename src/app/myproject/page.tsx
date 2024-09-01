"use client";
import React from "react";
import Link from "next/link";
import { IoIosStar } from "react-icons/io";
import { MdAccountCircle } from "react-icons/md";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import Container from "../components/Container";
import { useTranslation } from "react-i18next";
import { OrbitProgress } from "react-loading-indicators";
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

// Products array
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
  {
    image:
      "https://cdn.stock2morrow.com/upload/book/1555_s2m-standard-banner-5.jpg",
    name: "Another Project",
    author: "Titikarn Waitayasuwan",
    rating: "4.5",
    reviews: 15,
    sold: 20,
    price: "75,000",
  },
  {
    image:
      "https://cdn.stock2morrow.com/upload/book/1555_s2m-standard-banner-5.jpg",
    name: "Another Project",
    author: "Titikarn Waitayasuwan",
    rating: "4.5",
    reviews: 15,
    sold: 20,
    price: "75,000",
  },
  {
    image:
      "https://cdn.stock2morrow.com/upload/book/1555_s2m-standard-banner-5.jpg",
    name: "Another Project",
    author: "Titikarn Waitayasuwan",
    rating: "4.5",
    reviews: 15,
    sold: 20,
    price: "75,000",
  },
  {
    image:
      "https://cdn.stock2morrow.com/upload/book/1555_s2m-standard-banner-5.jpg",
    name: "Another Project",
    author: "Titikarn Waitayasuwan",
    rating: "4.5",
    reviews: 15,
    sold: 20,
    price: "75,000",
  },
  {
    image:
      "https://cdn.stock2morrow.com/upload/book/1555_s2m-standard-banner-5.jpg",
    name: "Another Project",
    author: "Titikarn Waitayasuwan",
    rating: "4.5",
    reviews: 15,
    sold: 20,
    price: "75,000",
  },
];

// ReviewCard Component
const ReviewCard: React.FC<{ product: Product; showButton?: boolean }> = ({
  product,
  showButton,
}) => {
  const { t, i18n } = useTranslation("translation");
  return (
    <Link href="/project/projectreceive">
      <div className="relative rounded-[10px] border border-[#BEBEBE] bg-white p-4">
        <div className="w-auto h-auto flex flex-col">
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
            <div className="flex items-center mb-2">
              <span className="text-gray-500 mr-2 text-2xl">
                <MdAccountCircle />
              </span>
              <p className="text-sm text-gray-600 truncate">{product.author}</p>
            </div>
            <div className="flex items-center mb-2">
              <span className="text-yellow-500 mr-2 text-lg">
                <IoIosStar />
              </span>
              <span className="text-gray-600 text-xs lg:text-sm truncate">
                {product.rating} ({product.reviews}) | {t("nav.project.projectdetail.sold")} {product.sold}
              </span>
            </div>
            <p className="text-lg font-bold text-[#33529B]">
              {product.price} THB
            </p>
            {showButton && (
              <div className="flex flex-col items-center my-2">
                <button className="bg-[#33539B] text-white px-11 py-2 rounded-lg text-xs  mt-1">
                  <p className="font-bold">{t("nav.myproject.check")}</p>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

// MyProject Component
const MyProject: React.FC = () => {
  const { data: session, status } = useSession();
  const { t, i18n } = useTranslation("translation");

  if (status === "loading") {
    return <div style={{
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      textAlign: "center",
    }}>
    <OrbitProgress variant="track-disc" dense color="#33539B" size="medium" text="" textColor="" />
  </div>;
  }

  const userProducts = products.map((product) => ({
    ...product,
    author: session?.user?.name || product.author,
  }));
  

  return (
    <div className="flex flex-col min-h-screen bg-[#FBFBFB] overflow-hidden">
      <Navbar  />
      <main className="flex-grow">
        <div className="lg:mx-64 lg:mt-10 lg:mb-10 mt-10 mb-10 mx-5">
          <h2 className="font-bold mb-4 text-[24px]">{t("nav.myproject.wait")}</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
            {userProducts.map((product, index) => (
              <ReviewCard key={index} product={product} showButton={true} />
            ))}
          </div>

          <p className="text-sm text-gray-500 mb-8">
          {t("nav.myproject.desCheck")}
          </p>

          <h2 className="font-bold mb-4 text-[24px]">{t("nav.myproject.title")}</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {userProducts.map((product, index) => (
              <ReviewCard key={index} product={product} showButton={false} />
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default MyProject;
