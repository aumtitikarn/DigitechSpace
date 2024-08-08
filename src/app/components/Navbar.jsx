import React, { useState } from "react";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { MdGTranslate, MdAccountCircle } from "react-icons/md";
import { FaHeart } from "react-icons/fa";
import { IoIosNotifications } from "react-icons/io";
import { FaBoxOpen, FaStar } from "react-icons/fa";
import { BiSolidExit } from "react-icons/bi";
import { FaWallet, FaMoneyBillTrendUp } from "react-icons/fa6";
import { IoMdClose } from 'react-icons/io';

function CustomNavbar({ session }) {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAccountBoxVisible, setAccountBoxVisible] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleAccountBox = () => {
    setAccountBoxVisible(!isAccountBoxVisible);
  };

  const accountBoxMarginTop = session?.user?.role === "StudentUser" ? "mt-[451px]" : "mt-[390px]";

  return (
    <nav className="bg-[#0B1E48] shadow-md p-5 relative z-50">
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
              className="ml-[19px]"
            />
          </Link>
        </div>
        {/* ปุ่มบัญชีสำหรับมือถือ */}
        <div className="relative flex-none flex items-center lg:hidden">
          <button
            onClick={toggleAccountBox}
            className="text-white focus:outline-none"
          >
            <MdAccountCircle className="text-white text-4xl mt-3" />
          </button>
          {isAccountBoxVisible && (
            <div className={`px-3 py-3 absolute right-0 ${accountBoxMarginTop} border-2 border-white bg-gradient-to-b from-white to-[#E8F9FD] w-[373px] h-auto flex flex-col items-start shadow-lg z-2000`}>
              {/* เนื้อหาภายในกล่องข้อมูลบัญชี */}
              <div className="">
                <div className="flex items-center ">
                  <MdAccountCircle className="text-gray-600 text-6xl mt-3" />
                  <span>
                    <p className="text-[20px] mt-3 text-semibold">
                      {session?.user?.name}
                    </p>
                    <b>
                      <u className="text-[#0E6FFF]">
                        <p className="text-[14px] ml-1 text-[#0E6FFF] ">
                          View Profile
                        </p>
                      </u>
                    </b>
                  </span>
                </div>
                <div className="text-left ml-5">
                  <ul className="list-none mt-3 ">
                    {session?.user?.role !== "NormalUser" && (
                      <>
                        <li className="flex items-center ">
                          <FaWallet className="mr-5 text-2xl text-gray-600" />
                          <span className="text-[18px]">Wallet</span>
                        </li>
                        <li className="flex items-center mt-2">
                          <FaMoneyBillTrendUp className="mr-5 text-2xl text-gray-600" />
                          <span className="text-[18px]">Sell</span>
                        </li>
                      </>
                    )}
                    <Link href="/favorite">
                    <li className="flex items-center mt-2">
                      <FaHeart className="mr-5 text-2xl text-gray-600" />
                      <span className="text-[18px]">Favorite</span>
                    </li>
                    </Link>
                    <Link href="/notification">
                    <li className="flex items-center mt-2">
                      <IoIosNotifications className="mr-5 text-2xl text-gray-600" />
                      <span className="text-[18px]">Notification</span>
                    </li>
                    </Link>
                    <li className="flex items-center mt-2">
                      <FaBoxOpen className="mr-5 text-2xl text-gray-600 sm:mt-3" />
                      <span className="text-[18px]">My Project</span>
                    </li>
                    <Link href="/review">
                    <li className="flex items-center mt-2 ">
                      <FaStar className="mr-5  text-2xl text-gray-600" />
                      <span className="text-[18px]">Review</span>
                    </li>
                    </Link>
                  </ul>
                  <button
                    onClick={() => signOut()}
                    className="flex items-center w-full lg:w-auto border-t border-gray-300 lg:mt-0 lg:border-t-0 mt-3"
                  >
                    <BiSolidExit className="mr-5 mt-2 text-2xl text-gray-600" />
                    <span className="text-[18px] mt-2">Log out</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* โลโก้, เมนู, และปุ่มบัญชีสำหรับเดสทอป */}
        <div className="hidden lg:flex flex-1 items-center justify-center space-x-8">
          {/* โลโก้สำหรับเดสทอป */}
          <div className="flex-none" style={{ marginRight: "50px" }}>
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
                <Link href="/Home">
                  <p className="font-semibold text-[20px] text-white mx-16">
                    Home
                  </p>
                </Link>
              </li>
              <li>
                <Link href="/project">
                  <p className="font-semibold text-[20px] text-white mx-16">
                    Project
                  </p>
                </Link>
              </li>
              <li>
                <Link href="/blog">
                  <p className="font-semibold text-[20px] text-white mx-16">
                    Blog
                  </p>
                </Link>
              </li>
            </ul>
          </div>

          {/* ปุ่มบัญชีและแปลภาษาสำหรับเดสทอป */}
          <div
            className="flex-none flex items-center"
            style={{ marginLeft: "50px" }}
          >
            <MdGTranslate className="text-white text-4xl" />
            <button className="relative" onClick={toggleAccountBox}>
              <MdAccountCircle className="text-white text-4xl ml-5" />
              {isAccountBoxVisible && (
                <div className="px-3 py-3 absolute right-0 mt-[35px] border-2 border-white bg-gradient-to-b from-white to-[#E8F9FD] w-[373px] h-auto flex flex-col items-start shadow-lg z-2000">
                  {/* เนื้อหาภายในกล่องข้อมูลบัญชี */}
                  <div>
                    <div className="flex items-center">
                      <MdAccountCircle className="text-gray-600 text-6xl mt-3" />
                      <span>
                        <p className="text-[20px] mt-3 text-semibold">
                          {session?.user?.name}
                        </p>
                        <b>
                          <u className="text-[#0E6FFF]">
                            <p className="text-[14px] text-left text-[#0E6FFF]">
                              View Profile
                            </p>
                          </u>
                        </b>
                      </span>
                    </div>
                    <div className="text-left ml-5">
                      <ul className="list-none mt-3 ">
                        {session?.user?.role !== "NormalUser" && (
                          <>
                            <li className="flex items-center">
                              <FaWallet className="mr-5 text-2xl text-gray-600" />
                              <span className="text-[18px]">Wallet</span>
                            </li>
                            <li className="flex items-center mt-2">
                              <FaMoneyBillTrendUp className="mr-5 text-2xl text-gray-600" />
                              <span className="text-[18px]">Sell</span>
                            </li>
                          </>
                        )}
                         <Link href="/favorite">
                        <li className="flex items-center mt-2">
                          <FaHeart className="mr-5 text-2xl text-gray-600" />
                          <span className="text-[18px]">Favorite</span>
                        </li>
                        </Link>
                        <Link href="/notification">
                        <li className="flex items-center mt-2">
                          <IoIosNotifications className="mr-5 text-2xl text-gray-600" />
                          <span className="text-[18px]">Notification</span>
                        </li>
                        </Link>
                        <li className="flex items-center mt-2">
                          <FaBoxOpen className="mr-5 text-2xl text-gray-600" />
                          <span className="text-[18px]">My Project</span>
                        </li>
                        <Link href="/review">
                        <li className="flex items-center mt-2">
                          <FaStar className="mr-5 text-2xl text-gray-600" />
                          <span className="text-[18px]">Review</span>
                        </li>
                        </Link>
                      </ul>
                      <button
                        onClick={() => signOut()}
                        className="flex items-center w-full  border-t border-gray-300 lg:mt-3 lg:w-full lg:border-t "
                      >
                        <BiSolidExit className="mr-5 mt-2 text-2xl text-gray-600" />
                        <span className="text-[18px] mt-2">Log out</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* เมนูมือถือ */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-[#0B1E48] w-full h-screen z-50 fixed top-0 left-0 flex flex-col">
          <div className="flex justify-between items-center px-5 py-5">
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
              className="text-white text-2xl focus:outline-none"
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
          <ul className="flex-1 px-5 space-y-5 mt-10">
        <li className="border-t border-gray-300 pt-2">
          <Link href="/Home">
            <p className="font-semibold text-[20px] text-white">Home</p>
          </Link>
        </li>
        <li className="border-t border-gray-300 pt-2">
          <Link href="/project">
            <p className="font-semibold text-[20px] text-white">Project</p>
          </Link>
        </li>
        <li className="border-t border-gray-300 pt-2 flex items-center justify-between">
          <Link href="/blog" className="flex-1">
            <p className="font-semibold text-[20px] text-white">Blog</p>
          </Link>
        </li>
        <li className="flex justify-center border-t border-gray-300 pt-2 ">
          <MdGTranslate className="text-white text-4xl mt-3" />
        </li>
      </ul>
    </div>
      )}
    </nav>
  );
}

export default CustomNavbar;
