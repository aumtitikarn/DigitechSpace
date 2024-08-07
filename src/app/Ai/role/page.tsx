"use client"

import Image from "next/image";
import Container from "../../components/Container";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useRouter } from 'next/navigation'

export default function Role() {
    const router = useRouter();

    const { data: session } = useSession();
    if (!session) redirect("/auth/signin");
    console.log(session);

    // ฟังก์ชันเปลี่ยนเส้นทาง
    const handleButtonClick = () => {
        router.push('/Ai/interest');
    };

    return (
        <main>
            <Container>
                <Navbar session={session} />
                <div className="flex-grow text-center p-10">
    <h2 className="text-3xl mb-10">What is your role?</h2>
    <div className="mt-10 grid grid-cols-2 gap-6 mx-auto max-w-7xl sm:grid-cols-2 lg:grid-cols-4">
        {/* สร้างกล่อง 8 กล่อง */}
        <button
            onClick={handleButtonClick}
            className="hover:bg-slate-200 rounded-lg border border-gray-300 bg-white shadow-xl w-[170px] h-[71px] flex-shrink-0 mx-auto"
        >
            <span className="text-gray-700">Student</span>
        </button>
        <button
            onClick={handleButtonClick}
            className="hover:bg-slate-200 rounded-lg border border-gray-300 bg-white shadow-xl w-[170px] h-[71px] flex-shrink-0 mx-auto"
        >
            <span className="text-gray-700">Professor</span>
        </button>
        <button
            onClick={handleButtonClick}
            className="hover:bg-slate-200 rounded-lg border border-gray-300 bg-white shadow-xl w-[170px] h-[71px] flex-shrink-0 mx-auto"
        >
            <span className="text-gray-700">Developer</span>
        </button>
        <button
            onClick={handleButtonClick}
            className="hover:bg-slate-200 rounded-lg border border-gray-300 bg-white shadow-xl w-[170px] h-[71px] flex-shrink-0 mx-auto"
        >
            <span className="text-gray-700">Designer</span>
        </button>
        <button
            onClick={handleButtonClick}
            className="hover:bg-slate-200 rounded-lg border border-gray-300 bg-white shadow-xl w-[170px] h-[71px] flex-shrink-0 mx-auto"
        >
            <span className="text-gray-700">Executive</span>
        </button>
        <button
            onClick={handleButtonClick}
            className="hover:bg-slate-200 rounded-lg border border-gray-300 bg-white shadow-xl w-[170px] h-[71px] flex-shrink-0 mx-auto"
        >
            <span className="text-gray-700">Teacher</span>
        </button>
        <button
            onClick={handleButtonClick}
            className="hover:bg-slate-200 rounded-lg border border-gray-300 bg-white shadow-xl w-[170px] h-[71px] flex-shrink-0 mx-auto"
        >
            <span className="text-gray-700">Researcher</span>
        </button>
        <button
            onClick={handleButtonClick}
            className="hover:bg-slate-200 rounded-lg border border-gray-300 bg-white shadow-xl w-[170px] h-[71px] flex-shrink-0 mx-auto"
        >
            <span className="text-gray-700">Other</span>
        </button>
    </div>
</div>

                <Footer />
            </Container>
        </main>
    );
}
