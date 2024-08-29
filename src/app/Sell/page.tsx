"use client";

import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useSession } from "next-auth/react";
import { IoIosStar } from "react-icons/io";
import { MdAccountCircle } from "react-icons/md";
import Link from "next/link";
import { VscEdit } from "react-icons/vsc";
import { MdDeleteOutline } from "react-icons/md";
import { useTranslation } from "react-i18next";

// Define the Product type
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

// Modal Component for confirmation
const ConfirmDeleteModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}> = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;
  const { t, i18n } = useTranslation("translation");
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-[300px]">
        <p className="mt-4 text-center font-bold">
        {t("nav.sell.want")}
        </p>
        <div className="mt-6 flex justify-center space-x-3">
          <button
            className="bg-gray-200 px-4 py-2 rounded-md"
            onClick={onClose}
          >
            {t("nav.sell.no")}
          </button>
          <button
            className="bg-[#9B3933] text-white px-4 py-2 rounded-md"
            onClick={onConfirm}
          >
            {t("nav.sell.yes")}
          </button>
        </div>
      </div>
    </div>
  );
};

// ProductList Component
const ProductList: React.FC<ProductListProps> = ({ products }) => {
  const { data: session } = useSession();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const { t, i18n } = useTranslation("translation");

  const handleDeleteClick = (product: Product) => {
    setProductToDelete(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setProductToDelete(null);
  };

  const handleConfirmDelete = () => {
    if (productToDelete) {
      // Logic to delete the product
      console.log("Deleting product:", productToDelete);
      // Close the modal after deletion
      setIsModalOpen(false);
      setProductToDelete(null);
    }
  };

  return (
    <div className="flex-grow">
      <Navbar  />
      <div className="lg:mx-64 lg:mt-10 lg:mb-10 mt-10 mb-10 mx-5">
        <h1 className="text-[24px] font-bold">{t("nav.sell.title")}</h1>
        <div>
          <div className="mt-5">
            <Link href="/Sell/AddProject">
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-[#33539B] px-3 py-3 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-sky-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                <p className="text-[18px]">{t("nav.sell.buttAdd")}</p>
              </button>
            </Link>
            <Link href="/Sell/SellerInfo">
              <button
                type="submit"
                className="mt-5 flex w-full justify-center rounded-md bg-[#38B6FF] px-3 py-3 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-sky-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                <p className="text-[18px]">{t("nav.sell.buttSell")}</p>
              </button>
            </Link>
          </div>
          <h1 className="text-[24px] font-bold mt-10">{t("nav.sell.wait")}</h1>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
            {products.map((product, index) => (
              <Link key={index} href="/project/projectdetail" passHref>
                <div className="relative mt-2">
                  <div className="relative rounded-[10px] border border-[#BEBEBE] bg-white p-4">
                    {/* Product Image */}
                    <div className="w-auto h-auto flex flex-col">
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
                          <p className="text-sm text-gray-600 truncate">
                            {product.author}
                          </p>
                        </div>
                        <div className="flex items-center mb-2">
                          <span className="text-yellow-500 mr-2 text-lg">
                            <IoIosStar />
                          </span>
                          <span className="text-gray-600 text-xs lg:text-sm">
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
                </div>
              </Link>
            ))}
          </div>
          <h1 className="text-[24px] font-bold mt-10">{t("nav.sell.publish")}</h1>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
            {products.map((product, index) => (
              <div key={index} className="relative mt-2">
                <div className="relative rounded-[10px] border border-[#BEBEBE] bg-white p-4">
                  <Link href="/project/projectdetail" passHref>
                    <div className="w-auto h-auto flex flex-col cursor-pointer">
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
                          <p className="text-sm text-gray-600 truncate">
                            {product.author}
                          </p>
                        </div>
                        <div className="flex items-center mb-2">
                          <span className="text-yellow-500 mr-2 text-lg">
                            <IoIosStar />
                          </span>
                          <span className="text-gray-600 text-xs lg:text-sm truncate">
                            {product.rating} ({product.reviews}) | {t("nav.project.projectdetail.sold")}{" "}
                            {product.sold}
                          </span>
                        </div>
                        <p className="text-lg font-bold text-[#33529B]">
                          {product.price} THB
                        </p>
                      </div>
                    </div>
                  </Link>
                  {/* Icons */}
                  <div className="reletive flex justify-between lg:px-10 md:px-[50px] px-5 my-2">
                    <Link href="/Sell/AddProject">
                      <VscEdit
                        size={20}
                        className="text-gray-500 hover:text-[#33539B]"
                      />
                    </Link>
                    <MdDeleteOutline
                      size={20}
                      className="text-gray-500 hover:text-red-500 cursor-pointer"
                      onClick={() => handleDeleteClick(product)}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Confirm Delete Modal */}
      <ConfirmDeleteModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onConfirm={handleConfirmDelete}
      />
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
    {
      image:
        "https://cdn.stock2morrow.com/upload/book/1555_s2m-standard-banner-5.jpg",
      name: "Flutter Developer",
      author: "Seksit Panyapat",
      rating: "4.9",
      reviews: 37,
      sold: 42,
      price: "100,000",
    },
    {
      image:
        "https://cdn.stock2morrow.com/upload/book/1555_s2m-standard-banner-5.jpg",
      name: "Flutter Developer",
      author: "Seksit Panyapat",
      rating: "4.9",
      reviews: 37,
      sold: 42,
      price: "100,000",
    },
    {
      image:
        "https://cdn.stock2morrow.com/upload/book/1555_s2m-standard-banner-5.jpg",
      name: "Flutter Developer",
      author: "Seksit Panyapat",
      rating: "4.9",
      reviews: 37,
      sold: 42,
      price: "100,000",
    },
    {
      image:
        "https://cdn.stock2morrow.com/upload/book/1555_s2m-standard-banner-5.jpg",
      name: "Flutter Developer",
      author: "Seksit Panyapat",
      rating: "4.9",
      reviews: 37,
      sold: 42,
      price: "100,000",
    },
    {
      image:
        "https://cdn.stock2morrow.com/upload/book/1555_s2m-standard-banner-5.jpg",
      name: "Flutter Developer",
      author: "Seksit Panyapat",
      rating: "4.9",
      reviews: 37,
      sold: 42,
      price: "100,000",
    },
    {
      image:
        "https://cdn.stock2morrow.com/upload/book/1555_s2m-standard-banner-5.jpg",
      name: "Flutter Developer",
      author: "Seksit Panyapat",
      rating: "4.9",
      reviews: 37,
      sold: 42,
      price: "100,000",
    },
    {
      image:
        "https://cdn.stock2morrow.com/upload/book/1555_s2m-standard-banner-5.jpg",
      name: "Flutter Developer",
      author: "Seksit Panyapat",
      rating: "4.9",
      reviews: 37,
      sold: 42,
      price: "100,000",
    },
  ];

  return (
    <div>
      <ProductList products={products} />
      <Footer />
    </div>
  );
};

export default App;
