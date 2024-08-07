"use client"

import Image from "next/image";
import Container from "../components/Container";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

export default function Home() {

    const { data: session } = useSession();
    if (!session) redirect("/auth/signin");
    console.log(session)

  return (
    <main>
      <Container>
        <Navbar session={session} />
          <div className="flex-grow text-center p-10">
            <h3 className="text-5xl">Welcome, {session?.user?.name}</h3>
            <p className="text-2xl mt-3">Your email address: {session?.user?.email}</p>
            <p className="text-2xl mt-3">Your role: {session?.user?.role}</p>
          </div>
        <Footer />
      </Container>
    </main>
    
  );
}