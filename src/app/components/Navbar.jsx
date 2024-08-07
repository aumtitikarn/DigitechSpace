import React, { useState } from 'react';
import Link from 'next/link';
import { signOut } from 'next-auth/react';
import { MdGTranslate, MdAccountCircle } from "react-icons/md";

function CustomNavbar({ session }) {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="bg-[#0B1E48] shadow-md p-5">
      <div className="flex items-center justify-between lg:mx-60">
        {/* ปุ่มเมนูสำหรับหน้าจอมือถือ */}
        <div className="block lg:hidden">
          <button
            onClick={toggleMobileMenu}
            className="text-white focus:outline-none"
          >
            <svg
              className="w-6 h-6 mt-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              ></path>
            </svg>
          </button>
        </div>
        {/* โลโก้สำหรับมือถือ */}
        <div className="flex-1 flex justify-center lg:hidden">
          <Link href="/">
            <img
              src="https://m1r.ai/bdebq.png"
              alt="Digitech Space logo"
              width={100}
              height={100}
            />
          </Link>
        </div>

        {/* โลโก้, เมนู, และปุ่มบัญชี */}
        <div className="hidden lg:flex flex-1 items-center justify-center space-x-8">
          {/* โลโก้สำหรับเดสทอป */}
          <div className="flex-none" style={{ marginRight: '50px' }}>
            <Link href="/">
              <img
                src="https://m1r.ai/bdebq.png"
                alt="Digitech Space logo"
                width={120}
                height={120}
              />
            </Link>
          </div>

          {/* เมนูเดสทอป */}
          <div className="flex-1 flex justify-center">
            <ul className="flex space-x-8 items-center">
              <li>
                <Link href="/home">
                  <p className="font-semibold text-[20px] text-white mx-16">Home</p>
                </Link>
              </li>
              <li>
                <Link href="/project">
                  <p className="font-semibold text-[20px] text-white mx-16">Project</p>
                </Link>
              </li>
              <li>
                <Link href="/blog">
                  <p className="font-semibold text-[20px] text-white mx-16">Blog</p>
                </Link>
              </li>
            </ul>
          </div>

          {/* ปุ่มบัญชีและแปลภาษาสำหรับเดสทอป */}
          <div className="flex-none flex items-center" style={{ marginLeft: '50px' }}>
            <MdGTranslate className="text-white text-4xl" />
            <MdAccountCircle className="text-white text-4xl ml-5"/>
          </div>
        </div>

        {/* เมนูสำหรับมือถือ */}
        {isMobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 bg-[#0B1E48] z-50 flex flex-col p-4">
            <div className="flex justify-between items-center mb-4">
              <Link href="/">
                <img
                  src="https://m1r.ai/bdebq.png"
                  alt="Digitech Space logo"
                  width={100}
                  height={100}
                />
              </Link>
              <button
                onClick={toggleMobileMenu}
                className="text-white focus:outline-none"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  ></path>
                </svg>
              </button>
            </div>
            <ul className="flex flex-col mt-5">
              <li className="border-t border-gray-300">
                <Link href="/home">
                  <p className="font-semibold text-base py-4 text-white">Home</p>
                </Link>
              </li>
              <li className="border-t border-gray-300">
                <Link href="/project">
                  <p className="font-semibold text-base py-4 text-white">Project</p>
                </Link>
              </li>
              <li className="border-t border-gray-300 border-b border-gray-300">
                <Link href="/blog">
                  <p className="font-semibold text-base py-4 text-white">Blog</p>
                </Link>
              </li>
              <li className="flex justify-center mt-4">
                <MdGTranslate className="text-white text-2xl" />
              </li>
              {!session ? (
                <>
                  <li className="border-t border-gray-300">
                    <Link href="/login">
                      <p className="font-semibold text-base py-4">Login</p>
                    </Link>
                  </li>
                  <li>
                    <Link href="/register">
                      <p className="font-semibold text-base py-4">Register</p>
                    </Link>
                  </li>
                </>
              ) : (
                <>
                  {/* <li>
                    <Link href="/welcome">
                      <div className="bg-gray-500 text-white border py-2 px-3 rounded-md text-lg my-2">
                        Profile
                      </div>
                    </Link>
                  </li>
                  <li>
                    <div
                      onClick={() => signOut()}
                      className="bg-red-500 text-white border py-2 px-3 rounded-md text-lg my-2 cursor-pointer"
                    >
                      Logout
                    </div>
                  </li> */}
                </>
              )}
            </ul>
          </div>
        )}
      </div>
    </nav>
  );
}

export default CustomNavbar;
