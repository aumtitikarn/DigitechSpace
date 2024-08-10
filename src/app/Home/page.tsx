"use client";

import Container from "../components/Container";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Header from "../components/Header";
import Service from "../components/home/Service";
import Catagory from "../components/home/Catagory";
import Trend from "../components/home/Trend";
import AiGenProduct from "../components/home/AiGenProduct";
import AiGenProduct2 from "../components/home/AiGenProduct2";
import Blog from "../components/home/Blog";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

export default function Home() {
  const { data: session } = useSession();
  if (!session) redirect("/auth/signin");
  console.log(session);

  return (
    <main className="bg-[#FBFBFB]">
      <Navbar session={session} />
      <Container>
        <div className="lg:mx-60 mt-10 mb-5">
          <div className="mb-10">
            <Header />
          </div>
          <div className="mb-10">
            <Trend session={session} />
          </div>
          <div className="mb-10">
            <Catagory />
          </div>
          <div className="mb-10">
            <AiGenProduct />
          </div>
          <div className="mb-10">
            <AiGenProduct2 />
          </div>
          <div className="mb-10">
            <Blog />
          </div>
          <div className="mb-10">
            <Service />
          </div>
        </div>
        <Footer />
      </Container>
    </main>
  );
}
