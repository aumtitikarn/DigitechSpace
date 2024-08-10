'use client';
import React from 'react';
import Link from 'next/link';
import { IoIosStar } from 'react-icons/io';
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import Container from "../components/Container";

interface ReviewCardProps {
    title: string;
    author: string;
    rating: number;
    reviews: number;
    price: string;
    showButton?: boolean; // Add this prop
  }
  
  const ReviewCard: React.FC<ReviewCardProps> = ({ title, author, rating, reviews, price, showButton = false }) => {
    return (
        <Link href="/project/projectreceive">
        <div className="flex items-center border-2 border-gray-300 rounded-lg shadow-md mb-2 p-4 w-full max-w-[90%] lg:max-w-[950px] relative">
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
          {showButton && (
  <button className="bg-blue-600 text-white px-4 py-1 md:px-6 md:py-2 rounded-lg text-xs md:text-sm absolute right-4 bottom-4">
    Check the project
  </button>
)}

        </div>
      </Link>
    );
  };
  

const MyProject: React.FC = () => {
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
      <div className="flex-grow lg:mx-40 lg:mt-10 lg:mb-20 mt-10 mb-10 ml-5">
        {/* Waiting to check section */}
        <div  className="container mx-auto mt-5 lg:ml-20">
            <h2 className="text-xl font-bold mb-4">Waiting to check</h2>
        <div className="review-list space-y-4 mb-6">
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
       
        <p className="text-sm text-gray-500 mb-8">
          *Please inspect the product and press the "Check the project" button before 7 days.
          If you do not press the button, you will not be able to file a complaint and refund.
        </p>

        {/* My project section */}
        <h2 className="text-xl font-bold mb-4">My project</h2>
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
      </div>
      <Footer />
    </Container>
  );
};
const myproject = () => {
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
        <div className="flex-grow lg:mx-40 lg:mt-10 lg:mb-20 mt-10 mb-10 ml-5">
          {/* Waiting to check section */}
          <div  className="container mx-auto mt-5 lg:ml-20">
          <h2 className="text-xl font-bold mb-4">Waiting to check</h2>
          <div className="review-list space-y-4 mb-6">
            <ReviewCard
              title="Hi5 Website"
              author={session.user?.name || "Anonymous"}
              rating={4.8}
              reviews={28}
              price="50,000 THB"
              showButton={true} // Show the button
            />
            <ReviewCard
              title="Hi5 Website"
              author={session.user?.name || "Anonymous"}
              rating={4.8}
              reviews={28}
              price="50,000 THB"
              showButton={true} // Show the button
            />
          </div>
  
          <p className="text-sm text-gray-500 mb-8">
                *Please inspect the product and press the "Check the project" button before 7 days.<br />
                If you do not press the button, you will not be able to file a complaint and refund.
        </p>

  
          {/* My project section */}
          <h2 className="text-xl font-bold mb-4">My project</h2>
          <div className="space-y-4">
            <ReviewCard
              title="Hi5 Website"
              author={session.user?.name || "Anonymous"}
              rating={4.8}
              reviews={28}
              price="50,000 THB"
              showButton={false} // Hide the button
            />
            <ReviewCard
              title="Hi5 Website"
              author={session.user?.name || "Anonymous"}
              rating={4.8}
              reviews={28}
              price="50,000 THB"
              showButton={false} // Hide the button
            />
          </div>
          </div>
        </div>
        <Footer />
      </Container>
    );
  };
  
  export default myproject;
  
