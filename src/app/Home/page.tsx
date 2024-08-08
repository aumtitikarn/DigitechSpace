"use client";

import Container from "../components/Container";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Header from "../components/Header";
import Service from "../components/home/Service";
import Catagory from "../components/home/Catagory";
import Trend from "../components/home/Trend";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

export default function Home() {
  const { data: session } = useSession();
  if (!session) redirect("/auth/signin");
  console.log(session);

  return (
    <main>
      <Navbar session={session} />
      <Container>
        <div className="lg:mx-60  mt-5"> 
          <Header />
          <Trend session={session}/>
          <Catagory />
          <Service />
          <div className="flex-grow text-center p-10">
            <h3 className="text-5xl">Welcome, {session?.user?.name}</h3>
            <p className="text-2xl mt-3">Your email address: {session?.user?.email}</p>
            <p className="text-2xl mt-3">Your role: {session?.user?.role}</p>
          </div>
        </div>
        <Footer />
      </Container>
    </main>
  );
}
