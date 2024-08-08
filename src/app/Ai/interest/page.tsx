'use client';

import { useState, useEffect } from "react";
import Container from "../../components/Container";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useRouter } from "next/navigation";
import { IoDocumentTextOutline } from "react-icons/io5";
import { BsBox } from "react-icons/bs";
import { MdWeb } from "react-icons/md";
import { MdOutlineAppShortcut } from "react-icons/md";
import { GoDependabot } from "react-icons/go";
import { AiOutlineDatabase } from "react-icons/ai";
import { IoTerminalOutline } from "react-icons/io5";
import { HiOutlineComputerDesktop } from "react-icons/hi2";
import { MdOutlinePhotoFilter } from "react-icons/md";

export default function Interest() {
  const router = useRouter();
  const { data: session } = useSession();
  const [selected, setSelected] = useState<string[]>([]);

  useEffect(() => {
    const storedTypes = JSON.parse(localStorage.getItem('selectedInterests') || "[]");
    if (storedTypes.length > 0) {
      setSelected(storedTypes);
    }
  }, []);

  useEffect(() => {
    if (selected.length > 0) {
      localStorage.setItem('selectedInterests', JSON.stringify(selected)); // Store selected types in local storage
    }
  }, [selected]);

  if (!session) redirect("/auth/signin");

  const handleButtonClick = (type: string) => {
    setSelected((prevSelected) => {
      if (prevSelected.includes(type)) {
        // Remove from selection if already selected
        return prevSelected.filter(item => item !== type);
      } else if (prevSelected.length < 15) {
        // Add to selection if not already selected and less than 3 selected
        return [...prevSelected, type];
      }
      return prevSelected;
    });
  };

  const handleNextClick = () => {
    if (selected.length > 0) {
      router.push("/Home");
    }
  };

  return (
    <main>
      <Container>
        <Navbar session={session} />
        <div className="flex-grow text-center p-10">
          <h2 className="text-3xl mb-10">
            What type of content are you most interested in?
          </h2>
          <div className="mt-10 grid grid-cols-2 gap-6 mx-auto max-w-7xl sm:grid-cols-2 lg:grid-cols-4">
            {[
              { type: "Document", icon: <IoDocumentTextOutline size={24} /> },
              { type: "Model/3D", icon: <BsBox size={24} /> },
              { type: "Website", icon: <MdWeb size={24} /> },
              { type: "MobileApp", icon: <MdOutlineAppShortcut size={24} /> },
              { type: "AI", icon: <GoDependabot size={24} /> },
              { type: "Datasets", icon: <AiOutlineDatabase size={24} /> },
              { type: "IOT", icon: <IoTerminalOutline size={24} /> },
              { type: "Program", icon: <HiOutlineComputerDesktop size={24} /> },
              { type: "Photo/Art", icon: <MdOutlinePhotoFilter size={24} /> },
            ].map(({ type, icon }) => (
              <button
                key={type}
                className={`hover:bg-slate-200 rounded-lg border bg-white shadow-xl w-[170px] h-[71px] flex flex-row items-center justify-center mx-auto space-x-2 ${
                  selected.includes(type) ? "border-blue-500" : "border-gray-300"
                }`}
                onClick={() => handleButtonClick(type)}
                disabled={selected.length >= 15 && !selected.includes(type)} // Disable if limit is reached
              >
                {icon}
                <span className="text-gray-700">{type}</span>
              </button>
            ))}
          </div>
          <button
            className="mt-10 lg:px-[100px] lg:py-3 lg:w-auto lg:ml-auto lg:mr-20 w-full rounded-md bg-[#33539B] px-3 py-3 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-slate-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#33539B]"
            onClick={handleNextClick}
            disabled={selected.length === 0}
          >
            Next
          </button>
        </div>
        <Footer />
      </Container>
    </main>
  );
}
