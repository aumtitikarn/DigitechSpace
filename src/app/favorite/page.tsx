'use client';
import React from 'react';
import Link from 'next/link';
import { IoIosStar } from 'react-icons/io';
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import Container from "../components/Container";

interface favoriteCardProps {
  title: string;
  author: string;
  rating: number;
  reviews: number;
  price: string;
}

const ReviewCard: React.FC<favoriteCardProps> = ({ title, author, rating, reviews, price }) => {
  return (
    <Link href="/projectdetail">
      <div className="flex items-center border-2 border-gray-300 rounded-lg shadow-md mb-2 p-4">
        <div className="flex-shrink-0 w-40 h-auto mr-4">
          <img src="/face.png" className="w-full h-auto object-cover rounded shadow-sm" />
        </div>
        <div className="flex flex-col justify-between flex-1">
          <div className="card-header mb-2">
            <h2 className="text-lg font-semibold">{title}</h2>
          </div>
          <div className="author mb-2 flex items-center">
            <img
              src="https://via.placeholder.com/50"
              className="w-12 h-12 object-cover rounded-full mr-2"
            />
            <span className="text-base">{author}</span>
          </div>
          <div className="rating flex items-center mb-2">
            <IoIosStar className="text-yellow-500 text-xl mr-1" />
            <span className="text-base">{rating} ({reviews})</span>
          </div>
          <div className="price text-base font-semibold text-green-600">{price}</div>
        </div>
      </div>
    </Link>
  );
};

const favorite: React.FC = () => {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  if (!session) {
    redirect("/auth/signin");
    return null;
  }
  
  return (
    <Container>
      <Navbar session={session} />
      <main className="flex-grow px-6 py-12 lg:px-8">
        <div className="container mx-auto mt-5">
          <h1 className="text-3xl md:text-4xl font-bold mb-8">Favorite</h1>
          <div className="review-list space-y-4">
            <ReviewCard
              title="Hi5 Website"
              author={session.user?.name || "Anonymous"}
              rating={4.8}
              reviews={28}
              price="50,000 THB"
            />
            <ReviewCard
              title="Hi5 Website"
              author={session.user?.name || "Anonymous"}
              rating={4.8}
              reviews={28}
              price="50,000 THB"
            />
          </div>
        </div>
      </main>
      <Footer />
    </Container>
  );
};

export default favorite;
