'use client';
import React from 'react';
import Link from 'next/link';
import { IoIosStar } from 'react-icons/io';
import { MdAccountCircle } from 'react-icons/md';
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import Container from "../components/Container";

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
  return (
    <div className="relative mt-2 w-full h-auto flex-shrink-0 rounded-[5px] border-[0.5px] border-gray-400 bg-white shadow-sm mt-5 flex items-center p-4">
      {/* Product Image */}
      <img
        src={product.image}
        alt="Product Image"
        className="w-[150px] h-[90px] rounded-md object-cover mr-4"
      />
      <div className="flex flex-col flex-1 justify-between h-full">
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
            {product.rating} ({product.reviews}) | Sold {product.sold}
          </span>
        </div>
        <p className="text-lg font-bold text-[#33529B] mb-4">
          {product.price} THB
        </p>  
      </div>
    </div>
  );
};

// Main Review Component
const favorite: React.FC = () => {
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
      image: "https://cdn.stock2morrow.com/upload/book/1555_s2m-standard-banner-5.jpg",
      name: "Hi5 Website",
      author: "Titikarn Waitayasuwan",
      rating: "4.8",
      reviews: 28,
      sold: 29,
      price: "50,000",
    },
    {
      image: "https://cdn.stock2morrow.com/upload/book/1555_s2m-standard-banner-5.jpg",
      name: "Another Project",
      author: "Titikarn Waitayasuwan",
      rating: "4.5",
      reviews: 15,
      sold: 20,
      price: "75,000",
    }
  ];

  return (
    <Container>
      <Navbar session={session} />
      <main className="lg:mx-60 mt-10 mb-5">
        <div >
          <h1 className="text-3xl md:text-4xl font-bold mb-8">Favorite</h1>
          <div className="review-list space-y-4">
            {products.map((product, index) => (
              <Link key={index} href="/project/projectdetail">
                <ReviewCard product={product} />
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </Container>
  );
};

export default favorite;
