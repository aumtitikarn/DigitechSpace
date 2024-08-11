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

// ReviewCard Component
const ReviewCard: React.FC<{ products: Product[]; showButton: boolean }> = ({ products, showButton }) => {
  return (
    <div className="flex flex-col items-center justify-center px-4 w-full">
      <div className="flex flex-col justify-center w-full">
      <Link href="/project/projectreceive">
        {products.map((product) => (
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
                {showButton && (
                  <div className="absolute bottom-4 lg:right-4 right-2">
                    <button className="bg-blue-600 text-white px-4 py-1 md:px-6 md:py-2 rounded-lg text-xs md:text-sm">
                      Check the project
                    </button>
                  </div>
                )}
              </div>
            </div>
        ))}
         </Link>
      </div>
    </div>
  );
};

// MyProject Component
const MyProject: React.FC = () => {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  if (!session) {
    redirect("/auth/signin");
    return null;
  }

  // Update products array with session data
  const userProducts = products.map(product => ({
    ...product,
    author: session.user?.name || product.author,
  }));

  return (
    <Container>
      <Navbar session={session} />
      <div className="flex-grow lg:mx-40 lg:mt-10 lg:mb-20 mt-10 mb-10 ml-5">
        <div className="container mx-auto mt-5 lg:ml-20">
          <h2 className="text-xl font-bold mb-4">Waiting to check</h2>
          <div className="review-list space-y-4 mb-6">
            <ReviewCard products={userProducts} showButton={true} />
          </div>

          <p className="text-sm text-gray-500 mb-8">
            *Please inspect the product and press the "Check the project" button before 7 days.<br />
            If you do not press the button, you will not be able to file a complaint and refund.
          </p>

          <h2 className="text-xl font-bold mb-4">My project</h2>
          <div className="review-list space-y-4">
            <ReviewCard products={userProducts} showButton={false} />
          </div>
        </div>
      </div>
      <Footer />
    </Container>
  );
};

export default MyProject;
